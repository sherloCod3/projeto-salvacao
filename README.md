# SalvAção - Plataforma de Coordenação de Emergências Climáticas

![SalvAção Banner](https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=SalvA%C3%A7%C3%A3o+-+Rede+de+Emerg%C3%AAncia)

A **SalvAção** é uma plataforma MVP de missão crítica focada em conectar vítimas de enchentes a recursos e equipes de resgate em tempo real. Desenvolvida sob o padrão "Luxury Minimal / Glassmorphism", une alta performance com estética visual primorosa.

## Arquitetura & Tecnologias

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Leaflet.
- **Backend:** Node.js, Express, Prisma ORM.
- **Banco de Dados:** PostgreSQL (via Docker).
- **Internacionalização (i18n):** Padrão nativo para `pt-BR` via dicionários.

## Registros de Decisão Arquitetural (ADRs) & Trade-offs
Para garantir que a plataforma permaneça performática, escalável e com custo-benefício sob cargas críticas de emergência, adotamos as seguintes decisões arquiteturais:

1. **Clusterização Geográfica no Frontend vs Queries Espaciais no Backend:**
   - *Contexto:* Renderizar milhares de marcadores no mapa trava o navegador. Consultar o backend para clusterização espacial sob alta carga é custoso.
   - *Decisão:* Enviamos um payload leve com os relatórios ativos e utilizamos a biblioteca `supercluster` no frontend.
   - *Trade-off:* Payload inicial ligeiramente maior, mas redução massiva no número de acessos ao banco de dados e latência zero ao dar zoom/navegar no mapa.

2. **Mapeamento Proativo de Riscos (Estático + Colaborativo):**
   - *Contexto:* Precisamos alertar os usuários sobre áreas perigosas sem a fragilidade e os riscos legais de fazer web scraping em sites de notícias.
   - *Decisão:* Zonas de risco oficiais (enchentes históricas) são carregadas como um arquivo GeoJSON estático, fortemente em cache (custo zero de servidor). Para capturar ameaças emergentes em tempo real, permitimos que usuários autenticados adicionem "Avisos da Comunidade" (visualmente distintos das zonas oficiais).
   - *Trade-off:* Requer auto-moderação da comunidade (ex: upvotes/verificações) para evitar spam, mas evita o enorme pesadelo de manutenção e o custo de pipelines automatizados de scraping/geocoding.

3. **Adiamento da Implementação Offline-First (PWA):**
   - *Contexto:* Aplicativos de emergência se beneficiam de recursos offline (Service Workers).
   - *Decisão:* Adiamos conscientemente o cache do PWA até que o MVP central esteja estabilizado.
   - *Trade-off:* Os usuários necessitam de conexão na fase inicial, mas evitamos o pesadelo de debugar "caches obsoletos" durante a rápida iteração de funcionalidades, garantindo estabilidade máxima.

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
