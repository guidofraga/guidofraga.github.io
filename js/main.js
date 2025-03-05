// Navigation Scroll Effect
function handleNavScroll() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('scrolled', window.scrollY > 50);
}

// Use requestAnimationFrame for smoother scroll handling
let isScrolling;
window.addEventListener('scroll', () => {
    window.cancelAnimationFrame(isScrolling);
    isScrolling = window.requestAnimationFrame(handleNavScroll);
});

// Fade-in Animation using Intersection Observer
const fadeElements = document.querySelectorAll('.fade-in');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => fadeObserver.observe(element));

// Neural Network Canvas
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    const getParticleCount = () => {
        const width = window.innerWidth;
        return width < 480 ? 200 : width < 768 ? 300 : 600;
    };

    class Particle {
        constructor() {
            this.reset(true);
            this.velocity = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            };
        }

        reset(initial = false) {
            this.x = initial ? Math.random() * canvas.width : 0;
            this.y = initial ? Math.random() * canvas.height : 0;
            this.size = Math.random() * 2 + 1;
            this.baseSize = this.size;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`;
            
            if (!initial) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Keep particles within bounds
            if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
            if (this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;
            
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            // Mouse interaction
            const mouseRadius = 100;
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                this.size = Math.min(this.baseSize * 2, 4);
                const force = (mouseRadius - distance) / mouseRadius;
                this.x -= dx * force * 0.1;
                this.y -= dy * force * 0.1;
            } else {
                this.size = this.baseSize;
            }
            
            this.draw();
        }
    }

    const mouse = { x: Infinity, y: Infinity };
    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        window.addEventListener('mousemove', handleMouseMove);  
    };
    
    function init() {
        // Reset existing animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        particles = Array.from({ length: getParticleCount() }, () => new Particle());
    }

    function drawConnections() {
        // Optimized connection drawing
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(147, 197, 253, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawConnections();
        particles.forEach(particle => particle.update());
        
        animationFrameId = requestAnimationFrame(animate);
    }

    // Optimized resize handler
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            init();
            animate();
        }, 100);
    }

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    function cleanup() {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    // Initialize and animate
    init();
    animate();

    // Cleanup when page unloads
    window.addEventListener('beforeunload', cleanup);
});