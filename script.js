// NEXUS AI 100 - Motor de IA Gratuito Sem Chave de API (Pollinations AI)
const CHAVE_STORAGE = "gemini_api_key_v2";

function obterOuSolicitarApiKey() {
  return "MODO_GRATUITO_ATIVO";
}

async function chamarGemini(promptUsuario) {
  if (!promptUsuario || !promptUsuario.trim()) {
    throw new Error("Digite ou fale um comando primeiro.");
  }

  const promptCodificado = encodeURIComponent(promptUsuario.trim());
  const url = `https://text.pollinations.ai/${promptCodificado}?model=openai&seed=${Date.now()}`;

  const resposta = await fetch(url, {
    method: "GET"
  });

  if (!resposta.ok) {
    throw new Error(`Erro na conexão com a IA (HTTP ${resposta.status}). Tente novamente.`);
  }

  const textoResposta = await resposta.text();

  if (!textoResposta || !textoResposta.trim()) {
    throw new Error("A IA não retornou resposta. Tente novamente.");
  }

  return textoResposta.trim();
}

function limparChaveApi() {
  localStorage.removeItem(CHAVE_STORAGE);
  alert("Modo Gratuito Sem Chave já está ativo! Nenhuma chave é necessária.");
}
