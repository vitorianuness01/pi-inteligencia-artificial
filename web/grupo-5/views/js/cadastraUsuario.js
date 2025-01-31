async function postUser(user) {
    user.preventDefault(); // Evita o reload da página ao clicar no botão

    // URL do endpoint para cadastro do organizador
    const usuarioEndpoint = '/usuario';
    const URLCompleta = `http://localhost:3005${usuarioEndpoint}`;

    // Captura os valores dos campos do formulário
    let nomeInput = document.querySelector('#nome');
    let emailInput = document.querySelector('#email');
    let confirmeEmailInput = document.querySelector('#confirmaEmail');
    let senhaInput = document.querySelector('#senha');
    let confirmeSenhaInput = document.querySelector('#confirmaSenha');
    let telefoneInput = document.querySelector('#telefone');
    let cnpjInput = document.querySelector('#cnpj');
    let cepInput = document.querySelector('#cep');
    let complementoInput = document.querySelector('#complemento');
    let enderecoInput = document.querySelector('#endereco');
    let numeroInput = document.querySelector('#numero');
    let termosInput = document.querySelector('#termos'); // Checkbox

    // Extrai os valores
    let nome = nomeInput.value;
    let email = emailInput.value;
    let confirmeEmail = confirmeEmailInput.value;
    let senha = senhaInput.value;
    let confirmeSenha = confirmeSenhaInput.value;
    let telefone = telefoneInput.value;
    let cnpj = cnpjInput.value;
    let cep = cepInput.value;
    let complemento = complementoInput.value;
    let endereco = enderecoInput.value;
    let numero = numeroInput.value;

    if (!termosInput.checked) {
        return exibirAlerta('.alert-usuario', 'Você deve aceitar os termos', ['show', 'alert-danger'], ['d-none'], 2000);
    }

    else if (email !== confirmeEmail) {
        return exibirAlerta('.alert-usuario', 'Os e-mails não coincidem', ['show', 'alert-danger'], ['d-none'], 2000);
    }

    else if (senha !== confirmeSenha) {
        return exibirAlerta('.alert-usuario', 'As senhas não coincidem', ['show', 'alert-danger'], ['d-none'], 2000);
    }
    

    // Verifica se todos os campos estão preenchidos
    if (nome && email && confirmeEmail && senha && confirmeSenha && telefone && cnpj && cep && complemento && endereco && numero) {
        // Limpa os campos do formulário após o envio
        nomeInput.value = "";
        emailInput.value = "";
        confirmeEmailInput.value = "";
        senhaInput.value = "";
        confirmeSenhaInput.value = "";
        telefoneInput.value = "";
        cnpjInput.value = "";
        cepInput.value = "";
        complementoInput.value = "";
        enderecoInput.value = "";
        numeroInput.value = "";
        termosInput.checked = false;

        try {
            // Envia os dados para o servidor via POST
            const response = await axios.post(URLCompleta, {
                nome,
                email,
                senha,
                telefone,
                cnpj,
                cep,
                complemento,
                endereco,
                numero,
            });

            const usuarios = response.data;

            exibirAlerta('.alert-usuario', 'Usuário cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000);

            setTimeout(() => {
                window.location.href = 'login-05.html';
            }, 2000);

        } catch (error) {
            console.error(error);
            exibirAlerta('.alert-usuario', 'E-mail ou CNPJ já cadastrados', ['show', 'alert-danger'], ['d-none'], 2000);
        }

    } else {
        exibirAlerta('.alert-usuario', 'Preencha todos os campos corretamente', ['show', 'alert-danger'], ['d-none'], 2000);
    }
}

document.getElementById('userForm').addEventListener('submit', postUser);

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

const validar = async () => {
    const imagemInput = document.querySelector("#image");

    if (!imagemInput.files.length) {
        alert("escolha uma imagem");
        return;
    }

    let formData = new FormData();
    formData.append("image", imagemInput.files[0]);

    try {
        const response = await axios.post("http://localhost:3005/apiImagem", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Resultado da IA:", response.data);
        alert("Olhe o log para a analise da imagem!");
    } catch (error) {
        console.error("Erro na imagem", error);
        alert("Erro na imagem");
    }
};