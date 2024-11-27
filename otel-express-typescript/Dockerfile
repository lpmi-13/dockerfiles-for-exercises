# Base image for Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and compile TypeScript
COPY . .
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
