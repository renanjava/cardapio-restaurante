let titulo;
let editId;

document.addEventListener('DOMContentLoaded', async () => {
    setarTituloProduto()

    const params = new URLSearchParams(window.location.search);
    editId = params.get('edit');
    if (editId) {
        await carregarPedidoParaEdicao(editId);
    }

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

    document.getElementById('btn-ir-carrinho').onclick = function () {
        window.location.href = '../meu-carrinho/index.html';
    };

    document.getElementById('btn-continuar').onclick = function () {
        window.location.href = '../../index.html';
    };
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

function aplicarRegraFeijaoSabado() {
    const cardapioCheckboxes = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]');
    const feijaoIds = [];
    cardapioCheckboxes.forEach(cb => {
        if (cb.id.toLowerCase().includes('feijão preto') || cb.id.toLowerCase().includes('feijão carioca')) {
            feijaoIds.push(cb.id);
        }
    });

    cardapioCheckboxes.forEach(cb => {
        if (feijaoIds.includes(cb.id)) {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    feijaoIds.forEach(id => {
                        if (id !== cb.id) {
                            const outro = document.getElementById(id);
                            if (outro) outro.checked = false;
                        }
                    });
                }
            });
        }
    });
}

async function mostrarCardapioSemanal() {
    const modal = document.createElement('div');
    modal.id = 'modal-cardapio-semanal';
    modal.className = 'modal-cardapio-semanal-bg';

    const content = document.createElement('div');
    content.className = 'modal-cardapio-semanal-content';
    content.style.background = '#fff';

    const btnClose = document.createElement('button');
    btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnClose.className = 'btn-close-modal';
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
    if (dia === 'domingo') {
        const cardapioDiv = document.getElementById('cardapioDiv');
        const carneDiv = document.getElementById('carneDiv');
        const adicionarAoCarrinho = document.getElementById('btn-carrinho');
        adicionarAoCarrinho.remove()
        cardapioDiv.className = 'cardapio-indisponivel';
        carneDiv.className = 'carne-indisponivel';
        cardapioDiv.innerHTML = '<i class="fa-solid fa-ban"></i> Indisponível aos domingos';
        carneDiv.innerHTML = '<i class="fa-solid fa-ban"></i> Indisponível aos domingos';
        return;
    }
    fetch(`../../data/cardapio-dia.json`)
        .then(response => response.json())
        .then(data => {
            const cardapioDia = data[dia]
            montarCheckboxes(cardapioDia.opcaoCardapio, true, 'opcaoCardapio', 'cardapioDiv')
            montarCheckboxes(cardapioDia.opcaoCarne, false, 'opcaoCarne', 'carneDiv')
            forcarUmCheckboxSelecionado(dia)
            if (dia === 'sabado') {
                aplicarRegraFeijaoSabado()
            }
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

        if (nomeOpcao === 'opcaoCardapio') {
            if (opcao.name.toLowerCase().includes('feijão carioca')) {
                input.checked = true;
            } else if (opcao.name.toLowerCase().includes('feijão preto')) {
                input.checked = false;
            } else {
                input.checked = isChecked;
            }
        } else {
            input.checked = isChecked;
        }

        label.appendChild(input)
        divOpcao.appendChild(label)
    })
}

function mostrarModalCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    modal.classList.add('active');
}


async function carregarPedidoParaEdicao(idPedido) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id == idPedido);
    if (!pedido) return;

    setTimeout(() => {
        const carneCheckboxes = document.querySelectorAll('input[name="opcaoCarne"]');
        carneCheckboxes.forEach(cb => {
            cb.checked = cb.id === pedido.carne;
        });
    }, 300);

    setTimeout(() => {
        const cardapioCheckboxes = document.querySelectorAll('input[name="opcaoCardapio"]');
        cardapioCheckboxes.forEach(cb => {
            cb.checked = pedido.adicionarItens.includes(cb.id);
        });
    }, 300);
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
        id: editId || gerarIdUnico(),
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

    if (editId) {
        pedidos = getLocalStoragePedidos.map(p => p.id == editId ? pedidoPayload[0] : p);
        localStorage.setItem('pedidos', JSON.stringify(pedidos))
        mostrarModalCarrinho();
        return;
    }

    getLocalStoragePedidos.push(pedidoPayload[0]);
    localStorage.setItem('pedidos', JSON.stringify(getLocalStoragePedidos))
    mostrarModalCarrinho();
    return;
}
