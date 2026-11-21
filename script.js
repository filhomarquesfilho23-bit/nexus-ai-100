async function chamarGemini(promptUsuario) {
  const MODELO = "gemini-1.5-flash"; // Usar modelo existente
  const CHAVE_LOCAL_STORAGE = "gemini_api_key_v2";

  try {
    let apiKey = localStorage.getItem(CHAVE_LOCAL_STORAGE);

    if (!apiKey || apiKey.trim() === "") {
      apiKey = prompt("Cole a sua chave da API do Google Gemini (AIza...):");
      if (!apiKey || apiKey.trim() === "") {
        alert("Chave da API é necessária.");
        return null;
      }
      apiKey = apiKey.trim();
      localStorage.setItem(CHAVE_LOCAL_STORAGE, apiKey);
    }

    // Endpoint V1, mais estável
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODELO}:generateContent?key=${apiKey}`;

    const dadosRequisicao = {
      contents: [{ parts: [{ text: promptUsuario }] }]
    };

    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosRequisicao)
    });

    if (!resposta.ok) {
       if (resposta.status === 404 || resposta.status === 403) {
          localStorage.removeItem(CHAVE_LOCAL_STORAGE); // Apagar chave inválida
       }
       const erroDetalhes = await resposta.json();
       throw new Error(`Erro na API (${resposta.status}): ${erroDetalhes.error.message}`);
    }

    const resultado = await resposta.json();
    return resultado.candidates[0].content.parts[0].text;

  } catch (erro) {
    console.error("Erro ao chamar Gemini:", erro);
    alert(`Falha ao comunicar com a IA: ${erro.message}. Verifique sua chave.`);
    return null;
  }
}

// Lógica da página
document.addEventListener("DOMContentLoaded", () => {
    const campoPergunta = document.getElementById("prompt-textarea");
    const botaoEnviar = document.getElementById("enviar-btn");
    const areaResposta = document.getElementById("resposta-area");

    if (botaoEnviar) {
        botaoEnviar.addEventListener("click", async () => {
            const pergunta = campoPergunta.value;
            if (!pergunta) {
                alert("Por favor, escreva uma pergunta.");
                return;
            }
            areaResposta.innerText = "A pensar..."; // Feedback
            const respostaDaIa = await chamarGemini(pergunta);
            if (respostaDaIa) {
                 areaResposta.innerText = respostaDaIa;
            } else {
                 areaResposta.innerText = "Não foi possível obter resposta.";
            }
        });
    }
});
