import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { type RequestType } from '@prisma/client';
import prisma from './prisma';
import { calculatePriority } from './utils/priority';

const app = express();

// Restrict CORS to the configured origin only — prevents unauthorized cross-origin POST spam
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '50kb' })); // Guard against oversized payloads

// --- Zod Validation Schemas ---

/** Validates incoming help request payload. All geo fields must be valid finite numbers. */
const helpRequestSchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres').max(200),
  description: z.string().min(5, 'Descrição deve ter ao menos 5 caracteres').max(2000),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
  type: z.enum(['RESCUE', 'SHELTER', 'SUPPLIES', 'MEDICAL', 'COMMUNITY_WARNING', 'OTHER']),
  // authorId can be a Prisma cuid or uuid — accept any non-empty string
  authorId: z.string().min(1).nullable().optional(),
});

/** Validates status update payload. */
const statusUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  volunteerId: z.string().min(1).optional(),
});

/** Validates user creation payload. */
const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  role: z.enum(['VICTIM', 'VOLUNTEER', 'ADMIN']),
});

// --- Routes ---

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
    console.error('[GET /api/requests] DB error:', error);
    res.status(500).json({ error: 'Falha ao buscar os pedidos' });
  }
});

app.post('/api/requests', async (req: Request, res: Response) => {
  // Validate before touching the database
  const parsed = helpRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  const { title, description, latitude, longitude, type, authorId } = parsed.data;

  try {
    const priority = calculatePriority(description, type as RequestType);
    const newRequest = await prisma.helpRequest.create({
      data: { title, description, latitude, longitude, type: type as RequestType, priority, authorId: authorId ?? null }
    });
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('[POST /api/requests] DB error:', error);
    res.status(500).json({ error: 'Falha ao criar o pedido' });
  }
});

app.put('/api/requests/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;

  const parsed = statusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  const { status, volunteerId } = parsed.data;

  try {
    const updatedRequest = await prisma.helpRequest.update({
      where: { id },
      data: { status, volunteerId: volunteerId || undefined }
    });
    res.json(updatedRequest);
  } catch (error) {
    console.error(`[PUT /api/requests/${id}/status] DB error:`, error);
    res.status(500).json({ error: 'Falha ao atualizar o pedido' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  const { name, email, phone, role } = parsed.data;

  try {
    const user = await prisma.user.create({ data: { name, email, phone, role } });
    res.status(201).json(user);
  } catch (error) {
    console.error('[POST /api/users] DB error:', error);
    res.status(500).json({ error: 'Falha ao criar usuário' });
  }
});

export default app;
