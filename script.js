carregarListaProdutos("marmitas")

document.addEventListener('DOMContentLoaded', atualizarCarrinhoBadge);

function atualizarCarrinhoBadge() {
    let pedidos = JSON.parse(localStorage.getItem('carrinhoPedidos') || '[]');
    let totalQtd = pedidos.reduce((soma, pedido) => soma + (pedido.qtd || 1), 0);
    document.getElementById('carrinhoBadge').textContent = totalQtd;
}

function carregarListaProdutos(tipoProduto) {
    fetch(`data/${tipoProduto}.json`)
        .then(response => response.json())
        .then(data => data.forEach(elemento => {
            const item = document.createElement('li')
            item.classList.add('item__produto')

            const imagem = document.createElement('img')
            imagem.classList.add('imagem__produto')
            imagem.src = elemento.urlImagem
            imagem.alt = "Ícone do produto"

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

            if (tipoProduto == 'marmitas') {
                const botaoAutoAtendimento = document.createElement('button')
                botaoAutoAtendimento.classList.add('secundario__botao')
                botaoAutoAtendimento.textContent = 'Realizar Auto Atendimento'
                botaoAutoAtendimento.addEventListener('click', () => redirecionarPagina('features/fazer-pedido/index', elemento.titulo))
                item.appendChild(botaoAutoAtendimento)
            }

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
    const botoesMenu = [...document.getElementsByClassName('menu__opcao')].filter(el => el.tagName === "BUTTON");
    botoesMenu.forEach(botao => {
        botao.disabled = false;
        botao.classList.remove('active');
    });

    const botaoCategoria = document.getElementById(tipoProduto);
    botaoCategoria.disabled = true;
    botaoCategoria.classList.add('active');
}

function enviarMensagemWhatsApp() {
    const numeroTelefone = "5544988129535"
    const mensagem = "Oi, gostaria de fazer um pedido"
    const mensagemAdaptada = encodeURIComponent(mensagem)

    const url = `https://wa.me/${numeroTelefone}?text=${mensagemAdaptada}`
    window.open(url, '_blank')
}

function redirecionarPagina(nomePagina, tituloPagina) {
    window.location.href = `${nomePagina}.html?titulo=${encodeURIComponent(tituloPagina)}`
}