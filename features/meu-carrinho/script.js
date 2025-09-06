let pedidos;

document.addEventListener('DOMContentLoaded', renderCarrinho);

function abrirModalPedido() {
    document.getElementById('modalPedido').style.display = 'block';
    resetModalCampos();
}

function fecharModalPedido() {
    document.getElementById('modalPedido').style.display = 'none';
}

function resetModalCampos() {
    document.querySelectorAll('input[type=checkbox][name=retirada]').forEach(cb => cb.checked = false);
    document.getElementById('entregaCampos').style.display = 'none';
    document.getElementById('rua').value = '';
    document.getElementById('numero').value = '';
    document.querySelectorAll('input[type=checkbox][name=pagamento]').forEach(cb => cb.checked = false);
    document.getElementById('pixCampos').style.display = 'none';
    document.getElementById('dinheiroCampos').style.display = 'none';
    document.querySelectorAll('input[type=radio][name=troco]').forEach(rb => rb.checked = false);
    document.getElementById('valorTroco').style.display = 'none';
    document.getElementById('valorTroco').value = '';
    document.getElementById('btnEnviarPedido').disabled = true;
}

function onRetiradaChange(checkbox) {
    document.querySelectorAll('input[type=checkbox][name=retirada]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
    });
    if (checkbox.value === 'entrega' && checkbox.checked) {
        document.getElementById('entregaCampos').style.display = 'block';
        document.getElementById('obsEntrega').style.display = 'flex';
    } else {
        document.getElementById('entregaCampos').style.display = 'none';
        document.getElementById('rua').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('obsEntrega').style.display = 'none';
    }
    validarModalPedido();
}

function onPagamentoChange(checkbox) {
    document.querySelectorAll('input[type=checkbox][name=pagamento]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
    });
    document.getElementById('pixCampos').style.display = (checkbox.value === 'pix' && checkbox.checked) ? 'block' : 'none';
    document.getElementById('dinheiroCampos').style.display = (checkbox.value === 'dinheiro' && checkbox.checked) ? 'block' : 'none';
    if (checkbox.value !== 'dinheiro') {
        document.querySelectorAll('input[type=radio][name=troco]').forEach(rb => rb.checked = false);
        document.getElementById('valorTroco').style.display = 'none';
        document.getElementById('valorTroco').value = '';
    }
    validarModalPedido();
}

function onTrocoChange(radio) {
    if (radio.value === 'sim') {
        document.getElementById('valorTroco').style.display = 'inline-block';
    } else {
        document.getElementById('valorTroco').style.display = 'none';
        document.getElementById('valorTroco').value = '';
    }
    validarModalPedido();
}

function validarModalPedido() {
    const retiradaSelecionada = document.querySelector('input[type=checkbox][name=retirada]:checked');
    let entregaOk = true;
    if (retiradaSelecionada && retiradaSelecionada.value === 'entrega') {
        const rua = document.getElementById('rua').value.trim();
        const numero = document.getElementById('numero').value.trim();
        entregaOk = rua.length > 0 && numero.length > 0;
    }
    const pagamentoSelecionado = document.querySelector('input[type=checkbox][name=pagamento]:checked');
    let pagamentoOk = !!pagamentoSelecionado;
    if (pagamentoSelecionado && pagamentoSelecionado.value === 'dinheiro') {
        const trocoSelecionado = document.querySelector('input[type=radio][name=troco]:checked');
        pagamentoOk = !!trocoSelecionado;
        if (trocoSelecionado && trocoSelecionado.value === 'sim') {
            const valorTroco = document.getElementById('valorTroco').value.trim();
            pagamentoOk = valorTroco.length > 0 && !isNaN(Number(valorTroco)) && Number(valorTroco) > 0;
        }
    }
    document.getElementById('btnEnviarPedido').disabled = !(retiradaSelecionada && entregaOk && pagamentoOk);
}

async function renderCarrinho() {
    document.addEventListener('input', function(e) {
        if (
            e.target.id === 'rua' ||
            e.target.id === 'numero' ||
            e.target.id === 'valorTroco'
        ) {
            validarModalPedido();
        }
    });

    pedidos = JSON.parse(localStorage.getItem("pedidos"))
    const lista = document.getElementById('carrinhoLista');
    lista.innerHTML = '';
    let total = 0;
    let totalQtd = 0;
    if (!pedidos || pedidos.length == 0) {
        lista.innerHTML = `
            <div class="carrinho__vazio">
                <p>Seu carrinho está vazio.</p>
                <button class="btn-fazer-pedido" onclick="window.location.href='../../index.html'">
                    <i class="fa-solid fa-utensils"></i> Fazer um pedido de marmita
                </button>
            </div>
        `;
        document.querySelector('#carrinhoTotal').remove()
        document.querySelector('.btn-pagar').remove()
        return;
    }

    let marmitaData = await fetch(`../../data/marmitas.json`)
            .then(response => response.json())

    for (const [idx, pedido] of pedidos.entries()) {
        const getMarmitaData = marmitaData.find((marmita) => marmita.titulo == pedido.tamanhoMarmita);

        if (getMarmitaData.titulo === "Marmita Mini" && pedido.carne === "Bisteca de boi") {
            total += (getMarmitaData.valor + 2) * pedido.quantidade;
        } else {
            total += getMarmitaData.valor * pedido.quantidade;
        }
        totalQtd += pedido.quantidade;

        const card = document.createElement('div');
        card.className = 'carrinho__card';
        card.style.position = 'relative';

        const actions = document.createElement('div');
        actions.className = 'carrinho__card-actions';

        const iconsDiv = document.createElement('div');
        iconsDiv.className = 'carrinho__card-actions-icons';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'carrinho__card-edit';
        btnEdit.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        btnEdit.title = "Editar pedido";
        btnEdit.onclick = () => editarPedido(idx);

        const btnRemove = document.createElement('button');
        btnRemove.className = 'carrinho__card-remove';
        btnRemove.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnRemove.title = "Remover pedido";
        btnRemove.id = pedido.id;
        btnRemove.onclick = () => removerPedido(pedido.id);

        iconsDiv.appendChild(btnEdit);
        iconsDiv.appendChild(btnRemove);
        actions.appendChild(iconsDiv);

        const img = document.createElement('img');
        img.className = 'carrinho__card-imagem';
        img.src = '../../assets/data/marmitas/marmita_base.png';
        img.alt = pedido.tamanhoMarmita;

        const info = document.createElement('div');
        info.className = 'carrinho__card-info';
        info.innerHTML = `
        <div class="carrinho__card-titulo">${pedido.tamanhoMarmita}</div>
        <div class="carrinho__card-descricao"><b>Carne:</b> ${pedido.carne}</div>
        <div class="carrinho__card-descricao"><b>Adicionar:</b> ${pedido.adicionarItens.length > 0 ? pedido.adicionarItens.join(", ") : 'apenas uma porção de carne'}</div>
        <div class="carrinho__card-descricao">${pedido.removerItens.length > 0 ? `<b>Remover:</b> ` + pedido.removerItens.join(", ") : ''}</div>
        <div class="carrinho__card-preco">R$ ${getMarmitaData.valor},00</div>
        ${(getMarmitaData.titulo === "Marmita Mini" && pedido.carne === "Bisteca de boi") ? `<div class="carrinho__card-preco">+ R$ 2,00</div>` : ``}
    `;

        const qtdDiv = document.createElement('div');
        qtdDiv.className = 'carrinho__card-qtd';
        qtdDiv.style.position = 'absolute';
        qtdDiv.style.right = 'var(--margin-xs)';
        qtdDiv.style.bottom = 'var(--margin-xs)';

        const btnMenos = document.createElement('button');
        btnMenos.className = 'btn-qtd';
        btnMenos.innerHTML = '<i class="fa-solid fa-minus"></i>';
        btnMenos.onclick = () => alterarQtd(idx, -1, pedidos);

        const qtdSpan = document.createElement('span');
        qtdSpan.textContent = pedido.quantidade;
        qtdSpan.style.fontWeight = 'bold';

        const btnMais = document.createElement('button');
        btnMais.className = 'btn-qtd';
        btnMais.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btnMais.onclick = () => alterarQtd(idx, 1, pedidos);

        qtdDiv.appendChild(btnMenos);
        qtdDiv.appendChild(qtdSpan);
        qtdDiv.appendChild(btnMais);

        card.appendChild(actions);
        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(qtdDiv);

        lista.appendChild(card);
    }

    const totalDiv = document.getElementById('carrinhoTotal');
    totalDiv.textContent = `Total(${totalQtd} itens): R$ ${total},00`;
}

function alterarQtd(idx, delta) {
    pedidos[idx].quantidade += delta;
    if (pedidos[idx].quantidade < 1) {
        pedidos[idx].quantidade = 1;
    }
    localStorage.setItem('pedidos', JSON.stringify(pedidos))
    renderCarrinho();
}

function removerPedido(idPedido) {
    const pedidosLocalStorage = JSON.parse(localStorage.getItem('pedidos'));
    const pedidoRemovido = pedidosLocalStorage.filter((pedido) => pedido.id != idPedido)
    console.log({ pedidosLocalStorage, pedidoRemovido });

    localStorage.setItem('pedidos', JSON.stringify(pedidoRemovido))
    renderCarrinho();
}

function editarPedido() {
    alert("Funcionalidade de edição em breve!");
}

async function enviarPedido() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let mensagem = "*Pedido Restaurante da Juliana*\n\n";
    let total = 0;
    let taxaEntrega = 0;

    const hoje = new Date();
    const isSabado = hoje.getDay() === 6;

    const marmitas = await fetch('../../data/marmitas.json').then(r => r.json());

    for (const [idx, pedido] of pedidos.entries()) {
        mensagem += `*${pedido.quantidade} ${pedido.tamanhoMarmita}*\n`;
        mensagem += `   Carne: ${pedido.carne}\n`;

        if (pedido.adicionarItens?.length) {
            mensagem += `   Adicionais: ${pedido.adicionarItens.join(", ")}\n`;
        }
        if (pedido.removerItens?.length) {
            mensagem += `   Sem: ${pedido.removerItens.join(", ")}\n`;
        }

        const marmitaData = marmitas.find(m => m.titulo === pedido.tamanhoMarmita);
        let valorUnitario = marmitaData?.valor ?? 0;
        if (pedido.tamanhoMarmita === "Marmita Mini" && pedido.carne === "Bisteca de boi") {
            mensagem += `   *Acréscimo Bisteca de boi: R$ 2,00*\n`;
            valorUnitario += 2;
        }

        mensagem += `   Valor unitário: R$ ${valorUnitario.toFixed(2)}\n`;
        mensagem += `   Subtotal: R$ ${(valorUnitario * pedido.quantidade).toFixed(2)}\n\n`;

        total += valorUnitario * pedido.quantidade;
    }


    const retirada = document.querySelector('input[type=checkbox][name=retirada]:checked');
    if (retirada) {
        mensagem += `*Forma de retirada:* ${retirada.value === 'balcao' ? 'Balcão' : 'Entrega'}\n`;
        if (retirada.value === 'entrega') {
            const rua = document.getElementById('rua').value.trim();
            const numero = document.getElementById('numero').value.trim();
            mensagem += `Endereço: ${rua}, ${numero}\n`;
            if (isSabado) {
                taxaEntrega = 2;
                mensagem += `*Taxa de entrega (sábado):* R$ 2,00\n`;
            }
        }
    }

    const pagamento = document.querySelector('input[type=checkbox][name=pagamento]:checked');
    if (pagamento) {
        mensagem += `*Forma de pagamento:* ${pagamento.value.charAt(0).toUpperCase() + pagamento.value.slice(1)}\n`;
        if (pagamento.value === 'pix') {
            mensagem += `Chave Pix: 03085367977\n`;
        }
        if (pagamento.value === 'dinheiro') {
            const troco = document.querySelector('input[type=radio][name=troco]:checked');
            if (troco) {
                mensagem += `Precisa de troco? ${troco.value === 'sim' ? 'Sim' : 'Não'}\n`;
                if (troco.value === 'sim') {
                    const valorTroco = document.getElementById('valorTroco').value.trim();
                    mensagem += `Troco para: R$ ${valorTroco}\n`;
                }
            }
        }
    }

    const valorFinal = total + taxaEntrega;
    mensagem += `\n*Valor total:* R$ ${valorFinal.toFixed(2)}\n`;

    const numeroTelefone = "5544988129535";
    const mensagemAdaptada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroTelefone}?text=${mensagemAdaptada}`;
    window.open(url, '_blank');

    fecharModalPedido();
}
