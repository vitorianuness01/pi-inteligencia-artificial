document.addEventListener('DOMContentLoaded', async () => {
    const categoriaSelecionada = localStorage.getItem('categoriaSelecionada');
    if (!categoriaSelecionada) {
        alert('Nenhuma categoria selecionada.');
        window.location.href = 'index-05.html';
        return;
    }

    document.title = `Eventos - ${categoriaSelecionada}`;
    const eventosContainer = document.querySelector('#eventosContainer');
    const tituloCategoria = document.createElement('h3');
    tituloCategoria.textContent = `Eventos de ${categoriaSelecionada}`;
    eventosContainer.parentElement.prepend(tituloCategoria);

    const eventosEndpoint = `/eventosCat?categoria=${encodeURIComponent(categoriaSelecionada)}`;
    const URLCompleta = `http://localhost:3005${eventosEndpoint}`;

    try {
        const resposta = await axios.get(URLCompleta);
        const eventos = resposta.data;

        eventosContainer.innerHTML = '';

        eventos.forEach(evento => {
            let coluna = document.createElement('div');
            coluna.classList.add('col-md-6', 'mb-3');

            let card = `
                <div class="card">
                    <img src="${evento.url_logo}" class="card-img-top" alt="${evento.nome}">
                    <div class="card-body">
                        <p class="card-text">${evento.descricao}</p>
                        <a href="detalhe_evento.html?id=${evento._id}" class="btn btn-primary">Ver Mais</a>
                    </div>
                </div>`;
            coluna.innerHTML = card;
            eventosContainer.appendChild(coluna);
        });

        if (eventos.length === 0) {
            eventosContainer.innerHTML = `<p class="text-center">Nenhum evento encontrado para a categoria <strong>${categoriaSelecionada}</strong>.</p>`;
        }
    } catch (error) {
        console.error("Erro ao carregar os eventos:", error.message);
        eventosContainer.innerHTML = '<p class="text-center">Nenhum evento cadastrado nessa categoria.</p>';
    }
});
