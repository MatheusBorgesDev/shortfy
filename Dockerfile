## Etapa 1 - Construção
FROM node:20-alpine AS builder

# Habilita pnpm
RUN corepack enable

# Define diretório de trabalho
WORKDIR /shortfy-app

# Copia arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Copia schema do Prisma (necessário para gerar o client)
COPY prisma ./prisma/

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN pnpm build


## Etapa 2 - Execução
FROM node:20-alpine AS runner

# Habilita pnpm
RUN corepack enable

# Define diretório de trabalho
WORKDIR /shortfy-app

# Define usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia dependências de produção
COPY --from=builder /shortfy-app/package.json ./
COPY --from=builder /shortfy-app/pnpm-lock.yaml ./

# Copia schema e migrations do Prisma
COPY --from=builder /shortfy-app/prisma ./prisma/

# Instala apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Gera Prisma Client novamente (necessário na imagem de produção)
RUN npx prisma generate

# Copia build do Next.js
COPY --from=builder --chown=nextjs:nodejs /shortfy-app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /shortfy-app/public ./public

# Muda para usuário não-root
USER nextjs

# Expõe porta
EXPOSE 3000

# Variável de ambiente para porta
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Script de inicialização que roda migrations antes de iniciar
CMD npx prisma migrate deploy && pnpm start