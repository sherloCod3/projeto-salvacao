'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import RequestForm from '@/components/RequestForm';
import { motion } from 'framer-motion';

import { useTranslation } from '@/hooks/useTranslation';

import Logo from '@/components/Logo';

// O react-leaflet requer acesso ao objeto 'window'. O import dinâmico com ssr: false previne falhas de hidratação no servidor Next.js.
const InteractiveMap = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/requests');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    // O uso de long polling a cada 10s foi adotado como alternativa simplificada (MVP) a WebSockets para sincronização de dados em quase tempo real.
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRequest = async (formData: any) => {
    setIsLoading(true);
    try {
      await fetch('http://localhost:3001/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Como o escopo inicial dispensa autenticação, authorId é explicitamente nulo para permitir envios anônimos.
        body: JSON.stringify({ ...formData, authorId: null })
      });
      await fetchRequests();
    } catch (error) {
      console.error("Failed to create request", error);
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
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
          <InteractiveMap requests={requests} />
        </div>
      </div>
    </main>
  );
}
