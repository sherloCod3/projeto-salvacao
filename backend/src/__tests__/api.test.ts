import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import prisma from '../prisma';

// Mock the prisma client
vi.mock('../prisma', () => {
  return {
    default: {
      helpRequest: {
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      user: {
        create: vi.fn(),
      },
    },
  };
});

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /api/requests', () => {
    it('should return a list of requests', async () => {
      const mockRequests = [
        { id: '1', title: 'Test 1', priority: 'MODERATE' },
        { id: '2', title: 'Test 2', priority: 'CRITICAL' },
      ];
      
      (prisma.helpRequest.findMany as any).mockResolvedValue(mockRequests);

      const response = await request(app).get('/api/requests');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRequests);
      expect(prisma.helpRequest.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, phone: true } },
          volunteer: { select: { id: true, name: true, phone: true } },
        },
      });
    });

    it('should return 500 on database error', async () => {
      (prisma.helpRequest.findMany as any).mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/api/requests');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Falha ao buscar os pedidos' });
    });
  });

  describe('POST /api/requests', () => {
    it('should create a new request with calculated priority', async () => {
      const reqBody = {
        title: 'Need help',
        description: 'socorro urgente',
        latitude: -30,
        longitude: -51,
        type: 'OTHER',
        authorId: 'a0000000-0000-0000-0000-000000000001'
      };

      const mockCreated = { id: '1', ...reqBody, priority: 'CRITICAL' };
      (prisma.helpRequest.create as any).mockResolvedValue(mockCreated);

      const response = await request(app)
        .post('/api/requests')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreated);
      
      // We expect 'urgente' to trigger 'CRITICAL' priority
      expect(prisma.helpRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Need help',
          priority: 'CRITICAL',
        })
      });
    });

    it('should return 400 on invalid (empty) payload', async () => {
      const response = await request(app).post('/api/requests').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Dados inválidos');
    });

    it('should return 500 on database error with valid payload', async () => {
      (prisma.helpRequest.create as any).mockRejectedValue(new Error('DB Error'));
      const response = await request(app).post('/api/requests').send({
        title: 'Need help',
        description: 'socorro urgente na rua',
        latitude: -30,
        longitude: -51,
        type: 'OTHER',
        authorId: null,
      });
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/requests/:id/status', () => {
    it('should update request status', async () => {
      const mockUpdated = { id: '1', status: 'IN_PROGRESS', volunteerId: 'vol1' };
      (prisma.helpRequest.update as any).mockResolvedValue(mockUpdated);

      const response = await request(app)
        .put('/api/requests/1/status')
        .send({ status: 'IN_PROGRESS', volunteerId: 'b0000000-0000-0000-0000-000000000001' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdated);
      expect(prisma.helpRequest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'IN_PROGRESS', volunteerId: 'b0000000-0000-0000-0000-000000000001' }
      });
    });
    
    it('should update request status without volunteerId', async () => {
      const mockUpdated = { id: '1', status: 'RESOLVED' };
      (prisma.helpRequest.update as any).mockResolvedValue(mockUpdated);

      const response = await request(app)
        .put('/api/requests/1/status')
        .send({ status: 'RESOLVED' });

      expect(response.status).toBe(200);
      expect(prisma.helpRequest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'RESOLVED', volunteerId: undefined }
      });
    });

    it('should return 400 on invalid (empty) payload', async () => {
      const response = await request(app).put('/api/requests/1/status').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Dados inválidos');
    });

    it('should return 500 on database error with valid payload', async () => {
      (prisma.helpRequest.update as any).mockRejectedValue(new Error('DB Error'));
      const response = await request(app).put('/api/requests/1/status').send({ status: 'RESOLVED' });
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const reqBody = { name: 'João', email: 'joao@test.com', phone: '123', role: 'VICTIM' };
      const mockCreated = { id: 'u1', ...reqBody };
      (prisma.user.create as any).mockResolvedValue(mockCreated);

      const response = await request(app)
        .post('/api/users')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreated);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: reqBody });
    });

    it('should return 400 on invalid (empty) payload', async () => {
      const response = await request(app).post('/api/users').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Dados inválidos');
    });

    it('should return 500 on database error with valid payload', async () => {
      (prisma.user.create as any).mockRejectedValue(new Error('DB Error'));
      const response = await request(app).post('/api/users').send({
        name: 'João',
        email: 'joao@test.com',
        phone: '51999999999',
        role: 'VICTIM',
      });
      expect(response.status).toBe(500);
    });
  });
});
