document.addEventListener('DOMContentLoaded', () => {
    setarTituloProduto()
    forcarUmCheckboxSelecionado()
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

function forcarUmCheckboxSelecionado() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="opcaoMistura"]');

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
