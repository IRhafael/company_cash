# CompanyCash - Sistema de Gestão Financeira Empresarial

Sistema completo de gestão financeira adaptado para empresas de contabilidade e consultoria, com interface móvel (PWA) e backend integrado.

## 🚀 Características

- ✅ **Interface Mobile-First**: Layout totalmente responsivo com PWA
- ✅ **Adaptado para Negócios**: Contexto empresarial/contabilidade
- ✅ **API Ready**: Frontend preparado para backend
- ✅ **Progressive Web App**: Instalável em dispositivos móveis
- ✅ **TypeScript**: Tipagem completa
- ✅ **Backend incluído**: API Node.js + Express + SQLite

## 📱 Funcionalidades

### Frontend
- Dashboard financeiro interativo
- Gestão de receitas e despesas
- Controle de obrigações tributárias
- Relatórios visuais com gráficos
- Interface PWA instalável
- Layout responsivo para mobile/desktop

### Backend (Estrutura criada)
- API REST completa
- Autenticação JWT
- Base de dados SQLite
- Rate limiting e segurança
- Estrutura preparada para produção

## 🛠 Tecnologias

### Frontend
- React 18 + TypeScript
- Vite + PWA Plugin
- TailwindCSS + Shadcn/ui
- React Router Dom
- Recharts (gráficos)
- Zod (validação)

### Backend
- Node.js + Express
- TypeScript
- SQLite + sqlite3
- JWT + bcryptjs
- Helmet + CORS
- Rate limiting

## 📦 Instalação e Configuração

### 1. Frontend

```powershell
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
Copy-Item .env.example .env

# Editar .env com suas configurações:
VITE_API_URL=http://localhost:3001/api
```

### 2. Backend

```powershell
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# A configuração já está pronta no arquivo .env
# Modifique se necessário:
PORT=3001
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_mude_em_producao
DATABASE_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
```

## 🚀 Como Executar

### Desenvolvimento

```powershell
# Terminal 1 - Frontend
pnpm dev

# Terminal 2 - Backend
cd backend
npm run dev
```

O frontend estará disponível em http://localhost:5173
O backend estará disponível em http://localhost:3001

### Produção

```powershell
# Frontend
pnpm build
pnpm preview

# Backend
cd backend
npm run build
npm start
```

## 📱 PWA (Progressive Web App)

### Características PWA Implementadas:
- ✅ Service Worker automático
- ✅ Manifesto configurado
- ✅ Ícones PWA incluídos
- ✅ Prompt de instalação automático
- ✅ Funciona offline (cache básico)
- ✅ Instalável em iOS e Android

### Como instalar no mobile:

**Android:**
1. Abra o app no Chrome
2. Clique no prompt que aparece
3. Ou: Menu > "Adicionar à tela inicial"

**iOS:**
1. Abra no Safari
2. Toque no botão de compartilhar (⬆️)
3. Selecione "Adicionar à Tela de Início"

## 🔧 Estrutura do Projeto

```
company_cash/
├── src/                          # Frontend React
│   ├── components/              # Componentes UI
│   │   ├── auth/               # Componentes de autenticação
│   │   ├── layout/             # Layout responsivo
│   │   ├── ui/                 # Componentes Shadcn/ui
│   │   └── PWAInstallPrompt.tsx # Prompt instalação PWA
│   ├── contexts/               # Context API + Estado
│   ├── pages/                  # Páginas principais
│   ├── services/               # API client
│   ├── types/                  # TypeScript types
│   └── hooks/                  # Custom hooks
├── backend/                     # API Backend
│   └── src/
│       ├── routes/             # Rotas da API
│       ├── database/           # Configuração DB
│       ├── middleware/         # Middlewares
│       └── utils/              # Utilitários
├── public/                     # Assets estáticos + PWA
└── package.json               # Dependências frontend
```

## 🔐 Autenticação

O sistema está preparado para autenticação JWT:

1. **Login/Register**: Endpoints criados em `/api/auth/`
2. **Token Storage**: localStorage para persistência
3. **Protected Routes**: Context gerencia autenticação
4. **API Integration**: Service layer preparado

## 📊 Gestão de Dados

### Estado da Aplicação:
- **Context API**: Gerenciamento de estado centralizado
- **API Service**: Camada de comunicação com backend
- **Types**: Tipagem completa para todas as entidades

### Entidades principais:
- **User**: Usuários do sistema
- **Income**: Receitas da empresa
- **Expense**: Despesas da empresa  
- **TaxObligation**: Obrigações tributárias
- **IncomeSource**: Categorias de receita
- **ExpenseCategory**: Categorias de despesa

## 🎨 Interface

### Layout Responsivo:
- **Desktop**: Sidebar + conteúdo principal
- **Mobile**: Header + bottom navigation + sidebar sheet
- **PWA**: Otimizado para instalação mobile

### Temas e Cores:
- Verde principal: `#10B981` (Emerald 500)
- Modo escuro: Preparado (via next-themes)
- Componentes: Shadcn/ui + TailwindCSS

## 🔄 Próximos Passos

### Backend (Para completar):
1. **Implementar lógica de autenticação** em `/backend/src/routes/auth.ts`
2. **Implementar CRUD** para todas as entidades
3. **Adicionar validações** e middleware de autenticação
4. **Configurar relatórios** e exportação de dados
5. **Deploy** em serviço de cloud (Railway, Render, etc.)

### Frontend (Melhorias opcionais):
1. **Formulários** para criar/editar entidades
2. **Validações** de formulário com Zod
3. **Notificações** para feedback do usuário
4. **Filtros** e pesquisa nas listagens
5. **Gráficos** mais detalhados

## 🚀 Deploy

### Frontend (Vercel/Netlify):
```powershell
pnpm build
# Upload da pasta dist/
```

### Backend (Railway/Render):
```powershell
cd backend
npm run build
# Deploy da pasta com package.json e dist/
```

### Variáveis de ambiente em produção:
- `VITE_API_URL`: URL do backend em produção
- `JWT_SECRET`: Chave segura aleatória
- `DATABASE_PATH`: Caminho para SQLite
- `FRONTEND_URL`: URL do frontend

## 📝 Licença

MIT License - Livre para uso pessoal e comercial.

## 🆘 Suporte

Para dúvidas sobre o desenvolvimento:
1. Verifique a documentação das tecnologias usadas
2. Os TODO comentários indicam próximos passos
3. A estrutura está preparada - basta implementar a lógica

---

**Status**: ✅ Frontend adaptado | ✅ PWA configurado | ⏳ Backend estruturado | ⏳ Integração pendente
