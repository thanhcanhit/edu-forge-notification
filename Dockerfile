FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
ENV HUSKY=0
RUN npm install --ignore-scripts

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all source files
COPY . .

# Build application
RUN npm run build

# Generate Prisma client for production
RUN npx prisma generate

# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/prisma ./prisma
COPY --from=build-stage /app/node_modules ./node_modules

# Install MongoDB tools for mongosh
RUN apk add --no-cache mongodb-tools

# Expose port
EXPOSE 3006

CMD ["node", "dist/src/main.js"]

# Production stage
FROM node:20-alpine AS production

# Install only necessary packages
RUN apk add --no-cache mongodb-tools && \
    apk add --no-cache --virtual .build-deps curl && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/prisma ./prisma
COPY --from=build-stage /app/node_modules/.prisma ./node_modules/.prisma

# Install only production dependencies
ENV HUSKY=0
RUN npm install --omit=dev --ignore-scripts && \
    npm cache clean --force 

# Expose port
EXPOSE 3006

# Set NODE_ENV
ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]