document.addEventListener('DOMContentLoaded', () => {
    setarTituloProduto()
    getCardapioDia("sabado")
})


function redirecionarPagina(nomePagina) {
    window.location.href = `${nomePagina}.html`
}

function setarTituloProduto() {
    const params = new URLSearchParams(window.location.search);
    const titulo = params.get('titulo');

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
            const divCardapio = document.getElementById('cardapioDiv')
            const cardapioDia = data[dia]
            cardapioDia.opcaoCardapio.forEach((opcao) => {
                const label = document.createElement('label')
                label.textContent = opcao.name

                const input = document.createElement('input')
                input.type = 'checkbox'
                input.name = 'opcaoCardapio'
                input.id = opcao.name
                //if (!(dia == 'sabado' && opcao.name.includes("Feijão"))) {
                input.checked = true
                //}
                label.appendChild(input)
                divCardapio.appendChild(label)
            })

            const divCarne = document.getElementById('carneDiv')
            cardapioDia.opcaoCarne.forEach((opcao) => {
                const label = document.createElement('label')
                label.textContent = opcao.name

                const input = document.createElement('input')
                input.type = 'checkbox'
                input.id = opcao.name
                input.name = 'opcaoCarne'

                label.appendChild(input)
                divCarne.appendChild(label)
            })
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

function adicionarAoCarrinho() {
    const selectedCardapioItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]:checked');
    const unselectedCardapioItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCardapio"]:not(:checked)');
    const selectedCarneItems = document.querySelectorAll('input[type="checkbox"][name="opcaoCarne"]:checked');

    const selectedCardapioValues = Array.from(selectedCardapioItems).map(item => item.id);
    const unselectedCardapioValues = Array.from(unselectedCardapioItems).map(item => item.id);
    const selectedCarneValues = Array.from(selectedCarneItems).map(item => item.id);

    console.log("Selecionados do cardápio:", selectedCardapioValues);
    console.log("Não selecionados do cardápio:", unselectedCardapioValues);
    console.log("Selecionados da carne:", selectedCarneValues);

    if (selectedCarneItems.length == 0) {
        mostrarAvisoCarne('Selecione uma carne para continuar!');
        return;
    }

    //alert("Pedido adicionado ao carrinho! (Funcionalidade em desenvolvimento)");
    //window.location.href = `../meu-carrinho/index.html`
}
