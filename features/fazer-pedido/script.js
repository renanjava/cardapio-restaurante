let titulo;

document.addEventListener('DOMContentLoaded', () => {
    setarTituloProduto()
    getCardapioDia("sabado")
})


function redirecionarPagina(nomePagina) {
    window.location.href = `${nomePagina}.html`
}

function setarTituloProduto() {
    const params = new URLSearchParams(window.location.search);
    titulo = params.get('titulo');

    if (titulo) {
        const tituloElemento = document.getElementById('produtoPedido');
        tituloElemento.textContent = titulo;
    }
}

function forcarUmCheckboxSelecionado(dia) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="opcaoCarne"]');

    /*if (dia == "sabado") {
        const todosCheckboxes = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]');
        const feijoes = Array.from(todosCheckboxes).filter(input => {
            return input.parentElement.textContent.includes("Feijão");
        })
    }*/
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) {
                checkboxes.forEach(other => {
                    if (other !== cb) other.checked = false;
                });
            }
        });
    });
}

function getCardapioDia(dia) {
    fetch(`../../data/cardapio-dia.json`)
        .then(response => response.json())
        .then(data => {
            const cardapioDia = data[dia]
            montarCheckboxes(cardapioDia.opcaoCardapio, true, 'opcaoCardapio', 'cardapioDiv')
            montarCheckboxes(cardapioDia.opcaoCarne, false, 'opcaoCarne', 'carneDiv')
            forcarUmCheckboxSelecionado(dia)
        })
}

function mostrarAvisoCarne(msg) {
    const aviso = document.getElementById('avisoCarne');
    aviso.textContent = msg;
    aviso.style.display = 'block';
    aviso.classList.add('show');
    setTimeout(() => {
        aviso.classList.remove('show');
        setTimeout(() => aviso.style.display = 'none', 400);
    }, 2500);
}

function montarCheckboxes(opcoesArray, isChecked, nomeOpcao, nomeDiv) {
    const divOpcao = document.getElementById(nomeDiv)
    opcoesArray.forEach((opcao) => {
        const label = document.createElement('label')
        label.textContent = opcao.name

        const input = document.createElement('input')
        input.type = 'checkbox'
        input.name = nomeOpcao
        input.id = opcao.name
        input.checked = isChecked

        label.appendChild(input)
        divOpcao.appendChild(label)
    })
}

function mostrarModalCarrinho() {
    const modal = document.createElement('div');
    modal.id = 'modal-carrinho';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div style="
            background: #fff;
            padding: 32px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            text-align: center;
            max-width: 90vw;
        ">
            <h2 style="margin-bottom: 18px;">Item adicionado ao carrinho!</h2>
            <p style="margin-bottom: 24px;">Deseja ir para o carrinho ou continuar adicionando itens?</p>
            <button id="btn-ir-carrinho" style="margin-right: 16px; padding: 8px 24px; border-radius: 8px; border: none; background: #e67e22; color: #fff; font-weight: bold; cursor: pointer;">Ir para o carrinho</button>
            <button id="btn-continuar" style="padding: 8px 24px; border-radius: 8px; border: none; background: #27ae60; color: #fff; font-weight: bold; cursor: pointer;">Continuar adicionando</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-ir-carrinho').onclick = function () {
        window.location.href = '../meu-carrinho/index.html';
    };
    document.getElementById('btn-continuar').onclick = function () {
        window.location.href = '../../index.html';
    };
}

function gerarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function adicionarAoCarrinho() {
    const selectedCardapioItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]:checked');
    const unselectedCardapioItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]:not(:checked)');
    const selectedCarneItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCarne"]:checked');

    const selectedCardapioValues = Array.from(selectedCardapioItems).map(item => item.id);
    const unselectedCardapioValues = Array.from(unselectedCardapioItems).map(item => item.id);
    const selectedCarneValues = Array.from(selectedCarneItems).map(item => item.id);

    if (selectedCarneValues.length == 0) {
        mostrarAvisoCarne('Selecione uma carne para continuar!');
        return;
    }

    const getLocalStoragePedidos = JSON.parse(localStorage.getItem("pedidos"))

    const pedidoPayload = [{
        id: gerarIdUnico(),
        tamanhoMarmita: titulo,
        carne: selectedCarneValues[0],
        adicionarItens: selectedCardapioValues,
        removerItens: unselectedCardapioValues,
        quantidade: 1,
    }]

    if (getLocalStoragePedidos == null) {
        localStorage.setItem('pedidos', JSON.stringify(pedidoPayload))
        mostrarModalCarrinho();
        return;
    }
    getLocalStoragePedidos.push(pedidoPayload[0]);
    localStorage.setItem('pedidos', JSON.stringify(getLocalStoragePedidos))
    mostrarModalCarrinho();
    return;
}
