const MODELO_GEMINI = "gemini-2.5-flash";
const CHAVE_LOCAL_STORAGE = "gemini_api_key_v2";
const ENDPOINT_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`;

function obterOuSolicitarApiKey() {
  let apiKey = localStorage.getItem(CHAVE_LOCAL_STORAGE);
  if (!apiKey || !apiKey.trim()) {
    const informada = window.prompt("Cole sua chave da API do Gemini (Google AI Studio):");
    if (informada && informada.trim()) {
      apiKey = informada.trim();
      localStorage.setItem(CHAVE_LOCAL_STORAGE, apiKey);
    }
  }
  return apiKey ? apiKey.trim() : "";
}

async function chamarGemini(promptUsuario) {
  const apiKey = obterOuSolicitarApiKey();
  if (!apiKey) {
    throw new Error("Chave da API do Gemini não configurada no navegador.");
  }

  const resposta = await fetch(`${ENDPOINT_GEMINI}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: promptUsuario
            }
          ]
        }
      ]
    })
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const mensagemErro =
      (dados && dados.error && dados.error.message) ||
      `Falha na requisição (${resposta.status})`;
    if (resposta.status === 400 || resposta.status === 401 || resposta.status === 403) {
      localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    }
    throw new Error(mensagemErro);
  }

  const textoResposta =
    dados &&
    dados.candidates &&
    dados.candidates[0] &&
    dados.candidates[0].content &&
    dados.candidates[0].content.parts &&
    dados.candidates[0].content.parts[0] &&
    dados.candidates[0].content.parts[0].text;

  if (!textoResposta) {
    throw new Error("A API retornou uma resposta vazia.");
  }

  return textoResposta;
}

document.addEventListener("DOMContentLoaded", () => {
  const campoPergunta =
    document.getElementById("prompt-textarea") ||
    document.getElementById("área de texto de prompt");
  const botaoEnviar = document.getElementById("enviar-btn");
  const areaResposta =
    document.getElementById("resposta-area") ||
    document.getElementById("área de resposta");

  if (!botaoEnviar) {
    console.error("Botão com ID 'enviar-btn' não encontrado. Verifique o HTML.");
    return;
  }

  botaoEnviar.addEventListener("click", async () => {
    const pergunta = campoPergunta ? campoPergunta.value.trim() : "";

    if (!pergunta) {
      alert("Por favor, escreva uma pergunta.");
      return;
    }

    if (areaResposta) {
      areaResposta.innerText = "Consultando o Gemini...";
      areaResposta.style.color = "#00bfff";
    }

    botaoEnviar.disabled = true;

    try {
      const respostaFinal = await chamarGemini(pergunta);
      if (areaResposta) {
        areaResposta.innerText = respostaFinal;
        areaResposta.style.color = "#f0f0f0";
      }
    } catch (erro) {
      if (areaResposta) {
        areaResposta.innerText = `Erro: ${erro.message}`;
        areaResposta.style.color = "#ff5555";
      }
      console.error("Erro ao chamar Gemini:", erro);
    } finally {
      botaoEnviar.disabled = false;
    }
  });
});
