# TicketZone

Uma plataforma de bilhetes online focada no mercado angolano. Compre e venda bilhetes para os melhores eventos com segurança.

## Funcionalidades

- **Catálogo de eventos** — Pesquisa, filtros por categoria/província/período, página de detalhe do evento
- **Compra de bilhetes** — Selecção de tipos de bilhete, adicionais, carrinho e checkout com métodos de pagamento angolanos (Multicaixa Express, PayPay, Referência Multicaixa)
- **Validação QR Code** — Portal de validação para staff na entrada do evento
- **Dashboard do Comprador** — Bilhetes comprados com QR Codes
- **Dashboard do Organizador** — Gestão de eventos, tipos de bilhete, análise de vendas, lista de participantes, definições
- **Painel Admin** — Gestão de utilizadores, eventos, encomendas, organizadores, financeiro, frota de viaturas
- **Aluguer de Viaturas** — Catálogo de carros disponíveis para aluguer
- **Autenticação** — Email/password e Google OAuth

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Linguagem | TypeScript 6 |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| HTTP | Axios |
| Mock API | MSW 2 |
| Validação | Zod |
| Datas | date-fns |
| Notificações | react-hot-toast |
| QR Code | qrcode.react |
| Google OAuth | @react-oauth/google |
| Fontes | Staatliches, Sora, Nunito |

## Primeiros passos

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Copie o ficheiro de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Descrição | Valor por omissão |
|---|---|---|
| `VITE_API_BASE_URL` | URL da API | `http://localhost:3000` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google OAuth | — |
| `VITE_USE_MOCK` | Activar MSW (mock) | `true` |

### Desenvolvimento

```bash
npm run dev
```

A aplicação abre em `http://localhost:5173`. Por omissão, usa a API mockada via MSW — não é necessário um backend real.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento (`--host`) |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Pré-visualização da build |
| `npm run lint` | ESLint com auto-fix |
| `npm run lint:check` | ESLint sem alterações |
| `npm run format` | Prettier |
| `npm run format:check` | Prettier check |
| `npm run typecheck` | TypeScript check |

## Estrutura do projecto

```
src/
├── api/
│   ├── endpoints/      # Chamadas à API (auth, events, orders, tickets, rentals, admin)
│   ├── hooks/          # React Query hooks
│   ├── mock/           # MSW: db, handlers, browser worker
│   ├── client.ts       # Axios instance com interceptors
│   └── queryClient.ts  # TanStack Query client
├── components/
│   ├── layout/         # Header, Footer, PublicLayout, DashboardLayout, AdminLayout
│   ├── shared/         # EventCard, CategoryNav, FilterBar
│   └── ui/             # Button, Input, Select, Modal, Badge, Card, Spinner, Tabs
├── hooks/              # usePageTitle, useScrollToTop
├── lib/                # env, constants, format
├── pages/
│   ├── admin/          # Dashboard, Users, Events, Orders, Organizers, Financial, Fleet
│   ├── auth/           # Login, Register
│   ├── buyer/          # Dashboard, MyTickets
│   ├── organizer/      # Dashboard, EventList, EventForm, SalesAnalytics, AttendeeList, Settings
│   ├── public/         # LandingPage, EventCatalog, EventDetail, CarCatalog, páginas estáticas
│   └── validation/     # ValidationPortal
├── router/             # Rotas, guards (ProtectedRoute, OrganizerRoute, AdminRoute), layouts
├── stores/             # useAuthStore, useCartStore (Zustand)
├── types/              # auth, event, order, ticket, rental
├── App.tsx
├── main.tsx
└── index.css           # Tailwind, custom tokens, utilities
```

## Rotas

| Rota | Descrição | Autenticação |
|---|---|---|
| `/` | Landing page | — |
| `/events` | Catálogo de eventos | — |
| `/events/:slug` | Detalhe do evento | — |
| `/rentals` | Aluguer de viaturas | — |
| `/login` | Login | — |
| `/register` | Registo | — |
| `/account` | Dashboard do comprador | Buyer |
| `/account/tickets` | Os meus bilhetes | Buyer |
| `/checkout/:eventId` | Checkout | Qualquer sessão |
| `/organizer` | Dashboard do organizador | Organizer |
| `/organizer/events` | Gerir eventos | Organizer |
| `/organizer/events/new` | Novo evento | Organizer |
| `/organizer/events/:id/sales` | Vendas do evento | Organizer |
| `/organizer/attendees` | Participantes | Organizer |
| `/organizer/settings` | Definições | Organizer |
| `/admin` | Dashboard admin | Admin |
| `/admin/*` | Gestão (users, events, orders, etc.) | Admin |
| `/validate` | Validação de bilhetes | Qualquer sessão |
| `/sobre`, `/ajuda`, `/como-funciona`, `/termos`, `/privacidade`, `/contacto` | Páginas estáticas | — |

## Mock API

Em desenvolvimento (`VITE_USE_MOCK=true` ou `import.meta.env.DEV`), o MSW intercepta todos os pedidos HTTP e responde com dados realistas:

- **5 eventos** com tipos de bilhete e adicionais
- **8 utilizadores** (compradores, organizadores, admin)
- **7 encomendas** e **16 bilhetes**
- **4 viaturas** para aluguer
- **30+ handlers** com delays realistas (300-1200ms)

Para desactivar, defina `VITE_USE_MOCK=false` no `.env`.

## CI

GitHub Actions corre em cada push/PR para `main`:

1. `lint:check`
2. `format:check`
3. `typecheck`
4. `build`
