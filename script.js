const GEMINI_MODEL = "gemini-3.8-flash";
const LOCAL_STORAGE_KEY = "gemini_api_key_v2";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function obterOuSolicitarApiKey() {
  let apiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!apiKey || !apiKey.trim()) {
    const informada = window.prompt("Cole sua chave da API do Google Gemini (AI Studio):");
    if (informada && informada.trim()) {
      apiKey = informada.trim();
      localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
    }
  }
  return apiKey ? apiKey.trim() : "";
}

async function chamarGemini(promptUsuario) {
  const apiKey = obterOuSolicitarApiKey();
  if (!apiKey) {
    throw new Error("Chave da API do Gemini não configurada.");
  }

  const resposta = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
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

  const dados = await resposta.json();

  if (!resposta.ok) {
    const mensagemErro = dados?.error?.message || `Erro HTTP ${resposta.status}`;
    throw new Error(mensagemErro);
  }

  const textoResposta = dados?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textoResposta) {
    throw new Error("A API não retornou texto válido.");
  }

  return textoResposta;
}

function limparApiKey() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  alert("Chave da API removida. Na próxima consulta será solicitada uma nova chave.");
}
