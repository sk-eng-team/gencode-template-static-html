# 🌟 Hello World Template

A modern, interactive static website template built with HTML, CSS, JavaScript, and Docker. Perfect for learning web development fundamentals or as a starting point for simple web projects.

## ✨ Features

- **🎨 Modern Design**: Clean, responsive UI with beautiful gradients and animations
- **🌙 Dark/Light Theme**: Toggle between themes with smooth transitions
- **⏰ Real-time Clock**: Display current date and time with live updates
- **🎯 Interactive Elements**: Click counter with milestone celebrations and confetti
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **⌨️ Keyboard Shortcuts**: Quick access via keyboard controls
- **💾 Local Storage**: Remembers your preferences and click count
- **🐳 Dockerized**: Easy deployment with Docker and docker-compose

## 🚀 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (usually included with Docker)

### Run with Docker Compose (Recommended)

1. Clone or download this template
2. Navigate to the project directory
3. Run the application:

```bash
docker-compose up -d
```

4. Open your browser and visit: http://localhost:8080

### Run with Docker only

```bash
# Build the image
docker build -t hello-world-template .

# Run the container
docker run -d -p 8080:80 --name hello-world-site hello-world-template
```

### Stop the application

```bash
# With docker-compose
docker-compose down

# With docker only
docker stop hello-world-site
docker rm hello-world-site
```

## 🎮 Interactive Features

### Buttons
- **Change Theme**: Toggle between light and dark themes
- **Show/Hide Time**: Display real-time clock with date and time

### Keyboard Shortcuts
- **Spacebar**: Toggle theme
- **T**: Toggle time display
- **R**: Reset click counter

### Special Effects
- **Milestone Celebrations**: Confetti animation every 10 clicks
- **Smooth Animations**: Hover effects and transitions throughout
- **Notifications**: Toast messages for user actions

## 📁 Project Structure

```
hello-world-template/
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS styles with themes
├── script.js           # Interactive JavaScript functionality
├── Dockerfile          # Docker container configuration
├── docker-compose.yml  # Docker Compose orchestration
└── README.md          # This documentation
```

## 🛠️ Development

### Local Development (without Docker)

Simply open `index.html` in your browser to develop locally. All assets are self-contained.

### Live Development with Docker

Uncomment the volume mounts in `docker-compose.yml` to enable live reload during development:

```yaml
volumes:
  - ./index.html:/usr/share/nginx/html/index.html:ro
  - ./style.css:/usr/share/nginx/html/style.css:ro
  - ./script.js:/usr/share/nginx/html/script.js:ro
```

## 🎨 Customization

### Colors and Themes
Edit CSS custom properties in `style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... other variables */
}
```

### Content
- Update text content in `index.html`
- Modify animations and interactions in `script.js`
- Add new features or sections as needed

### Server Configuration
- The default nginx configuration works for most use cases
- For custom nginx settings, create `nginx.conf` and uncomment the line in `Dockerfile`

## 🐳 Docker Configuration

### Image Details
- **Base Image**: `nginx:alpine` (lightweight, ~5MB)
- **Exposed Port**: 80 (mapped to 8080 on host)
- **Web Root**: `/usr/share/nginx/html`

### Environment Variables
- `NGINX_HOST`: Server hostname (default: localhost)
- `NGINX_PORT`: Internal nginx port (default: 80)

## 🌍 Deployment Options

### Local Development
```bash
docker-compose up
```

### Production Deployment
1. **Cloud Platforms**: Deploy to AWS, GCP, Azure using container services
2. **VPS/Dedicated Server**: Use docker-compose with reverse proxy (nginx, traefik)
3. **Static Hosting**: Extract files and deploy to Netlify, Vercel, GitHub Pages

### Scaling
```bash
# Scale multiple instances
docker-compose up --scale hello-world-web=3
```

## 📖 Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (limited support)

## 🤝 Contributing

Feel free to fork this template and customize it for your needs! Some ideas for enhancements:

- Add more interactive features
- Implement additional themes
- Create more complex animations
- Add form handling
- Include progressive web app features

## 📝 License

This template is open source and available under the [MIT License](LICENSE).

## 🎯 Use Cases

- **Learning**: Great for understanding HTML/CSS/JS fundamentals
- **Portfolio**: Use as a base for personal websites
- **Prototyping**: Quick mockups for web projects
- **Documentation**: Host simple documentation sites
- **Landing Pages**: Create simple marketing pages

---

**Happy coding!** 🚀

Made with ❤️ for the developer community. 