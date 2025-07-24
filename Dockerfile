# Use the official nginx alpine image for smaller size
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Remove the default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy our static files to the nginx html directory
COPY index.html .
COPY style.css .
COPY script.js .

# Configure nginx to listen on port 3000
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 3000;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# nginx runs in the foreground by default in the alpine image
CMD ["nginx", "-g", "daemon off;"] 