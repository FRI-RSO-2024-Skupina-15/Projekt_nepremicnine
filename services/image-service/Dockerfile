# Use Node.js base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

RUN mkdir -p uploads && chmod 777 uploads   

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Accept build arguments and pass them to environment
ARG MONGO_URI
ENV MONGO_URI=${MONGO_URI}

# Expose the app port
EXPOSE 3001

# Start the application
CMD ["node", "src/index.js"]
