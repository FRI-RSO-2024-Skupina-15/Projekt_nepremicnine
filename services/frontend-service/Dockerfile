# Build stage
FROM node:22 as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create temp directories and set permissions
RUN mkdir -p /tmp/nginx && \
    chmod -R 777 /tmp/nginx && \
    mkdir -p /var/cache/nginx && \
    chmod -R 777 /var/cache/nginx && \
    mkdir -p /var/run && \
    chmod -R 777 /var/run && \
    chmod -R 777 /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chmod 777 /var/run/nginx.pid && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

# Update nginx configuration to use temp directory
RUN echo "pid /tmp/nginx.pid;" > /etc/nginx/nginx.conf && \
    echo "worker_processes auto;" >> /etc/nginx/nginx.conf && \
    echo "events { worker_connections 1024; }" >> /etc/nginx/nginx.conf && \
    echo "http { include /etc/nginx/conf.d/*.conf; }" >> /etc/nginx/nginx.conf

USER nginx

CMD ["nginx", "-g", "daemon off;"]