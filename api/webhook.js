import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Suas chaves exatas do Firebase inseridas corretamente
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

// Desativa o processamento automático da Vercel
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
    // Confere se o aviso realmente veio do Stripe
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erro na assinatura do Webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // O GRANDE MOMENTO: Se o pagamento foi aprovado!
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Puxa as referências do cliente
    const orderId = session.client_reference_id;
    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name;

    if (orderId) {
      try {
        // 1. Encontra o pedido no Firebase e carimba como "Pago"
        const orderRef = doc(db, 'orders', orderId);
        
        await updateDoc(orderRef, {
          status: 'pago',
          stripeSessionId: session.id,
          customerEmail: customerEmail,
          customerName: customerName,
          paidAt: new Date().toISOString()
        });
        
        console.log(`✅ Sucesso! Pedido ${orderId} atualizado para PAGO!`);

        // 2. ENVIA O E-MAIL AUTOMÁTICO COM A CARA DA MARCA
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #0f172a;">Arigato, ${customerName ? customerName.split(' ')[0] : 'Cliente'}! 🎉</h2>
            <p>O seu pagamento foi aprovado com sucesso e a Paula já está com a mão na massa preparando os seus produtos aqui no Japão!</p>
            <p>O código do seu pedido é: <strong style="color: #e11d48;">#${orderId}</strong></p>
            <p>Você pode acompanhar todas as atualizações de envio e rastreio entrando na sua <strong>Suíte de Cliente</strong> no nosso site.</p>
            <p>Se tiver qualquer dúvida, é só nos chamar no WhatsApp.</p>
            <br/>
            <p>Com carinho,</p>
            <p><strong>Equipe Japão Box Brasil 🇯🇵📦</strong></p>
          </div>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Japão Box Brasil <contato@japaoboxbrasil.com>',
            to: customerEmail,
            subject: '🎉 Arigato! Seu pedido está sendo preparado no Japão.',
            html: emailHtml
          })
        });

        console.log(`✅ E-mail enviado com sucesso para ${customerEmail}`);

      } catch (error) {
        console.error(`Erro ao processar pedido ou enviar e-mail:`, error);
      }
    }
  }

  // Responde ao Stripe que recebemos a notificação com sucesso
  res.status(200).json({ recebido: true });
}
