# Base image for Node.js
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and compile TypeScript
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
