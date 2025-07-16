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

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Add a label for documentation
LABEL maintainer="Your Name <your.email@example.com>"
LABEL description="Hello World Template - Static HTML site with CSS and JavaScript"
LABEL version="1.0"

# nginx runs in the foreground by default in the alpine image
CMD ["nginx", "-g", "daemon off;"] 