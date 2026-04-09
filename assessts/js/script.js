// ========================================
// PARTICLE BACKGROUND ANIMATION
// NIKASGARD - Professional Effect
// ========================================

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Canvas size setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let particlesArray = [];

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        // Boundary check
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particlesArray = [];
    let numberOfParticles = Math.floor((canvas.height * canvas.width) / 8000);
    
    if (numberOfParticles > 300) numberOfParticles = 300;
    if (numberOfParticles < 50) numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = (Math.random() * 0.8) - 0.4;
        let directionY = (Math.random() * 0.8) - 0.4;
        let color = '#f6e01a';
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles with lines
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                let opacity = 1 - (distance / 150);
                ctx.strokeStyle = `rgba(246, 224, 26, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Start everything
initParticles();
animateParticles();

// ========================================
// FORM SUBMISSION HANDLER (for index.html)
// ========================================

const contactForm = document.getElementById('contactForm');
const responseMsg = document.getElementById('responseMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        if (btnText && btnLoader) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
        }
        submitBtn.disabled = true;
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                }
            });
            
            if (response.ok) {
                if (responseMsg) {
                    responseMsg.textContent = "Your message has been sent successfully!";
                    responseMsg.className = "form-response success";
                    responseMsg.style.display = "block";
                }
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch (err) {
            if (responseMsg) {
                responseMsg.textContent = "Oops! Something went wrong. Please try again.";
                responseMsg.className = "form-response error";
                responseMsg.style.display = "block";
            }
        } finally {
            if (btnText && btnLoader) {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
            }
            submitBtn.disabled = false;
            
            if (responseMsg) {
                setTimeout(() => {
                    responseMsg.style.opacity = '0';
                    setTimeout(() => { 
                        responseMsg.style.display = 'none'; 
                        responseMsg.style.opacity = '1'; 
                    }, 500);
                }, 6000);
            }
        }
    });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (href === '#enquiry' || href === '#home') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========================================
// ADD ACTIVE CLASS TO NAVIGATION
// ========================================

function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNav();

console.log('NIKASGARD - Website Loaded Successfully!');

// Adds a subtle console log for fun - professional and clean
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
                const techName = card.querySelector('h3')?.innerText || 'Technology';
                console.log(`🔧 NIKASGARD | Exploring: ${techName}`);
            });
        });