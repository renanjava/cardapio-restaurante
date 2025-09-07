let transicaoEmAndamento = false

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinhoBadge();
    carregarListaProdutos("marmitas");
});

function criarLoadingSpinner() {
    const spinner = document.createElement('div')
    spinner.classList.add('loading-spinner')

    const spinnerIcon = document.createElement('div')
    spinnerIcon.classList.add('spinner')

    spinner.appendChild(spinnerIcon)
    return spinner
}

function atualizarCarrinhoBadge() {
    let pedidos = JSON.parse(localStorage.getItem('pedidos'));
    let totalQtd = 0;
    if(pedidos) {
        totalQtd = pedidos.reduce((soma, pedido) => soma + (pedido.qtd || 1), 0);
    }
    document.getElementById('carrinhoBadge').textContent = totalQtd;
}

function carregarListaProdutos(tipoProduto) {
    const listaProdutos = document.querySelector(".lista__produtos")

    const spinner = criarLoadingSpinner()
    listaProdutos.appendChild(spinner)

    fetch(`data/${tipoProduto}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            const spinnerElement = listaProdutos.querySelector('.loading-spinner')
            if (spinnerElement) {
                spinnerElement.remove()
            }

            data.forEach((elemento, index) => {
                setTimeout(() => {
                    const item = document.createElement('li')
                    item.classList.add('item__produto')

                    item.style.opacity = '0'
                    item.style.transform = 'translateY(20px) scale(0.95)'
                    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'

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

                    listaProdutos.appendChild(item)

                    requestAnimationFrame(() => {
                        item.style.opacity = '1'
                        item.style.transform = 'translateY(0) scale(1)'
                    })

                    if (index === data.length - 1) {
                        setTimeout(() => finalizarTransicao(), 100)
                    }
                }, index * 80)
            })
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error)
            const spinnerElement = listaProdutos.querySelector('.loading-spinner')
            if (spinnerElement) {
                spinnerElement.remove()
            }
            finalizarTransicao()
        })
}

function atualizarListaProdutos(tipoProduto) {
    if (transicaoEmAndamento) return

    const botaoAtivo = document.querySelector('.menu__opcao.active')
    if (botaoAtivo && botaoAtivo.id === tipoProduto) return

    transicaoEmAndamento = true
    const listaProdutos = document.querySelector('.lista__produtos')
    listaProdutos.classList.add('loading')

    const botoesMenu = document.querySelectorAll('.menu__opcao')
    botoesMenu.forEach(botao => botao.disabled = true)

    const itensAtuais = document.querySelectorAll('.item__produto')
    if (itensAtuais.length > 0) {
        itensAtuais.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0'
                item.style.transform = 'translateY(-10px) scale(0.98)'
            }, index * 30)
        })

        setTimeout(() => {
            alterarBotaoCategoriaAtivado(tipoProduto)
            removerElementosListaProdutos()
            carregarListaProdutos(tipoProduto)
        }, itensAtuais.length * 30 + 200)
    } else {
        alterarBotaoCategoriaAtivado(tipoProduto)
        removerElementosListaProdutos()
        carregarListaProdutos(tipoProduto)
    }
}

function removerElementosListaProdutos() {
    const listaProdutos = document.querySelector(".lista__produtos")
    listaProdutos.innerHTML = ""
}

function finalizarTransicao() {
    const listaProdutos = document.querySelector('.lista__produtos')
    listaProdutos.classList.remove('loading')

    const botoesMenu = document.querySelectorAll('.menu__opcao')
    botoesMenu.forEach(botao => botao.disabled = false)

    const botaoAtivo = document.querySelector('.menu__opcao.active')
    if (botaoAtivo) {
        botaoAtivo.disabled = true
    }

    transicaoEmAndamento = false
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