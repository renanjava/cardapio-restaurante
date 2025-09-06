let titulo;

document.addEventListener('DOMContentLoaded', () => {
    setarTituloProduto()

    const diasDaSemana = [
        'domingo',
        'segunda',
        'terca',
        'quarta',
        'quinta',
        'sexta',
        'sabado'
    ];
    const hoje = new Date();
    const diaDaSemanaNumero = hoje.getDay();

    getCardapioDia(diasDaSemana[diaDaSemanaNumero])
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

async function mostrarCardapioSemanal() {
    const modal = document.createElement('div');
    modal.id = 'modal-cardapio-semanal';
    modal.className = 'modal-cardapio-semanal-bg';
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

    const content = document.createElement('div');
    content.className = 'modal-cardapio-semanal-content';
    content.style.background = '#fff';
    content.style.padding = '32px 24px';
    content.style.borderRadius = '12px';
    content.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    content.style.maxWidth = '95vw';
    content.style.maxHeight = '90vh';
    content.style.overflowY = 'auto';
    content.style.position = 'relative';

    const btnClose = document.createElement('button');
    btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnClose.className = 'btn-close-modal';
    btnClose.style.position = 'absolute';
    btnClose.style.top = '12px';
    btnClose.style.right = '12px';
    btnClose.style.background = 'none';
    btnClose.style.border = 'none';
    btnClose.style.fontSize = '1.5rem';
    btnClose.style.cursor = 'pointer';
    btnClose.onclick = () => document.body.removeChild(modal);

    content.appendChild(btnClose);

    const titulo = document.createElement('h2');
    titulo.textContent = 'Cardápio da Semana';
    titulo.style.marginBottom = '18px';
    content.appendChild(titulo);

    const response = await fetch('../../data/cardapio-dia.json');
    const cardapio = await response.json();

    Object.entries(cardapio).forEach(([dia, dados]) => {
        const diaDiv = document.createElement('div');
        diaDiv.style.marginBottom = '18px';

        const nomeDia = document.createElement('h3');
        nomeDia.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
        nomeDia.style.color = '#e67e22';
        nomeDia.style.marginBottom = '8px';
        diaDiv.appendChild(nomeDia);

        const listaCardapio = document.createElement('ul');
        listaCardapio.style.marginBottom = '6px';
        listaCardapio.style.paddingLeft = '18px';
        listaCardapio.innerHTML = dados.opcaoCardapio.map(item => `<li>${item.name}</li>`).join('');
        diaDiv.appendChild(listaCardapio);

        const carnesTitulo = document.createElement('strong');
        carnesTitulo.textContent = 'Carnes: ';
        diaDiv.appendChild(carnesTitulo);

        const listaCarnes = document.createElement('span');
        listaCarnes.textContent = dados.opcaoCarne.map(item => item.name).join(', ');
        diaDiv.appendChild(listaCarnes);

        content.appendChild(diaDiv);
    });
    const diasGrid = document.createElement('div');
    diasGrid.className = 'dias-grid';

    content.appendChild(diasGrid)

    modal.appendChild(content);
    document.body.appendChild(modal);
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
    const params = new URLSearchParams(window.location.search)
    const tituloMarmita = params.get('titulo')

    opcoesArray.forEach((opcao) => {
        const label = document.createElement('label')
        let textoLabel = opcao.name;

        if (nomeOpcao === 'opcaoCarne' && tituloMarmita === 'Marmita Mini' && opcao.name === 'Bisteca de boi') {
            textoLabel += ' (+R$ 2,00)';
            label.style.color = '#e67e22';
            label.style.fontWeight = 'bold';
        }

        label.textContent = textoLabel

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
