import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cartItems, orderId, userEmail } = req.body;

    // Converte os itens para o formato do Stripe (em centavos)
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.product.name,
          images: [item.product.image],
        },
        unit_amount: Math.round(item.product.priceBRL * 100),
      },
      quantity: item.quantity,
    }));

    // Adiciona o Frete fixo
    lineItems.push({
      price_data: {
        currency: 'brl',
        product_data: { name: 'Frete Fixo (Mie → Brasil)' },
        unit_amount: 3500, // R$ 35,00
      },
      quantity: 1,
    });

    // Pega o domínio atual do site automaticamente (para redirecionar certo)
    const baseUrl = req.headers.origin || 'http://localhost:3000';

    // Gera a tela de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: orderId, // Crucial para darmos baixa depois no painel
      success_url: `${baseUrl}/?status=success`,
      cancel_url: `${baseUrl}/?status=cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erro no Stripe:", error);
    res.status(500).json({ error: error.message });
  }
}
