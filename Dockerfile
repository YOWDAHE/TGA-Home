FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Pages are force-dynamic; build does not require a running backend
ENV BACKEND_URL=http://127.0.0.1:1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV BACKEND_URL=http://backend:3000
ENV NEXT_PUBLIC_API_URL=http://frontend-home:3002/api
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

EXPOSE 3002

CMD ["npm", "run", "start"]
