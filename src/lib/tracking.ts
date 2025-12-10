export const track = {
  pedidoCriado: (pedidoRaw) => {
    const pedido = {
      pedidoId: `pedido_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`,

      valorTotal: pedidoRaw.total,

      items: pedidoRaw.items.map((item) => ({
        tipo: normalizarTipo(item.tamanhoMarmita),
        carne: normalizarCarne(item.carne),
        quantidade: item.quantidade,
        valorUnitario: pedidoRaw.getItemSubtotal(item) / item.quantidade,
        acrescimo: item.extraCharge,
        removidos: item.removerItens,
        adicionados: item.adicionarItens,
      })),

      formaPagamento: pedidoRaw.pagamento,
      tipoEntrega: pedidoRaw.entrega,
      endereco: pedidoRaw.entrega === "entrega" ? pedidoRaw.endereco : null,
      tempoTotalFunil: performance.now(),
      horarioPedido: new Date().getHours(),
      diaSemana: new Date().getDay(),
      dispositivo: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
      navegador: navigator.userAgent,
    };

    console.log("[FUNIL] Pedido criado ✅", {
      timestamp: new Date().toISOString(),
      ...pedido,
    });

    return pedido;
  },
};

function normalizarTipo(tamanho: string): string {
  const mapa: Record<string, string> = {
    "Marmita Mini": "marmita_mini",
    "Marmita Média": "marmita_media",
    "Marmita Grande": "marmita_grande",
  };
  return mapa[tamanho] || tamanho.toLowerCase().replace(/\s+/g, "_");
}

function normalizarCarne(carne: string): string {
  return carne
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}
