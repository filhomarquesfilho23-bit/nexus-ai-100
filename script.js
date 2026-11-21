async function chamarGemini(promptUsuario) {
  try {
    let apiKey = localStorage.getItem("gemini_api_key");

    if (!apiKey || apiKey.trim() === "") {
      const chaveDigitada = prompt("Cole a sua chave da API do Google Gemini:");
      if (!chaveDigitada || chaveDigitada.trim() === "") {
        alert("Chave da API necessária para usar a IA.");
        return null;
      }
      apiKey = chaveDigitada.trim();
      localStorage.setItem("gemini_api_key", apiKey);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const dadosRequisicao = {
      contents: [{ parts: [{ text: promptUsuario }] }]
    };

    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosRequisicao)
    });

    if (!resposta.ok) {
      if (resposta.status === 400 || resposta.status === 403) {
        localStorage.removeItem("gemini_api_key");
      }
      throw new Error(`Erro na API: ${resposta.status}`);
    }

    const resultado = await resposta.json();

    if (
      resultado.candidates &&
      resultado.candidates[0] &&
      resultado.candidates[0].content &&
      resultado.candidates[0].content.parts[0]
    ) {
      return resultado.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Formato de resposta inesperado da API.");
    }
  } catch (erro) {
    console.error("Erro ao chamar Gemini:", erro);
    alert(`Falha ao comunicar com a IA: ${erro.message}`);
    return null;
  }
}
