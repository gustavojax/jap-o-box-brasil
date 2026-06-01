import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Isso é obrigatório para o Stripe conseguir validar a segurança (não alterar)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Aqui o site confere se a chave (STRIPE_WEBHOOK_SECRET) está correta
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erro na verificação do Webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Se o evento for de pagamento aprovado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extraindo as informações do cliente e do pedido
    const cliente = session.customer_details.name;
    const email = session.customer_details.email;
    const valorTotal = (session.amount_total / 100).toFixed(2); // Transforma centavos em Reais

    console.log(`✅ Pagamento aprovado! Cliente: ${cliente} | Valor: R$ ${valorTotal}`);

    // TODO: Código para enviar esses dados para o Firebase (Painel Admin)
  }

  // Avisa o Stripe que recebemos a mensagem com sucesso
  res.status(200).json({ recebido: true });
}
