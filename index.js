function enviarMensagemWhatsApp() {
    const numeroTelefone = "5544988129535";
    const mensagem = "Oi, gostaria de fazer um pedido";
    const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}