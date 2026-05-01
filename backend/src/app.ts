import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { type RequestType } from '@prisma/client';
import prisma from './prisma';
import { calculatePriority } from './utils/priority';

const app = express();

app.use(cors());
app.use(express.json());

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

export default app;
