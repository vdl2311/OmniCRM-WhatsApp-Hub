import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Gemini Client (Lazy Initialization)
  let aiClient: GoogleGenAI | null = null;
  const getAI = () => {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Endpoint: Suggest Replies for WhatsApp Chat
  app.post('/api/ai/suggest-reply', async (req, res) => {
    try {
      const { contactName, recentMessages, tone = 'professional_sales' } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback intelligent heuristic suggestions if API key is not yet set
        return res.json({
          suggestions: [
            `Olá ${contactName || 'tudo bem'}! Com certeza, posso te explicar todos os detalhes da nossa plataforma. Qual o melhor horário para conversarmos?`,
            `Entendi perfeitamente sua necessidade. Nossa integração com WhatsApp oficial resolve exatamente essa fila de atendimento. Gostaria de ver uma demonstração ao vivo?`,
            `Perfeito! Já preparei uma proposta personalizada para sua empresa. Posso te enviar o link em PDF agora?`
          ],
          source: 'local_heuristics'
        });
      }

      const prompt = `Você é um assistente de vendas e atendimento de CRM via WhatsApp de alta conversão.
Nome do cliente: ${contactName || 'Cliente'}
Histórico recente da conversa:
${JSON.stringify(recentMessages, null, 2)}

Gere exatamente 3 sugestões de respostas curtas, naturais, em português brasileiro, adequadas para WhatsApp, para o atendente enviar a seguir.
Formato de saída: retorne APENAS um array JSON de strings com as 3 opções. Exemplo: ["opção 1", "opção 2", "opção 3"]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '[]';
      let suggestions: string[] = [];
      try {
        suggestions = JSON.parse(text);
      } catch {
        suggestions = [
          `Olá ${contactName}! Como posso te auxiliar com os planos do CRM hoje?`,
          `Fico à disposição para tirar qualquer dúvida sobre a integração com WhatsApp!`,
          `Posso agendar uma rápida demonstração online com nossa equipe.`
        ];
      }

      res.json({ suggestions, source: 'gemini' });
    } catch (error: any) {
      console.error('Error generating AI reply:', error);
      res.json({
        suggestions: [
          'Olá! Obrigado pela mensagem. Como posso te ajudar hoje?',
          'Perfeito! Nossa equipe está à disposição para apresentar a demonstração do sistema.',
          'Gostaria de agendar uma apresentação de 15 minutos pelo Google Meet?'
        ],
        source: 'fallback'
      });
    }
  });

  // AI Endpoint: Lead Summary & Sentiment
  app.post('/api/ai/analyze-lead', async (req, res) => {
    try {
      const { contact, messages: chatMessages, deals } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          summary: `Lead com alto potencial comercial. Interesse demonstrado em centralização de WhatsApp e gestão de equipe.`,
          sentiment: 'Interessado e Decidido',
          score: 85,
          recommendedNextStep: 'Agendar call de fechamento ou enviar minuta contratual.',
          source: 'local'
        });
      }

      const prompt = `Analise este lead comercial de CRM:
Contato: ${JSON.stringify(contact)}
Oportunidades vinculadas: ${JSON.stringify(deals)}
Últimas mensagens trocadas: ${JSON.stringify(chatMessages)}

Forneça um JSON com:
- "summary": resumo executivo de 2 frases
- "sentiment": sentimento ("Muito Interessado", "Cauteloso", "Negociando Preço", "Neutro")
- "score": nota de 0 a 100 de probabilidade de compra
- "recommendedNextStep": melhor próxima ação comercial recomendada.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ ...parsed, source: 'gemini' });
    } catch (error) {
      res.json({
        summary: 'Lead qualificado com histórico de conversas ativas no canal WhatsApp.',
        sentiment: 'Interessado',
        score: 80,
        recommendedNextStep: 'Realizar follow-up da proposta enviada.',
        source: 'fallback'
      });
    }
  });

  // WhatsApp Webhook Mock/Receiver
  app.post('/api/whatsapp/webhook', (req, res) => {
    console.log('[WhatsApp Webhook Received]', req.body);
    res.json({ status: 'received', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs Production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniCRM Server running on http://localhost:${PORT}`);
  });
}

startServer();
