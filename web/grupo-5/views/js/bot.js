document.addEventListener("DOMContentLoaded", function () {
    const abrirModalBtn = document.getElementById("abrirModalBtn");
    const enviarPerguntaBtn = document.getElementById("enviarPerguntaBtn");
    const perguntaInput = document.getElementById("perguntaInput");
    const respostaDiv = document.getElementById("resposta");

    // Abrir o modal ao clicar no botão
    abrirModalBtn.addEventListener("click", function () {
        const modal = new bootstrap.Modal(document.getElementById("modalPergunta"));
        modal.show();
    });

    // Enviar pergunta para o backend
    enviarPerguntaBtn.addEventListener("click", async function () {
        const pergunta = perguntaInput.value.trim();
        if (!pergunta) {
            respostaDiv.innerHTML = "<p class='text-danger'>Digite uma pergunta!</p>";
            return;
        }

        respostaDiv.innerHTML = "<p class='text-info'>Carregando resposta...</p>";

        try {
            const response = await fetch("http://localhost:3005/perguntaIA", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pergunta }),
            });

            const data = await response.json();
            respostaDiv.innerHTML = `<p class='text-success'>${data.resposta}</p>`;
        } catch (error) {
            respostaDiv.innerHTML = "<p class='text-danger'>Erro ao obter resposta.</p>";
            console.error("Erro:", error);
        }
    });
});