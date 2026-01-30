# 🔗 Shortfy

> Encurtador de URLs moderno e performático construído com Next.js 15

Shortfy é uma aplicação full-stack para encurtar URLs, com sistema de autenticação, dashboard de estatísticas e foco em performance e qualidade de código.

---

## ✨ Features

- 🔐 **Autenticação completa** (JWT + cookies HTTP-only)
- 🔗 **Encurtamento de URLs** (códigos únicos de 6 caracteres)
- 📊 **Dashboard com estatísticas** (total de URLs, cliques, datas)
- 📋 **Listagem de URLs** do usuário
- 📈 **Contador de cliques** em tempo real
- 🎨 **Interface moderna** com Tailwind CSS + shadcn/ui
- ⚡ **Performance otimizada** (React.memo, useMemo, useCallback)
- 🧪 **Testes unitários** com Vitest + Testing Library

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3.4**
- **shadcn/ui** (componentes)
- **TanStack Query** (cache e state management)
- **React Hook Form** + **Zod** (formulários e validação)

### **Backend**
- **Next.js API Routes**
- **Prisma 5** (ORM)
- **PostgreSQL 16** (Docker)
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)

### **DevTools**
- **pnpm** (package manager)
- **Docker Compose** (PostgreSQL)
- **Biome** (linter/formatter)
- **Vitest** (testes)
- **Bundle Analyzer** (análise de performance)

---

## 🚀 Como Rodar

### **Pré-requisitos**
- Node.js 20+
- pnpm (ou npm/yarn)
- Docker e Docker Compose

### **1. Clone o repositório**
```bash
git clone https://github.com/MatheusBorgesDev/shortfy.git
cd shortfy
```

### **2. Instale as dependências**
```bash
pnpm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
DATABASE_URL="postgresql://shortfy:shortfy123@localhost:5432/shortfy_db"
JWT_SECRET="seu-secret-aqui"
```

### **4. Inicie o banco de dados (Docker)**
```bash
pnpm db:start
```

### **5. Rode as migrations**
```bash
pnpm prisma:migrate
```

### **6. Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

🎉 Acesse: **http://localhost:3000**

---

## 📋 Scripts Disponíveis

### **Desenvolvimento**
```bash
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Inicia build de produção
```

### **Banco de Dados**
```bash
pnpm db:start         # Inicia PostgreSQL (Docker)
pnpm db:stop          # Para PostgreSQL
pnpm db:logs          # Ver logs do banco
pnpm db:restart       # Reinicia banco
```

### **Prisma**
```bash
pnpm prisma:generate  # Gera Prisma Client
pnpm prisma:migrate   # Cria/aplica migrations
pnpm prisma:studio    # Interface visual do banco
```

### **Testes**
```bash
pnpm test             # Roda testes (watch mode)
pnpm test:ui          # Interface visual de testes
pnpm test:coverage    # Relatório de cobertura
```

### **Performance**
```bash
pnpm analyze          # Análise de bundle size
pnpm lighthouse       # Auditoria de performance
```

---

## 🗄️ Estrutura do Banco de Dados
```prisma
model User {
  id        Int      @id @default(autoincrement())
  userName  String
  email     String   @unique
  password  String   // Hash bcrypt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  urls      Url[]
}

model Url {
  id          Int      @id @default(autoincrement())
  originalUrl String
  shortCode   String   @unique  // 6 caracteres
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
  userId      Int
  user        User     @relation(...)
}
```

---

## 🎯 Funcionalidades em Destaque

### **Autenticação**
- Registro e login com validação
- JWT armazenado em cookies HTTP-only (segurança contra XSS)
- Middleware protegendo rotas privadas

### **Encurtamento de URLs**
- Geração de códigos únicos de 6 caracteres
- Verificação de duplicatas no banco
- Redirecionamento otimizado (Server Component)

### **Performance**
- Memoização com `useMemo` e `useCallback`
- Componentes otimizados com `React.memo`
- Bundle analyzer configurado
- Output standalone para Docker

### **Testes**
- Cobertura de componentes críticos
- Testes de validações Zod
- Simulação de interações do usuário

---

## 📚 Aprendizados do Projeto

Este projeto foi desenvolvido com foco em **aprendizado de práticas modernas**:

- ✅ Otimização de performance React (memoização)
- ✅ Testes unitários (Vitest + Testing Library)
- ✅ Server Components vs Client Components
- ✅ Autenticação JWT
- ✅ ORM com Prisma
- ✅ Type-safe com TypeScript + Zod

---

## 🔮 Roadmap

- [ ] Docker Compose completo (app + db)
- [ ] Editar/deletar URLs
- [ ] QR Code para URLs
- [ ] Analytics avançado com gráficos
- [ ] Customização de shortCode
- [ ] Dark mode
- [ ] Deploy (Vercel + Supabase)

---

## 📄 Licença

MIT

---