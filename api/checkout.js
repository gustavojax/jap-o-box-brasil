export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Recebe os dados do carrinho enviados pela nossa nova gaveta
    const { cartItems, orderId, userEmail, shippingMethod, shippingCost } = req.body;

    // 1. Converte os itens da loja para o formato exigido pelo PagBank (valores em centavos)
    const items = cartItems.map((item) => ({
      reference_id: item.product.id,
      name: item.product.name.substring(0, 100), // PagBank limita o nome do item a 100 caracteres
      quantity: item.quantity,
      unit_amount: Math.round(item.product.priceBRL * 100),
    }));

    // 2. Adiciona o Frete dinâmico escolhido pelo cliente como um item da cobrança
    const valorFrete = shippingCost ? Number(shippingCost) : 64.00;
    const nomeFrete = shippingMethod || "JP Post E-Packet";

    items.push({
      reference_id: "FRETE_INT",
      name: `Frete Internacional (${nomeFrete})`,
      quantity: 1,
      unit_amount: Math.round(valorFrete * 100),
    });

    // Descobre o link oficial do seu site para redirecionar o cliente de volta após pagar
    const baseUrl = req.headers.origin || 'https://www.japaoboxbrasil.com';

    // 3. Cria a sessão de pagamento direto na API do PagBank
    const response = await fetch('https://api.pagseguro.com/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}` 
      },
      body: JSON.stringify({
        reference_id: orderId,
        customer: {
          email: userEmail,
          // Enviamos um nome base genérico. Na tela de pagamento, o cliente preencherá o CPF, Telefone e Endereço completos.
          name: "Cliente Japão Box Brasil" 
        },
        items: items,
        redirect_url: `${baseUrl}/?status=success`
      })
    });

    const data = await response.json();

    // Se o PagBank recusar a criação da cobrança, pegamos o motivo exato
    if (!response.ok) {
      console.error("Detalhes do Erro PagBank:", data);
      throw new Error(data.error_messages?.[0]?.description || 'Falha ao gerar o link de pagamento do PagBank.');
    }

    // 4. Captura o link gerado e envia de volta para o site abrir
    const paymentLink = data.links.find((link) => link.rel === 'PAY');

    if (!paymentLink) {
      throw new Error('Link de pagamento não retornado pela instituição bancária.');
    }

    res.status(200).json({ url: paymentLink.href });

  } catch (error) {
    console.error("Erro no Checkout PagBank:", error);
    res.status(500).json({ error: error.message });
  }
}
