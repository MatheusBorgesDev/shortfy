## Etapa 1 - Construção

# usa uma imagem base com node e ferramentas de build
FROM node:20-alpine as builder

# comando para habilitar o uso do pnpm, yarn e npm. O corepack é um gerenciador de gerenciadores de pacotes. Se fosse usar o npm não seria necessário
RUN corepack enable

# define diretório de trabalho (pasta raiz)
WORKDIR /shortfy-app

# copia as dependências a serem instaladas no projeto pelo pnpm
COPY pnpm-lock.yaml package.json ./

# roda a instalação da dependências (dev e prod) no container
RUN pnpm install

# copia todo o conteúdo do projeto, menos o que está no dockerignore
COPY . .

# roda o script de build
RUN pnpm build


## Etapa 2 - Execução
FROM node:20-alpine as runner

# habilita o corepack para usar pnpm (necessário novamente pois é uma nova imagem)
RUN corepack enable

# define diretório de trabalho para runner (pasta raiz)
WORKDIR /shortfy-app


# instala somente somente as dependencias de produção
COPY --from=builder /shortfy-app/package.json ./package.json
COPY --from=builder /shortfy-app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

# Copia os arquivos de produção do estágio "builder"
COPY --from=builder /shortfy-app/.next ./.next
COPY --from=builder /shortfy-app/public ./public

# expoe a porta de acesso ao container (a porta 3000 é a padrão no next, mas pode ser outra porta se necessário, que deve ser configurada no next.config.ts)
EXPOSE 3030

CMD ["pnpm", "start"]