FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies in builder stage if needed
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build this externally because there is a prefetch done while building

FROM node:22-alpine AS runner
WORKDIR /app

# Copy build output and node_modules, package.json etc. from builder or host
COPY .next ./.next
COPY public ./public
COPY node_modules ./node_modules
COPY package.json ./

ENV BACKEND_URL=http://backend:3000
ENV NEXT_PUBLIC_API_URL=http://frontend-home:3002/api
EXPOSE 3002

# Start the app
CMD ["npm", "run", "start"]
