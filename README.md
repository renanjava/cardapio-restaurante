# Sistema de Cardápio Digital para Restaurante

## Descrição Geral
Este projeto é um sistema de **cardápio digital** para restaurante, voltado para pedidos de **marmitas, lanches e combos**, com integração ao **WhatsApp** para finalização dos pedidos.  
O sistema é **responsivo**, moderno e pensado para facilitar o fluxo do cliente, desde a escolha do produto até o envio do pedido.

---

## Estrutura e Fluxo do Usuário

### 1. Página Inicial
- Exibe as principais opções do restaurante: **Marmitas, Lanches, Combos**.
- Permite navegar entre os grupos de produtos.
- Botões de acesso:
  - Carrinho
  - Contato via WhatsApp
- Exibe horários de atendimento e informações úteis.

### 2. Tela de Fazer Pedido
- Seleção do tipo de marmita (Mini, Média, Grande, etc.).
- Exibição de **imagem ilustrativa** do produto.
- Cardápio do dia **dinâmico** conforme o dia da semana.
- Cardápio dividido em duas seções:
  - Itens do cardápio (arroz, feijão, salada, etc.)
  - Carnes (frango, bisteca de boi, etc.)
- Funcionalidades:
  - Seleção e remoção de itens do cardápio
  - Escolha da carne
- **Regras especiais**:
  - Sábados: só é possível escolher **um tipo de feijão** (preto ou carioca). Feijão carioca vem marcado por padrão.
  - Marmita Mini + Bisteca de boi: acréscimo de **R$ 2,00** (indicado no label do checkbox).
  - Domingos: cardápio e carnes indisponíveis (cards cinza e bloqueados).
- Botão para **adicionar ao carrinho**.
- Modal para visualizar o **cardápio semanal**.

### 3. Carrinho
- Lista todos os pedidos adicionados, com detalhes:
  - Tipo de marmita, carne, adicionais, itens removidos, quantidade, valor unitário e subtotal.
  - Indica acréscimos (ex: bisteca de boi na mini).
- Funcionalidades:
  - Editar ou remover pedidos
  - Alterar quantidade de cada pedido
  - Exibir valor total do carrinho
  - Botão para continuar e finalizar pedido

### 4. Finalização do Pedido (Modal)
- Modal moderno e centralizado, dividido em duas colunas:
  - **Forma de Retirada**: Balcão ou Entrega
    - Se entrega, campos para endereço (rua e número)
    - Sábados: taxa de entrega de **R$ 2,00**, exibida automaticamente
  - **Forma de Pagamento**: Cartão, Pix, Dinheiro
    - Pix: exibe chave Pix e instruções para envio do comprovante
    - Dinheiro: pergunta sobre troco e exige valor se necessário
- Botão **"Enviar Pedido"** habilitado apenas se todos os campos obrigatórios forem preenchidos
- Pedido enviado via **WhatsApp**, com mensagem detalhada incluindo:
  - Detalhes do pedido, endereço, forma de pagamento, taxa de entrega (se sábado), acréscimos, etc.

---

## Funcionalidades Técnicas
- **Cardápio Dinâmico**: carregado de arquivo JSON para fácil atualização.
- **Regras de Negócio**:
  - Dias da semana influenciam cardápio e opções disponíveis
  - Acréscimos automáticos e avisos visuais para combinações específicas
  - Validação de campos obrigatórios no modal de finalização
- **Persistência**: pedidos armazenados no `localStorage`, permitindo edição e remoção antes do envio
- **Edição de pedidos**: campos preenchidos conforme pedido original
- **Responsividade**: layout adaptado para desktop e mobile
- **Integração WhatsApp**: envio direto ao número do restaurante com mensagem detalhada
- **Feedback Visual**: avisos, campos dinâmicos, botões desabilitados/ativados conforme preenchimento

---

## Regras Especiais e UX
- **Domingo**: não há expediente; cardápio e carnes bloqueados, com aviso visual
- **Sábado**:
  - Taxa de entrega de R$ 2,00 para marmitas, exibida no modal e somada ao valor total
  - Feijão: só um tipo permitido, carioca marcado por padrão
- **Marmita Mini + Bisteca de boi**: acréscimo de R$ 2,00
- **Pagamento em Dinheiro**: pergunta sobre troco e exige valor se necessário
- **Pix**: exibe chave Pix e instrução para envio do comprovante

---

## Estilo Visual
- **Cores e fontes personalizadas** via CSS variables
- **Cards, modais e botões** com sombras, bordas arredondadas e animações sutis
- **Ícones FontAwesome** para navegação, ações e avisos
- **Cards de indisponibilidade** aos domingos com ícone de bloqueio e cor cinza

---

## Resumo do Fluxo
1. Usuário acessa o cardápio e escolhe o produto
2. Seleciona itens do cardápio e carne conforme regras do dia
3. Adiciona ao carrinho, podendo editar ou remover pedidos
4. Finaliza o pedido, preenchendo retirada, pagamento e endereço/troco
5. Envia o pedido via **WhatsApp**, recebendo confirmação visual
