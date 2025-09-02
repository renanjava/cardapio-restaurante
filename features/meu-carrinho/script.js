document.addEventListener('DOMContentLoaded', renderCarrinho);
let pedidos;

async function renderCarrinho() {
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

    for (const [idx, pedido] of pedidos.entries()) {
        const getMarmitaData = await fetch(`../../data/marmitas.json`)
            .then(response => response.json())
            .then(data => data.find((marmita) => marmita.titulo == pedido.tamanhoMarmita));

        total += getMarmitaData.valor * pedido.quantidade;
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

function pagarCarrinho() {
    alert("Pagamento em desenvolvimento!");
}
