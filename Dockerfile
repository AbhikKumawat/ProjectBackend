# Use Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]