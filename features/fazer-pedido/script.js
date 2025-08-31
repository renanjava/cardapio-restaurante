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
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="opcaoMistura"]');

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
                //if (!(dia == 'sabado' && opcao.name.includes("Feijão"))) {
                input.checked = true
                //}
                label.appendChild(input)
                divCardapio.appendChild(label)
            })

            const divMistura = document.getElementById('misturaDiv')
            cardapioDia.opcaoMistura.forEach((opcao) => {
                const label = document.createElement('label')
                label.textContent = opcao.name

                const input = document.createElement('input')
                input.type = 'checkbox'
                input.name = 'opcaoMistura'

                label.appendChild(input)
                divMistura.appendChild(label)
            })
            forcarUmCheckboxSelecionado(dia)
        })
}

function adicionarAoCarrinho() {
    alert("Pedido adicionado ao carrinho! (Funcionalidade em desenvolvimento)");
}
