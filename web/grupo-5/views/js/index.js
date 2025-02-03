async function obterEventos() {
    const eventosEndpoint = '/evento'; // Endpoint no backend
    const URLCompleta = `http://localhost:3005${eventosEndpoint}`; // URL completa para a requisição

    try {
        // Requisição ao backend
        const resposta = await axios.get(URLCompleta);
        const eventos = resposta.data;

        console.log("Eventos recebidos:", eventos); // Para verificar a resposta no console

        // Atualiza o container de eventos
        const eventosContainer = document.querySelector('#eventosContainer');
        eventosContainer.innerHTML = '';

        // Itera pelos eventos e adiciona ao DOM
        for (let evento of eventos) {
            // Criação da coluna responsiva
            let coluna = document.createElement('div');
            coluna.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4'); // Responsividade ajustada

            // Criação do card
            let card = document.createElement('div');
            card.classList.add('card', 'h-100', 'shadow-sm'); // Card com altura ajustável e sombra

            // Adição da imagem ao card
            let imagem = document.createElement('img');
            imagem.classList.add('card-img-top', 'img-fluid');
            imagem.src = evento.url_logo; // URL da imagem
            imagem.alt = evento.nome; // Nome do evento

            // Adiciona a funcionalidade de clique
            imagem.onclick = function () {
                exibirEventoPorId(evento._id); // Passa o ID do evento para a função
            };

            // Criação do corpo do card
            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-center');

            // Adição do título do evento
            let titulo = document.createElement('h5');
            titulo.classList.add('card-title');
            titulo.textContent = evento.nome;

            // Montagem do card
            cardBody.appendChild(titulo);
            card.appendChild(imagem);
            card.appendChild(cardBody);
            coluna.appendChild(card);

            // Adicionando a coluna ao container principal
            eventosContainer.appendChild(coluna);
        }
    } catch (error) {
        // Tratamento de erros
        console.error("Erro ao obter os eventos:", error.response?.data || error.message);
        alert("Erro ao carregar os eventos. Verifique sua conexão e tente novamente.");
    }
}


async function exibirEventoPorId(eventoId) {
    const eventoEndpoint = `/evento/${eventoId}`; 
    const URLCompleta = `http://localhost:3005${eventoEndpoint}`;

    try {
        const evento = (await axios.get(URLCompleta)).data;

        // Atualizar o modal com os detalhes do evento
        const modal = document.querySelector('#eventoModal');
        const modalTitulo = document.querySelector('#modalTitulo');
        const modalDescricao = document.querySelector('#modalDescricao');
        const modalImagem = document.querySelector('#modalImagem');
        const modalBotaoVerMais = document.querySelector('#modalVerMais');

        modalTitulo.textContent = evento.nome;
        modalDescricao.textContent = evento.descricao;
        modalImagem.src = evento.url_logo;
        modalBotaoVerMais.onclick = function () {
            window.location.href = `detalhe_evento.html?id=${evento._id}`;
        };

        modal.style.display = 'block';
    } catch (error) {
        console.error("Erro ao buscar o evento:", error);
        alert("Erro ao carregar os detalhes do evento.");
    }
}

function fecharModal() {
    const modal = document.querySelector('#eventoModal');
    modal.style.display = 'none'; // Esconde o modal
    modal.querySelector('#modalTitulo').textContent = ''; // Limpa o título
    modal.querySelector('#modalDescricao').textContent = ''; // Limpa a descrição
    modal.querySelector('#modalImagem').src = ''; // Limpa a imagem
}



// Garante que a função seja chamada após carregar o DOM
document.addEventListener('DOMContentLoaded', obterEventos);

// Função para verificar se o usuário está logado
function verificarLogin() {
    const token = localStorage.getItem('auth_token');
    
    // Se o token estiver presente, o usuário está logado
    if (token) {
        // Alterar o botão de login para "Sair"
        document.getElementById('entrar').textContent = 'Sair';
        document.getElementById('entrar').onclick = logout;
        
        // Exibir o botão "Criar Evento"
        document.getElementById('criarEvento').classList.remove('d-none');
    } else {
        // Caso contrário, o botão de login aparece como "Entrar"
        document.getElementById('entrar').textContent = 'Entrar';
        document.getElementById('entrar').onclick = mostrarLogin;
        
        // Esconder o botão "Criar Evento"
        document.getElementById('criarEvento').classList.add('d-none');
    }
}

// Função de logout
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('auth_token');
    window.location.reload(); // Recarrega a página para atualizar o estado
}

// Função para mostrar o login (poderia redirecionar para uma página de login ou exibir um modal)
function mostrarLogin(event) {
    event.preventDefault();
    window.location.href = 'login-05.html'; // Ou pode ser um modal de login
}

// Chama a função para verificar o login quando a página carregar
verificarLogin();

document.addEventListener('DOMContentLoaded', () => {
    const categorias = document.querySelectorAll('.categories-section .card');

    categorias.forEach(categoria => {
        categoria.addEventListener('click', () => {
            const categoriaSelecionada = categoria.querySelector('h5').textContent;
            localStorage.setItem('categoriaSelecionada', categoriaSelecionada);
            window.location.href = 'categoria.html';
        });
    });
});
