document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get("id");

    if (!eventoId) {
        alert("Evento não encontrado.");
        return;
    }

    try {
        const URLCompleta = `http://localhost:3005/evento/${eventoId}`;
        const evento = (await axios.get(URLCompleta)).data;

        document.querySelector(".event-image").src = evento.url_logo;
        document.querySelector(".event-description").innerHTML = `
            <h5><strong>Descrição do evento</strong></h5>
            <p>${evento.descricao}</p>
        `;
        document.querySelector(".event-details").innerHTML = `
            <h4>${evento.nome}</h4>
            <p>
                <strong>${evento.categoria}</strong><br>
                <i class="bi bi-cash"></i> ${evento.numero}<br>
                <i class="bi bi-geo-alt"></i> ${evento.endereco}
            </p>
        `;
    } catch (error) {
        console.error("Erro ao carregar detalhes do evento:", error);
        alert("Erro ao carregar os detalhes do evento.");
    }
});