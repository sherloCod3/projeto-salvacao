# SalvAção - Plataforma de Coordenação de Emergências Climáticas

![SalvAção Banner](https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=SalvA%C3%A7%C3%A3o+-+Rede+de+Emerg%C3%AAncia)

A **SalvAção** é uma plataforma MVP de missão crítica focada em conectar vítimas de enchentes a recursos e equipes de resgate em tempo real. Desenvolvida sob o padrão "Luxury Minimal / Glassmorphism", une alta performance com estética visual primorosa.

## Arquitetura & Tecnologias

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Leaflet.
- **Backend:** Node.js, Express, Prisma ORM.
- **Banco de Dados:** PostgreSQL (via Docker).
- **Internacionalização (i18n):** Padrão nativo para `pt-BR` via dicionários.

## Principais Funcionalidades

1. **Mapa Interativo Real-Time (Long-Polling):** Exibição em mapa dos chamados de resgate na região afetada, clusterização inteligente e filtros por severidade.
2. **Sistema Autônomo de Triagem (NLP MVP):** O backend realiza detecção de palavras-chave como `preso`, `sangrando`, `remédio` e `urgente` para escalonar a prioridade da emergência (Crítico, Urgente, Moderado).
3. **Fluxo Otimizado para Dispositivos Móveis:** Captação precisa e sem atrito de lat/long nativa pelo navegador do dispositivo.
4. **Design Google Antigravity:** Tipografia legível, contraste alto e interfaces vítreas (Glassmorphism) para clareza absoluta em momentos de tensão.

## Como Executar Localmente

**1. Dependências Iniciais**
Certifique-se de ter `Node.js` (v18+) e `Docker` instalados.

**2. Subir o Banco de Dados**
```bash
docker-compose up -d
```

**3. Configurar e Iniciar o Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

**4. Iniciar o Frontend**
```bash
cd frontend
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Roadmap

- [ ] Migração de Long-polling para WebSockets.
- [ ] Dashboards analíticos para centros de comando de prefeituras.
- [ ] Implementação de sistema de Autenticação para Voluntários e ONGs.
