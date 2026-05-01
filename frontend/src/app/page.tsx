'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RequestForm, { type FormPayload } from '@/components/RequestForm';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/contexts/ToastContext';
import Logo from '@/components/Logo';
import type { RequestData } from '@/components/Map';

// O react-leaflet requer acesso ao objeto 'window'. O import dinâmico com ssr: false previne falhas de hidratação no servidor Next.js.
const InteractiveMap = dynamic(() => import('@/components/Map'), { ssr: false });

/** Base URL for the API — injected via environment variable for multi-environment support. */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const { t } = useTranslation();
  const toast = useToast();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/requests`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      // Silent background failure — user sees stale map, not a crash
      console.error('[fetchRequests] failed:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    // O uso de long polling a cada 10s foi adotado como alternativa simplificada (MVP) a WebSockets para sincronização de dados em quase tempo real.
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRequest = async (formData: FormPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Como o escopo inicial dispensa autenticação, authorId é explicitamente nulo para permitir envios anônimos.
        body: JSON.stringify({ ...formData, authorId: null }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status} | ${JSON.stringify(body)}`);
      }

      const created = await res.json();
      await fetchRequests();

      toast.success({
        user: 'Pedido enviado com sucesso! Ele já aparece no mapa.',
        dev: `POST ${API_URL}/api/requests → 201 | id=${created.id} | priority=${created.priority} | type=${created.type} | lat=${formData.latitude}, lng=${formData.longitude}`,
      });
    } catch (error) {
      toast.error({
        user: 'Não foi possível enviar o pedido. Verifique sua conexão e tente novamente.',
        dev: `POST ${API_URL}/api/requests failed | ${String(error)}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="w-full">
        <Logo />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
        <div className="lg:col-span-1">
          <RequestForm onSubmit={handleCreateRequest} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-2 relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <InteractiveMap requests={requests} />
        </div>
      </div>
    </main>
  );
}
