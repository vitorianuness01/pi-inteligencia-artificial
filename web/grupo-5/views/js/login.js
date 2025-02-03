async function loginUser(event) {
    event.preventDefault(); // Evita o reload da página ao enviar o formulário

    // URL do endpoint para login
    const loginEndpoint = '/login';
    const URLCompleta = `http://localhost:3005${loginEndpoint}`;

    // Captura os valores dos campos de email e senha
    let emailInput = document.querySelector('#email');
    let senhaInput = document.querySelector('#senha');

    // Extrai os valores
    let email = emailInput.value;
    let senha = senhaInput.value;

    if (email && senha) {
        try {
            // Envia os dados para o servidor via POST
            const response = await axios.post(URLCompleta, { email, senha });

            // Exibe o alerta de sucesso
            exibirAlerta('.alert-login', 'Login realizado com sucesso', ['show', 'alert-success'], ['d-none'], 2000);

            // Armazena o token no localStorage (ou sessionStorage)
            localStorage.setItem('auth_token', response.data.token);

            // Redireciona para a página principal após login
            setTimeout(() => {
                window.location.href = 'index-05.html';
            }, 2000);

        } catch (error) {
            console.error(error);
            exibirAlerta('.alert-login', error.response.data.mensagem, ['show', 'alert-danger'], ['d-none'], 2000);
        }
    } else {
        exibirAlerta('.alert-login', 'Preencha todos os campos corretamente', ['show', 'alert-danger'], ['d-none'], 2000);
    }
}

document.getElementById('loginForm').addEventListener('submit', loginUser);

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor);

    if (alert) {
        alert.innerHTML = innerHTML;
        alert.classList.add(...classesToAdd);
        alert.classList.remove(...classesToRemove);

        setTimeout(() => {
            alert.classList.remove('show');
            alert.classList.add('d-none');
        }, timeout);
    } else {
        console.error("Elemento de alerta não encontrado. Verifique o seletor:", seletor);
    }
}
