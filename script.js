// DOM elements
const changeColorBtn = document.getElementById('changeColorBtn');
const showTimeBtn = document.getElementById('showTimeBtn');
const timeDisplay = document.getElementById('timeDisplay');
const clickCounter = document.getElementById('clickCounter');

// State variables
let isDarkTheme = false;
let clickCount = 0;
let timeInterval = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Hello World Template loaded successfully!');
    
    // Add welcome animation
    animateWelcome();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }
    
    // Load saved click count
    const savedClicks = localStorage.getItem('clickCount');
    if (savedClicks) {
        clickCount = parseInt(savedClicks);
        updateClickCounter();
    }
});

// Theme toggle functionality
changeColorBtn.addEventListener('click', function() {
    toggleTheme();
    incrementClickCounter();
    
    // Add click animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Time display functionality
showTimeBtn.addEventListener('click', function() {
    toggleTimeDisplay();
    incrementClickCounter();
    
    // Add click animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Functions
function toggleTheme() {
    const body = document.body;
    
    if (!isDarkTheme) {
        body.classList.add('dark-theme');
        changeColorBtn.textContent = '☀️ Light Theme';
        isDarkTheme = true;
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 Dark theme activated!');
    } else {
        body.classList.remove('dark-theme');
        changeColorBtn.textContent = '🌙 Dark Theme';
        isDarkTheme = false;
        localStorage.setItem('theme', 'light');
        showNotification('☀️ Light theme activated!');
    }
}

function toggleTimeDisplay() {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
        timeDisplay.textContent = '';
        showTimeBtn.textContent = 'Show Time';
        showNotification('⏰ Time display stopped');
    } else {
        startTimeDisplay();
        showTimeBtn.textContent = 'Hide Time';
        showNotification('⏰ Time display started');
    }
}

function startTimeDisplay() {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const formattedTime = now.toLocaleDateString('en-US', options);
    timeDisplay.textContent = `📅 ${formattedTime}`;
}

function incrementClickCounter() {
    clickCount++;
    updateClickCounter();
    localStorage.setItem('clickCount', clickCount.toString());
    
    // Add celebration animation for milestones
    if (clickCount % 10 === 0) {
        celebrateClick();
    }
}

function updateClickCounter() {
    clickCounter.textContent = clickCount;
    
    // Add pulse animation
    clickCounter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        clickCounter.style.transform = '';
    }, 200);
}

function celebrateClick() {
    showNotification(`🎉 Congratulations! You've clicked ${clickCount} times!`);
    
    // Add confetti effect (simple version)
    createConfetti();
}

function createConfetti() {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#82e0aa'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function animateWelcome() {
    const hero = document.querySelector('.hero .container');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        hero.style.transition = 'all 0.8s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 200);
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add some fun keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to toggle theme
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        toggleTheme();
        incrementClickCounter();
    }
    
    // 'T' key to toggle time
    if (e.key.toLowerCase() === 't' && !e.target.matches('input, textarea')) {
        toggleTimeDisplay();
        incrementClickCounter();
    }
    
    // 'R' key to reset counter
    if (e.key.toLowerCase() === 'r' && !e.target.matches('input, textarea')) {
        clickCount = 0;
        updateClickCounter();
        localStorage.setItem('clickCount', '0');
        showNotification('🔄 Counter reset!');
    }
});

// Add window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Adjust layout if needed
    console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
});

// Log some info for developers
console.log(`
🎯 Hello World Template
📝 Available keyboard shortcuts:
   • Space: Toggle theme
   • T: Toggle time display  
   • R: Reset click counter
   
🔧 Built with HTML, CSS, JavaScript & Docker
`);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth'; 