# # Stage 1:
# #Build the Angular app
# FROM node:18 AS build

# # Set the working directory
# WORKDIR /app

# # Set environment variables
# ARG API_URL "http://my-backend:3000/api"
# ENV NG_APP_API_URL ${API_URL}

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# # Build the app
# RUN npm run build --configuration=production

# # Stage 2:
# #Serve the app with Nginx
# FROM nginx:stable-alpine

# # Copy the built app to Nginx's default public directory
# # COPY --from=build /app/dist/frontend /usr/share/nginx/html
# COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# # RUN chmod -R 755 /usr/share/nginx/html

# # Ensure the appropriate permissions for directories Nginx uses
# RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx
# RUN chmod -R 755 /usr/share/nginx/html
# RUN mkdir -p /var/cache/nginx 
# RUN chmod 755 /var/cache/nginx 


# # Copy the custom Nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf


# # Expose port 80 for Nginx
# EXPOSE 80

# # Ensure Nginx runs as non-root in OpenShift (which is the default)
# USER nginx


# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
# Stage 1:
# Build the Angular app

# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Set environment variables
ARG API_URL="https://my-backend-crt-20206058-dev.apps.rm3.7wse.p1.openshiftapps.com"
ENV NG_APP_API_URL=${API_URL}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the built app to Nginx's default public directory
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Ensure proper permissions for Nginx
# Give full access to necessary directories
# RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx \
#     && chmod -R 777 /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx \
#     && mkdir -p /var/run/nginx \
#     && chown -R nginx:nginx /var/run/nginx \
#     && chmod 755 /var/run/nginx
    
# # Create necessary directories and set permissions for Nginx
# RUN mkdir -p /var/run/nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx \
#     && chown -R nginx:nginx /var/run/nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx \
#     && chmod -R 777 /var/run/nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx \
#     && touch /var/run/nginx.pid \
#     && chown nginx:nginx /var/run/nginx.pid

# # Give the nginx user full access to the entire filesystem
# RUN chown -R nginx:nginx && chmod -R 777 

RUN chown -R nginx:nginx /var/run /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx \
    && chmod -R 777 /var/run /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx


# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure Nginx runs as non-root
USER nginx

# Expose port 8080 for Nginx
EXPOSE 8081

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
