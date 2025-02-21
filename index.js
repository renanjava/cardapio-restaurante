carregarListaProdutos("lanches")

function carregarListaProdutos(tipoProduto) {
    fetch(`data/${tipoProduto}.json`)
        .then(response => response.json())
        .then(data => data.forEach(elemento => {
                const item = document.createElement('li')
                item.classList.add('item__produto')
                
                const imagem = document.createElement('img')
                imagem.classList.add('imagem__produto')
                imagem.src = elemento.urlImagem
                imagem.alt = "Ícone de lanche"

                const informacoesProduto = document.createElement('div')
                informacoesProduto.classList.add('informacoes__produto')
                
                const tituloProduto = document.createElement('h3')
                tituloProduto.classList.add('titulo__produto')
                tituloProduto.textContent = elemento.titulo

                const descricaoProduto = document.createElement('p')
                descricaoProduto.classList.add('descricao__produto')
                descricaoProduto.textContent = elemento.descricao

                const valorProduto = document.createElement('p')
                valorProduto.classList.add('valor__produto')
                valorProduto.textContent = `R$ ${elemento.valor},00`

                informacoesProduto.appendChild(tituloProduto)
                informacoesProduto.appendChild(descricaoProduto)
                informacoesProduto.appendChild(valorProduto)
                item.appendChild(imagem)
                item.appendChild(informacoesProduto)
                listaProdutos = document.querySelector(".lista__produtos")
                listaProdutos.appendChild(item)
            })
        )
}   

function atualizarListaProdutos(tipoProduto) {
    alterarBotaoCategoriaAtivado(tipoProduto)
    removerElementosListaProdutos()
    carregarListaProdutos(tipoProduto)
}

function removerElementosListaProdutos() {
    listaProdutos = document.querySelector(".lista__produtos").innerHTML = ""
}

function alterarBotaoCategoriaAtivado(tipoProduto) {
    const botaoCategoria = document.getElementById(tipoProduto);
    botaoCategoria.disabled = true;
    botaoCategoria.classList.add('active');

    const botoesMenu = [...document.getElementsByClassName('menu__opcao')].filter(el => el.tagName === "BUTTON")
    let outroBotao = [...botoesMenu].find(botao => botao.id !== tipoProduto);
    if (outroBotao) {
        outroBotao.disabled = false;
        outroBotao.classList.remove('active');
    }
}

function enviarMensagemWhatsApp() {
    const numeroTelefone = "5544988129535"
    const mensagem = "Oi, gostaria de fazer um pedido"
    const mensagemAdaptada = encodeURIComponent(mensagem)

    const url = `https://wa.me/${numeroTelefone}?text=${mensagemAdaptada}`
    window.open(url, '_blank')
}