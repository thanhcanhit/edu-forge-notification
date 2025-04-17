# Base image
FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Set environment variables
ENV HUSKY=0
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV HUSKY=0
ENV CI=true

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --no-audit --no-fund

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy built application from development stage
COPY --from=development /usr/src/app/dist ./dist

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]