import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Suas chaves exatas do Firebase inseridas
const firebaseConfig = {
  apiKey: "AIzaSyCoPztqmG0b7lAIaWRg-iIVvQgsJLkV5_I",
  authDomain: "jap-box-core-prod.firebaseapp.com",
  projectId: "jap-box-core-prod",
  storageBucket: "jap-box-core-prod.appspot.com",
  messagingSenderId: "842214047732",
  appId: "1:842214047732:web:2ab310e943ef47f1c303a1"
};

// Inicializa o banco de dados no servidor
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Desativa o processamento automático da Vercel (O Stripe exige ler o arquivo cru por segurança)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Função para ler o arquivo cru que o Stripe envia
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const buf = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Confere se o aviso realmente veio do Stripe usando a sua senha
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erro na assinatura do Webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // O GRANDE MOMENTO: Se o pagamento foi aprovado!
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Puxa a referência do pedido que enviamos no checkout
    const orderId = session.client_reference_id;

    if (orderId) {
      try {
        // Encontra o pedido no Firebase e carimba como "Pago"
        const orderRef = doc(db, 'orders', orderId);
        
        await updateDoc(orderRef, {
          status: 'pago',
          stripeSessionId: session.id,
          customerEmail: session.customer_details.email,
          customerName: session.customer_details.name,
          paidAt: new Date().toISOString()
        });
        
        console.log(`✅ Sucesso! Pedido ${orderId} atualizado para PAGO!`);
      } catch (error) {
        console.error(`Erro ao atualizar pedido no Firebase:`, error);
      }
    }
  }

  // Responde ao Stripe que recebemos a notificação com sucesso
  res.status(200).json({ recebido: true });
}
