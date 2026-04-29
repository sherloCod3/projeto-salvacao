import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PrismaClient, type Priority, type RequestType } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

/**
 * Calcula a prioridade de um pedido com base em heurísticas de texto e tipo de emergência.
 * Utilizado como mecanismo de triagem automática (MVP) para priorizar resgates sem intervenção manual.
 */
function calculatePriority(description: string, type: RequestType): Priority {
  const desc = description.toLowerCase();

  // Verifica palavras críticas: vida, encurralado, preso, urgente
  if (type === 'RESCUE' || desc.includes('vida') || desc.includes('urgente') || desc.includes('preso') || desc.includes('encurralado')) {
    return 'CRITICAL';
  }

  // Verifica palavras médicas: machucado, ferido, sangrando, remédio
  if (type === 'MEDICAL' || desc.includes('ferido') || desc.includes('sangrando') || desc.includes('remédio') || desc.includes('machucado')) {
    return 'URGENT';
  }

  return 'MODERATE';
}

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/requests', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.helpRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, phone: true } },
        volunteer: { select: { id: true, name: true, phone: true } }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao buscar os pedidos' });
  }
});

app.post('/api/requests', async (req: Request, res: Response) => {
  const { title, description, latitude, longitude, type, authorId } = req.body;

  try {
    const priority = calculatePriority(description, type as RequestType);

    const newRequest = await prisma.helpRequest.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        type: type as RequestType,
        priority,
        authorId
      }
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao criar o pedido' });
  }
});

app.put('/api/requests/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, volunteerId } = req.body;

  try {
    const updatedRequest = await prisma.helpRequest.update({
      where: { id: id as string },
      data: {
        status,
        // O uso de 'undefined' previne a sobreposição com valores nulos caso a chave não seja informada,
        // garantindo que o Prisma aplique atualizações parciais sem erros de tipagem.
        volunteerId: volunteerId || undefined,
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao atualizar o pedido' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, email, phone, role }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao criar usuário' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
