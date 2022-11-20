// console.log ("Hello, Node")

const express = require('express')
const cors = require ('cors')
const mongoose = require ('mongoose')
const uniqueValidator = require ('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
    }))    

const usuarioSchema = mongoose.Schema(
    {
        login: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    }
)
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find();
    res.json(filmes)
})

app.post('/filmes', async (req, res) => {
    //obtem os dados enviados pelo cliente
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //monta um objeto agrupando os dados. Ele representa um novo filme
    //a seguir, construímos um objeto Filme a partir do modelo do mongoose
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    await filme.save()
    //save salva o novo filme na base gerenciada pelo MongoDB
    const filmes = await Filme.find()
    res.json(filmes)
})

app.post ('/signup', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password

        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario ({login: login, password: criptografada})
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.end()
    } catch (error) {
        console.log(error)
        res.status(409).end()
    }        
})
app.post('/login', async (req, res) => {
    //login/senha que o usuário enviou
    const login = req.body.login
    const password = req.body.password
    //tentamos encontrar no MongoDB
    const usuario = await Usuario.findOne({login: login})
    if (!usuario) {
        //senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem: "usuário não encontrado"})
    }
    //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, usuario.password)
    if (!senhaValida) {
        return res.status(403).json({mensagem: "senha inválida"})
    }
    //aqui vamos gerar o token e devolver para o cliente
    const token = jwt.sign(
        {login: login},
        //depois vamos mudar para uma chave secreta de verdade
        'chave_secreta',
        {expiresIn: '1h'}
    )
    res.status(200).json({token: token})
})

async function conectarMongo () {
    await mongoose.connect(`mongodb+srv://User:1234@cluster0.rgevuzc.mongodb.net/?retryWrites=true&w=majority`)
}

app.listen(3000, () => {
    try {
    conectarMongo()
    console.log("up, running and connected")
    }
    catch (e) {
        console.log('Erro: ', e)
    }
})

// app.get('/oi', (req, res) => res.send('oi'))

// let filmes = [
//     {
//         titulo: "Forrest Gump - O Contador de Histórias",
//         sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções."
//     },
//     {
//         titulo: "Um Sonho de Liberdade",
//         sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela"
//     }
// ]

//escutar uma requisição get na URL http://localhost:3000/oi

// //endpoind para obter a lista de filmes
// app.get('/filmes', (req, res) => res.json(filmes))

// app.post('/filmes', (req, res) => {
//     //capturar os dados da requisição do usuário
//     const titulo = req.body.titulo
//     const sinopse = req.body.sinopse
//     //monta um objeto com as informações capturadas
//     const filme = {titulo: titulo, sinopse: sinopse}
    
//     filmes.push(filme)
//     //responde ao cliente com a lista nova
//     res.json(filmes)
// })
