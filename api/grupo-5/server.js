const express = require('express')

const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var fs = require('fs');
var path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const uniqueValidator = require('mongoose-unique-validator')

app.use(express.json())
app.use(cors())

dotenv.config();
const port = process.env.PORT || '3005'
const uri = process.env.MONGODB_URL

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 100MB file size limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
  }

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const Evento = mongoose.model('Evento', mongoose.Schema({
    nome: String,
    telefone: String,
    numero: Number,
    cep: String,
    url_logo: String,
    preco: Number,
    complemento: String,
    ingresso: Number,
    descricao: String,
    endereco: String,
    categoria: String
}));
const Usuario = mongoose.model('Usuario', mongoose.Schema({
    nome: String,
    email: { type: String, required: true, unique: true },
    senha: String,
    telefone: String,
    cnpj: { type: String, required: true, unique: true },
    cep: String,
    complemento: String,
    endereco: String,
    numero: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
}));

app.get("/evento", async (req, res) => {
    try {
        const eventos = await Evento.find(); // Busca no modelo Evento
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar eventos" });
    }
});

app.get("/evento/:id", async (req, res) => {
    try {
        const eventoId = req.params.id; // Captura o ID passado na URL
        const evento = await Evento.findById(eventoId); // Busca o evento pelo ID

        if (!evento) {
            // Caso o evento não seja encontrado
            return res.status(404).json({ mensagem: "Evento não encontrado" });
        }

        res.json(evento); // Retorna o evento encontrado
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensagem: "Erro ao buscar evento" });
    }
});
app.get("/eventosCat", async (req, res) => {
    try {
        const { categoria } = req.query; // Obtém a categoria dos parâmetros de consulta

        if (categoria) {
            const eventos = await Evento.find({ categoria }); // Filtra os eventos pela categoria
            if (!eventos.length) {
                return res.status(404).json({ mensagem: "Nenhum evento encontrado para essa categoria" });
            }
            return res.json(eventos);
        }

        // Se nenhuma categoria for especificada, retorna todos os eventos
        const eventos = await Evento.find();
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar eventos" });
    }
});
app.post("/eventos", async (req, res) => {
    try {
        const { nome, telefone, numero, cep, url_logo, preco, complemento, ingresso, descricao, endereco, categoria } = req.body;

        // Criar o evento com os dados fornecidos
        const evento = new Evento({
            nome: nome,
            telefone: telefone,
            numero: numero,
            cep: cep,
            url_logo: url_logo,
            preco: preco,
            complemento: complemento,
            ingresso: ingresso,
            descricao: descricao,
            endereco: endereco,
            categoria: categoria
        })

        // Salvar o evento no banco
        await evento.save()

        // Buscar todos os eventos após a inserção
        const eventos = await Evento.find()

        // Retornar todos os eventos cadastrados
        res.json(eventos)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "Erro ao salvar evento" })
    }
})
app.post("/usuario", async (req, res) => {
    try {
        const { nome, email, senha, telefone, cnpj, cep, complemento, endereco, numero, } = req.body;


        const usuarioExistenteEmail = await Usuario.findOne({ email });
        if (usuarioExistenteEmail) {
            return res.status(400).json({ mensagememail: "O e-mail já está cadastrado." });
        }
        const usuarioExistenteCnpj = await Usuario.findOne({ email });
        if (usuarioExistenteCnpj) {
            return res.status(400).json({ mensagemcnpj: "O cnpj já está cadastrado." });
        }
        // Criar o evento com os dados fornecidos
        const usuario = new Usuario({
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone,
            cnpj: cnpj,
            cep: cep,
            complemento: complemento,
            endereco: endereco,
            numero: numero,
        })

        // Salvar o evento no banco
        await usuario.save()

        // Buscar todos os eventos após a inserção
        const usuarios = await Usuario.find()

        // Retornar todos os eventos cadastrados
        res.json(usuarios)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "Erro ao salvar usuario" })
    }
})

// Endpoint de login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe pelo e-mail
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ mensagem: "E-mail não encontrado." });
        }
         // Comparar a senha fornecida com a senha armazenada no banco de dados
        if (usuario.senha !== senha) {  // Comparação direta das senhas
            return res.status(400).json({ mensagem: "Senha incorreta." });
}

        // Gerar um token JWT
        const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retorna o token no login
        res.json({ mensagem: "Login bem-sucedido", token });

                } catch (error) {
                    console.error("Erro ao realizar login:", error);
                    res.status(500).json({ mensagem: "Erro ao realizar login." });
}
});

app.post('/apiImagem', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    try {
        const formData = new FormData();
        formData.append("image_file", fs.createReadStream(req.file.path));

        // Corrigido para acessar a IA dentro do Docker
        const response = await axios.post("http://backend-image:9001/imagens", formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        console.error("Erro ao enviar imagem para IA:", error.response?.data || error.message);
        res.status(500).json({ error: "Falha ao processar imagem" });
    }
});

app.post('/perguntaIA', async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ error: 'A pergunta é obrigatória para gerar a resposta' });
        }

        const prompt = `${pergunta}. Mantenha a resposta em um formato corrido, sem listas, marcadores, negritos ou qualquer formatação especial. Use um tom profissional e analítico para enriquecer a explicação.`;

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                params: { key: process.env.KEY_GEMINI }
            }
        );

        let resposta = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao obter resposta.';
        resposta = resposta.replace(/\n+/g, ' ');

        res.json({ resposta });
    } catch (error) {
        console.error('Erro na API do Gemini:', error.message);
        res.status(500).json({ error: 'Erro ao processar a pergunta.' });
    }
});

async function conectarAoMongo() {
    await mongoose.connect(uri, {});
}

app.listen(port, () => {
    try {
        conectarAoMongo()
        console.log(`Servidor rodando na port ${port}`)
    } catch (error) {
        console.log("Erro", e)
    }
})
