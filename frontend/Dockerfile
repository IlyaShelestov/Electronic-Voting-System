FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat gcompat
COPY package.json package-lock.json ./
RUN npm i

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm","run","start"]
