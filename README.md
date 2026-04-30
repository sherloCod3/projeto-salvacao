# SalvAção - Plataforma de Coordenação de Emergências Climáticas

![SalvAção Banner](https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=SalvA%C3%A7%C3%A3o+-+Rede+de+Emerg%C3%AAncia)

A **SalvAção** é uma plataforma MVP de missão crítica focada em conectar vítimas de enchentes a recursos e equipes de resgate em tempo real. Desenvolvida sob o padrão "Luxury Minimal / Glassmorphism", une alta performance com estética visual primorosa.

## Arquitetura & Tecnologias

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Leaflet.
- **Backend:** Node.js, Express, Prisma ORM.
- **Banco de Dados:** PostgreSQL (via Docker).
- **Internacionalização (i18n):** Padrão nativo para `pt-BR` via dicionários.

## Architectural Decision Records (ADRs) & Engineering Trade-offs
To ensure the platform remains performant, scalable, and cost-effective under critical emergency loads, we adopted the following architectural decisions:

1. **Frontend Geo-Clustering over Backend Spatial Queries:**
   - *Context:* Rendering thousands of pins on a map crashes the browser. Querying the backend for spatial clustering under heavy load is expensive.
   - *Decision:* We send a lightweight payload of active reports and use `supercluster` on the frontend.
   - *Trade-off:* Slightly larger initial payload, but massive reduction in database hits and zero latency when zooming/panning.

2. **Proactive Risk Mapping (Static + Crowdsourced):**
   - *Context:* We need to warn users of dangerous areas without the fragility and legal risks of web scraping news sites.
   - *Decision:* Official risk zones (historical floods) are loaded as a static, heavily cached GeoJSON file (0 server cost). To capture real-time, emerging threats, we allow authenticated users to drop "Community Warning" pins (visibly distinct from official zones).
   - *Trade-off:* Requires community self-moderation (e.g., upvotes/verifications) to prevent spam, but avoids the severe maintenance nightmare and cost of automated scraping/geocoding pipelines.

3. **Delayed Offline-First (PWA) Implementation:**
   - *Context:* Emergency apps benefit from offline capabilities (Service Workers).
   - *Decision:* We consciously delayed PWA caching until the core MVP is stabilized.
   - *Trade-off:* Users require a connection for the initial phase, but we avoid the "stale cache" debugging nightmare during rapid feature iteration, ensuring maximum stability.

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
- [ ] **Radar de Voluntários em Tempo Real:** Permitir que vítimas visualizem no mapa quando um voluntário/resgatista está se deslocando em direção à sua localização, trazendo alívio psicológico imediato.
