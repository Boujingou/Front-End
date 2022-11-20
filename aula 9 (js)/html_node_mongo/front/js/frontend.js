const protocolo = 'http://'
const baseURL = 'localhost:3000'
// const filmesEndPoind = '/filmes'

async function obterFilmes() {
    console.log("teste")
    const filmesEndPoind = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndPoind}`
    const filmes = (await axios.get(URLcompleta)).data
    console.log(filmes)
    //console.log(filmes)
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let colunaTitulo = linha.insertCell(0)
        let colunaSinopse = linha.insertCell(1)
        colunaTitulo.innerHTML = filme.titulo
        colunaSinopse.innerHTML = filme.sinopse
    }
}

async function cadastrarFilme() {
    //constrói a URL completa
    const filmesEndPoind = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndPoind}`
    //buscar informações no html
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    //pegar as informações de cada elemento
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    // somente adiciona se o usuário tiver digitado os dois valores
    if (titulo && sinopse) {
        //limpa os campos que o usuário digitou
        tituloInput.value = ""
        sinopseInput.value = ""
        //enviar um filme: {"titulo": "", "sinopse": ""}
        const filmes = (await axios.post(URLcompleta, { titulo, sinopse })).data
        //limpa a tabela para preenchê-la com a coleção nova, atualizada
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        corpoTabela.innerHTML = ""
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let cellTitulo = linha.insertCell(0)
            let cellSinopse = linha.insertCell(1)
            cellTitulo.innerHTML = filme.titulo
            cellSinopse.innerHTML = filme.sinopse
        }
    }
    //senão, exibe o alerta por até 3 segundos
    else {
        let alert = document.querySelector('.alert')
        alert.classList.add('show')
        alert.classList.remove('d-none')
        setTimeout( () => {
            alert.classList.add('d-none')
            alert.classList.remove('show')
        }, 3000)
    }
}

async function cadastrarUsuario () {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroUsuarioEndpoint = '/signup'
            const URLcompleta = `${protocolo}${baseURL}${cadastroUsuarioEndpoint}`
            await axios.pots(URLcompleta, {login: usuarioCadastro, password: passwordCadastro})
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            let alert = document.querySelector('.alert-modal-cadastro')
            alert.innerHTML = "Usuário cadastrado com sucesso!"
            //alert-success significa que o alerta é verde para esse tema
            alert.classList.add('show', 'alert-success')
            //alert-danger significa que o alerta é vermelho para esse tema
            alert.classList.remove('d-none', 'alert-danger')
            setTimeout(() => {
                alert.classList.add('d-none')
                alert.classList.remove('show')
                let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
                modalCadastro.hide()
            }, 2000)
        }
        catch (error) { 
            let alert = document.querySelector('.alert-modal-cadastro')
            alert.innerHTML = "Não foi possível cadastrar"
            alert.classList.add('show', 'alert-danger')
            alert.classList.remove('d-none', 'alert-success')
            setTimeout(() => {
                alert.classList.add('d-none')
                alert.classList.remove('show')
                // let modalCadastro = bootstrap.Modal.getInstance(document.querySelector('#modalCadastro'))
                // modalCadastro.hide()
            }, 2000)
            
        }
    }
    else{
        let alert = document.querySelector('.alert-modal-cadastro')
        alert.innerHTML = "Preencha todos os campos"
        alert.classList.add('show', 'alert-danger')
        alert.classList.remove('d-none')
        setTimeout(() => {
            alert.classList.add('d-none')
            alert.classList.remove('show')
        }, 3000)
    }
}