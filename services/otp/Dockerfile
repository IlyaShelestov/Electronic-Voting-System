FROM node:23-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS release
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chmod +x scripts/docker-entrypoint.sh
EXPOSE 7001

CMD ["./scripts/docker-entrypoint.sh"]