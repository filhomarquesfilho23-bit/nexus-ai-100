async function chamarGemini(promptUsuario) {
  try {
    const k = 'gemini_api_key';
    let apiKey = localStorage.getItem(k);
    
    if (!apiKey || apiKey === "" || apiKey === "null" || apiKey === "undefined") {
      apiKey = prompt("Por favor, insira sua chave da API do Gemini:");
      if (!apiKey) {
        alert("Chave da API não fornecida.");
        return null;
      }
      localStorage.setItem(k, apiKey);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const dadosRequisicao = {
      contents: [{ parts: [{ text: promptUsuario }] }]
    };

    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosRequisicao)
    });

    if (!resposta.ok) {
      throw new Error(`Erro na API: ${resposta.status}`);
    }

    const resultado = await resposta.json();
    
    if (resultado.candidates && resultado.candidates[0].content && resultado.candidates[0].content.parts[0].text) {
      return resultado.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Formato de resposta inesperado da API.");
    }

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Falha ao conectar com a API do Gemini. Verifique sua chave.");
    return null;
  }
}
