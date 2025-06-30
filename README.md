# 💼 Sistema de Gestão Financeira Empresarial

Sistema web desenvolvido em React + TypeScript para gestão financeira empresarial, especialmente voltado para escritórios de contabilidade e consultoria tributária.

## 🚀 Funcionalidades

### 📊 **Dashboard Executivo**
- Visão geral das finanças da empresa
- Indicadores de receitas, despesas e lucro líquido
- Gráficos interativos com métricas mensais
- Alertas de obrigações tributárias vencendo

### 💰 **Gestão de Receitas**
- Cadastro de receitas por categoria (vendas, serviços, financeiro, etc.)
- Controle de status (confirmado, pendente, cancelado)
- Integração com plano de contas contábil
- Informações de clientes e números de nota fiscal

### 💸 **Controle de Despesas**
- Categorização por tipo (operacional, administrativa, tributária, financeira)
- Classificação de dedutibilidade fiscal
- Gestão de fornecedores e documentos fiscais
- Controle de vencimentos e pagamentos

### 🏛️ **Obrigações Tributárias**
- Gestão completa de impostos (IRPJ, CSLL, PIS, COFINS, ICMS, ISS, INSS, FGTS)
- Calendário de vencimentos tributários
- Controle de cumprimento das obrigações
- Alertas de vencimentos

### 📈 **Relatórios Gerenciais**
- Demonstrativos financeiros
- Análises de lucratividade
- Relatórios de conformidade fiscal
- Exportação para Excel/PDF

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **Formulários**: React Hook Form, Zod (validação)
- **Gráficos**: Recharts
- **Roteamento**: React Router Dom
- **Estado**: Context API + useReducer
- **Persistência**: LocalStorage

## 📋 **Pré-requisitos**

- Node.js v16+ instalado
- PNPM ou NPM

## 🚀 **Como Rodar o Projeto**

### 1. **Clonar o repositório**
```bash
git clone [url-do-repositorio]
cd company-cash
```

### 2. **Instalar dependências**
```bash
# Com PNPM (recomendado)
pnpm install

# Ou com NPM
npm install
```

### 3. **Executar em desenvolvimento**
```bash
# Com PNPM
pnpm dev

# Ou com NPM
npm run dev
```

### 4. **Acessar a aplicação**
Abra o navegador em: `http://localhost:5173`

## 🏗️ **Build para Produção**

```bash
# Com PNPM
pnpm build

# Ou com NPM
npm run build
```

## 📱 **Funcionalidades do Sistema**

### 🔐 **Autenticação**
- Sistema de login básico
- Persistência de sessão
- Gestão de perfis de usuário

### 📊 **Plano de Contas**
- Estrutura contábil padronizada
- Códigos de contas integrados
- Categorização automática

### 💾 **Persistência de Dados**
- Armazenamento local no navegador
- Backup automático das informações
- Importação/Exportação de dados

### 📱 **Responsivo**
- Interface adaptável para desktop, tablet e mobile
- Design moderno e intuitivo
- Navegação otimizada

## 🎯 **Público-Alvo**

- **Escritórios de Contabilidade**: Gestão financeira de múltiplos clientes
- **Consultoria Tributária**: Controle de obrigações fiscais
- **Empresas**: Acompanhamento das finanças corporativas
- **Contadores**: Ferramenta de trabalho diário

## 🔧 **Estrutura do Projeto**

```
src/
├── components/        # Componentes reutilizáveis
│   ├── ui/           # Componentes de interface
│   ├── auth/         # Componentes de autenticação
│   └── layout/       # Layout da aplicação
├── pages/            # Páginas principais
├── contexts/         # Contextos do React
├── hooks/            # Hooks customizados
├── types/            # Tipos TypeScript
└── lib/              # Utilitários
```

## 🚀 **Próximas Funcionalidades**

- [ ] **Integração com APIs**: Conectar com sistemas contábeis
- [ ] **Relatórios Avançados**: SPED, DCTF, outras obrigações
- [ ] **Multi-tenant**: Gestão de múltiplas empresas
- [ ] **Dashboard Analítico**: BI e métricas avançadas
- [ ] **Importação de Dados**: XML, CSV, integrações bancárias
- [ ] **Notificações**: E-mail, SMS para vencimentos

## 👥 **Contribuição**

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido para escritórios de contabilidade e consultoria tributária** 🏢💼
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
