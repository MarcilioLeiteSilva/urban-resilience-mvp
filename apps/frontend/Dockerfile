# Stage 1: Build phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configs
COPY apps/frontend/package*.json ./
RUN npm install

# Copy app source files
COPY apps/frontend/ .

# Permite que o Next.js leia a variável de ambiente estática NA HORA DA BUILD
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Step
# Note: Next.js reads Next.config style inside here
RUN npm run build

# Stage 2: Runtime phase
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

EXPOSE 3000

# Copy all built output and dependency modules from build stage
COPY --from=builder /app ./

CMD ["npm", "run", "start"]
