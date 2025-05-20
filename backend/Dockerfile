FROM node:23-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS release
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ENV NODE_ENV=production
ENV NODE_ENV=development
EXPOSE 7000

CMD ["./scripts/docker-entrypoint.sh"]