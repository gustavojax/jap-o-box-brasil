export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cartItems, orderId, shippingMethod, shippingCost } = req.body;

    // 1. Configurações e Chaves do PayPal
    // O PayPal possui ambientes separados para testes (sandbox) e oficial (live)
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const isLive = process.env.PAYPAL_ENVIRONMENT === 'live';
    const baseUrl = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    if (!clientId || !secret) {
      throw new Error('As chaves do PayPal não estão configuradas na Vercel.');
    }

    // 2. Gera o Token de Autenticação (OAuth2) do PayPal
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Erro Auth PayPal:", tokenData);
      throw new Error('Falha ao autenticar com a API do PayPal.');
    }

    const accessToken = tokenData.access_token;

    // 3. Formata os valores. O PayPal exige decimais exatos (ex: "199.00")
    const formatAmount = (num) => Number(num).toFixed(2);

    // Monta a lista de produtos
    const paypalItems = cartItems.map((item) => ({
      name: item.product.name.substring(0, 120),
      sku: item.product.id,
      unit_amount: {
        currency_code: 'BRL',
        value: formatAmount(item.product.priceBRL)
      },
      quantity: item.quantity.toString()
    }));

    // Calcula os totais exatos para o fechamento
    const itemTotal = cartItems.reduce((acc, item) => acc + (item.product.priceBRL * item.quantity), 0);
    const shippingTotal = shippingCost ? Number(shippingCost) : 64.00;
    const orderTotal = itemTotal + shippingTotal;

    const siteUrl = req.headers.origin || 'https://www.japaoboxbrasil.com';

    // 4. Cria a ordem de cobrança (Checkout)
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          description: `Pedido Japão Box Brasil - ${shippingMethod || 'E-Packet'}`,
          amount: {
            currency_code: 'BRL',
            value: formatAmount(orderTotal),
            breakdown: {
              item_total: {
                currency_code: 'BRL',
                value: formatAmount(itemTotal)
              },
              shipping: {
                currency_code: 'BRL',
                value: formatAmount(shippingTotal)
              }
            }
          },
          items: paypalItems
        }],
        application_context: {
          brand_name: "Japão Box Brasil",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${siteUrl}/?status=success`,
          cancel_url: `${siteUrl}/?status=cancel`,
          shipping_preference: "GET_FROM_FILE" // Pega o endereço de entrega do cliente no próprio PayPal
        }
      })
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error("Detalhes do Erro Criação PayPal:", orderData);
      throw new Error(orderData.message || 'Falha ao criar pedido no PayPal.');
    }

    // 5. Captura o link de aprovação para redirecionar o cliente
    const approveLink = orderData.links.find(link => link.rel === 'approve');

    if (!approveLink) {
      throw new Error('Link de pagamento não retornado pelo PayPal.');
    }

    // Envia o link oficial do PayPal para o site abrir
    res.status(200).json({ url: approveLink.href });

  } catch (error) {
    console.error("Erro no Checkout PayPal:", error);
    res.status(500).json({ error: error.message });
  }
}
