FROM node:20-buster AS base
WORKDIR /app

ENV PATH="/root/.bun/bin:${PATH}"
RUN apt-get update && apt-get install -y curl python3 make g++ git && \
    curl -fsSL https://bun.sh/install | bash && \
    bun install -g husky && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

FROM base AS deps

WORKDIR /app

RUN mkdir -p /temp/dev && \
    mkdir -p /temp/dev/ui && \
    mkdir -p /temp/dev/packages
COPY ./package.json ./bun.lockb /temp/dev
COPY ./ui /temp/dev/ui
COPY ./packages /temp/dev/packages
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

COPY --from=deps /temp/dev/node_modules ./node_modules
COPY --from=deps /temp/dev/package.json ./package.json
COPY --from=deps /temp/dev/packages ./packages
COPY --from=deps /temp/dev/ui ./ui
ENV NODE_ENV production

ENV NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS=APP_NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS
ENV NEXT_PUBLIC_SUN_ID_ADDRESS=APP_NEXT_PUBLIC_SUN_ID_ADDRESS
ENV NEXT_PUBLIC_API_HOST=APP_NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_NOTIFICATION=APP_NEXT_PUBLIC_NOTIFICATION

RUN cd ui && bun run build

# # # # Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache bash

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

COPY --from=builder --chown=nextjs:nodejs /app/ui/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/ui/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/ui/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/ui/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["node", "server.js"]
