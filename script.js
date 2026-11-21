// --- Código de Teste Simulada (Não usa a API real) ---
async function chamarGeminiSimulado(promptUsuario) {
    console.log("Teste Simulado: O seu prompt foi:", promptUsuario);

    // Simular um atraso de rede (para parecer real)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // --- Cenário 1: RESPOSTA DE SUCESSO ---
    // Esta é a resposta que a sua interface deve mostrar.
    const respostaSimuladaTexto = `🎉 **Teste do Nexus AI 100 Bem-Sucedido!** 🎉\n\nOlá! Recebi o seu prompt:\n\n> "${promptUsuario}"\n\nEsta é uma resposta simulada para verificar se a sua interface web, incluindo a área de resposta e o banner de anúncio, está a processar e exibir corretamente o conteúdo. A ligação funciona!`;

    // --- Cenário 2: SIMULAR ERRO (Opcional, para testar o aviso) ---
    // Descomente as duas linhas abaixo e comente a linha de sucesso para testar o erro 404.
    // return { ok: false, status: 404, error: { message: "Simulação de Modelo Não Encontrado" } };

    const resultado = {
        candidates: [{
            content: {
                parts: [{ text: respostaSimuladaTexto }]
            }
        }]
    };

    // Retornar um objeto que imita a resposta do fetch
    return { ok: true, status: 200, json: () => Promise.resolve(resultado) };
}


// --- Lógica Principal da Página ---
document.addEventListener("DOMContentLoaded", () => {
    const campoPergunta = document.getElementById("prompt-textarea");
    const botaoEnviar = document.getElementById("enviar-btn");
    const areaResposta = document.getElementById("resposta-area");

    if (botaoEnviar) {
        // Adicionar o Event Listener ao botão
        botaoEnviar.addEventListener("click", async () => {
            const pergunta = campoPergunta.value;

            if (!pergunta || pergunta.trim() === "") {
                alert("Por favor, escreva uma pergunta.");
                return;
            }

            // 1. Feedback visual na interface
            areaResposta.innerText = "A simular resposta da IA (modo teste)...";
            areaResposta.style.color = "#00bfff"; // Azul claro para o estado de teste

            // 2. Chamar a função SIMULADA em vez da real
            const respostaSimulada = await chamarGeminiSimulado(pergunta);

            // 3. Processar a resposta simulada
            if (respostaSimulada.ok) {
                const dados = await respostaSimulada.json();
                const textoFinal = dados.candidates[0].content.parts[0].text;
                // Exibir a resposta na área designada
                areaResposta.innerText = textoFinal;
                areaResposta.style.color = "#f0f0f0"; // Cor do texto original
            } else {
                // Tratar o erro simulado
                areaResposta.innerText = `Erro Simulado (${respostaSimulada.status}): ${respostaSimulada.error.message}. O sistema de aviso de erro está a funcionar.`;
                areaResposta.style.color = "red";
                console.error("Teste de erro de simulação.");
            }
        });
    } else {
        console.error("Botão com ID 'enviar-btn' não encontrado. Verifique o HTML.");
    }
});
