            // Navigation Scroll Effect
            window.addEventListener('scroll', () => {
                const nav = document.querySelector('.nav');
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });

            // Fade-in Animation
            const fadeElements = document.querySelectorAll('.fade-in');
            const elementInView = (el) => {
                const rect = el.getBoundingClientRect();
                return (rect.top <= window.innerHeight && rect.bottom >= 0);
            };
            
            const checkElements = () => {
                fadeElements.forEach(el => {
                    if(elementInView(el)) {
                        el.classList.add('appear');
                    }
                });
            };
            
            window.addEventListener('scroll', checkElements);
            checkElements(); // Initial check

            document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('neural-network');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = window.innerWidth < 768 ? 200 : 500;

            class Particle {
                constructor() {
                    this.reset();
                    this.velocity = {
                        x: (Math.random() - 0.5) * 0.5,
                        y: (Math.random() - 0.5) * 0.5
                    };
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.baseSize = this.size;
                    this.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }

                update() {
                    if(this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
                    if(this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;
                    
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    
                    // Mouse interaction
                    const mouseRadius = 100;
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if(distance < mouseRadius) {
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
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            function init() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                particles = [];
                for(let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw connections
                for(let i = 0; i < particles.length; i++) {
                    for(let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx*dx + dy*dy);
                        
                        if(distance < 100) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(147, 197, 253, ${1 - distance/100})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                    particles[i].update();
                }
                requestAnimationFrame(animate);
            }

            window.addEventListener('resize', init);
            init();
            animate();
        });

