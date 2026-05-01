# SalvAção - Frontend

A Plataforma de Coordenação em Tempo Real para emergências climáticas e resgates. 
Construída com foco em **alta performance**, **acessibilidade** e **resiliência** (preparada para offline-first no futuro).

## 🚀 Tecnologias

- **Next.js (App Router)** - Framework React para renderização otimizada.
- **TypeScript** - Tipagem estática para segurança do código.
- **Tailwind CSS & Framer Motion** - Estilização utilitária e animações fluidas (UI Premium e Glassmorphism).
- **React-Leaflet & Supercluster** - Renderização de mapas interativos de alto desempenho com clusterização geográfica em tempo real no client-side.
- **Vitest & React Testing Library** - Suíte de testes automatizados garantindo qualidade e TDD compliance.

## 🛠 Pré-requisitos

- Node.js (versão 18+)
- NPM, Yarn ou pnpm
- Backend em execução em `http://localhost:3001` (veja o README raiz)

## 📦 Instalação e Execução

Configure a URL do backend (obrigatório — sem isso, o mapa e o formulário não funcionam):
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🧪 Testes Automatizados

A aplicação possui cobertura de testes para os componentes principais (`Map`, `RequestForm`, `Logo`, Hooks).

Para rodar os testes:
```bash
npm test
```

## 🗺 Sobre a Arquitetura do Mapa
O mapa interativo utiliza `react-leaflet`. Para evitar problemas de hidratação no Next.js (pois o Leaflet requer o objeto `window`), o componente `Map` é carregado dinamicamente (`next/dynamic` com `ssr: false`). 

As zonas de risco (camada GeoJSON) são carregadas do repositório estático `/public/official-risk-zones.geojson`, garantindo disponibilidade mesmo caso sistemas governamentais fiquem offline.

## 🤝 Contribuição
Siga os padrões estabelecidos nas PRs, garantindo que `npm run lint` e `npm run test` passem antes de solicitar revisão.
