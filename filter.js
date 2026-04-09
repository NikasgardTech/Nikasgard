// Filter functionality for category pages
document.addEventListener('DOMContentLoaded', () => {
    // Get current page category from URL or data attribute
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    // Set active state in navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage + '.html' || 
            (currentPage === 'index' && href === 'index.html') ||
            (currentPage === 'website' && href === 'website.html') ||
            (currentPage === 'logo' && href === 'logo.html')) {
            link.classList.add('active');
        }
    });

    // Slideshow functionality for all project cards
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.project-grid');
    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;

    // Set card indices for animation
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Create navigation elements
    function createNavigation() {
        // Remove existing if any
        const existingCounter = document.querySelector('.slide-counter');
        const existingControls = document.querySelector('.slide-controls');
        const existingIndicators = document.querySelector('.slide-indicators');
        
        if (existingCounter) existingCounter.remove();
        if (existingControls) existingControls.remove();
        if (existingIndicators) existingIndicators.remove();

        // Slide counter
        const slideCounter = document.createElement('div');
        slideCounter.className = 'slide-counter';
        slideCounter.id = 'slideCounter';
        slideCounter.innerHTML = `1 / ${projectCards.length}`;
        
        // Navigation buttons
        const slideControls = document.createElement('div');
        slideControls.className = 'slide-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slide-nav-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slide-nav-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        slideControls.appendChild(prevBtn);
        slideControls.appendChild(nextBtn);
        
        // Slide indicators
        const slideIndicators = document.createElement('div');
        slideIndicators.className = 'slide-indicators';
        
        for (let i = 0; i < projectCards.length; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'slide-indicator';
            indicator.dataset.index = i;
            indicator.addEventListener('click', () => goToSlide(i));
            slideIndicators.appendChild(indicator);
        }
        
        // Navigation hints
        const navHints = document.createElement('div');
        navHints.className = 'navigation-hints';
        navHints.innerHTML = `
            <span><i class="fas fa-mouse"></i> Click arrows</span>
            <span><i class="fas fa-keyboard"></i> Keyboard arrows</span>
            <span><i class="fas fa-sync-alt"></i> Auto-slideshow</span>
        `;
        
        // Insert all elements
        const container = document.querySelector('.projects-container');
        const title = document.querySelector('.section-title');
        const grid = document.querySelector('.project-grid');
        
        container.insertBefore(slideCounter, grid);
        container.insertBefore(slideControls, grid.nextSibling);
        container.insertBefore(slideIndicators, slideControls.nextSibling);
        container.insertBefore(navHints, slideIndicators.nextSibling);
        
        return { slideCounter, slideIndicators, prevBtn, nextBtn };
    }

    const { slideCounter, slideIndicators, prevBtn, nextBtn } = createNavigation();
    const indicators = document.querySelectorAll('.slide-indicator');

    // Update active slide
    function updateActiveSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Remove active class from all cards
        projectCards.forEach(card => {
            card.classList.remove('active-slide');
        });
        
        // Add active class to current card
        projectCards[index].classList.add('active-slide');
        
        // Update counter
        slideCounter.innerHTML = `${index + 1} / ${projectCards.length}`;
        
        // Update indicators
        indicators.forEach((ind, i) => {
            if (i === index) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
        
        // Smooth scroll to active card
        if (projectsGrid) {
            const cardWidth = projectCards[index].offsetWidth + 30;
            const scrollPosition = cardWidth * index;
            
            projectsGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    // Next slide function
    function showNextSlide() {
        if (isTransitioning) return;
        
        createClickEffect();
        
        projectCards[currentIndex].classList.add('slide-out-left');
        
        setTimeout(() => {
            projectCards[currentIndex].classList.remove('slide-out-left');
            currentIndex = (currentIndex + 1) % projectCards.length;
            updateActiveSlide(currentIndex);
            
            projectCards[currentIndex].classList.add('slide-in-right');
            setTimeout(() => {
                projectCards[currentIndex].classList.remove('slide-in-right');
            }, 600);
        }, 400);
        
        resetAutoSlide();
    }

    // Previous slide function
    function showPrevSlide() {
        if (isTransitioning) return;
        
        createClickEffect();
        
        projectCards[currentIndex].classList.add('slide-out-right');
        
        setTimeout(() => {
            projectCards[currentIndex].classList.remove('slide-out-right');
            currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
            updateActiveSlide(currentIndex);
            
            projectCards[currentIndex].classList.add('slide-in-left');
            setTimeout(() => {
                projectCards[currentIndex].classList.remove('slide-in-left');
            }, 600);
        }, 400);
        
        resetAutoSlide();
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        
        createClickEffect();
        
        const direction = index > currentIndex ? 'next' : 'prev';
        
        if (direction === 'next') {
            projectCards[currentIndex].classList.add('slide-out-left');
        } else {
            projectCards[currentIndex].classList.add('slide-out-right');
        }
        
        setTimeout(() => {
            projectCards[currentIndex].classList.remove('slide-out-left', 'slide-out-right');
            currentIndex = index;
            updateActiveSlide(currentIndex);
            
            if (direction === 'next') {
                projectCards[currentIndex].classList.add('slide-in-right');
            } else {
                projectCards[currentIndex].classList.add('slide-in-left');
            }
            
            setTimeout(() => {
                projectCards[currentIndex].classList.remove('slide-in-right', 'slide-in-left');
            }, 600);
        }, 400);
        
        resetAutoSlide();
    }

    // Click effect
    function createClickEffect() {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'var(--primary)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        ripple.style.zIndex = '9999';
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showNextSlide();
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Navigation click handlers
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevBtn.style.transform = 'scale(0.9)';
            setTimeout(() => prevBtn.style.transform = 'scale(1)', 200);
            showPrevSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextBtn.style.transform = 'scale(0.9)';
            setTimeout(() => nextBtn.style.transform = 'scale(1)', 200);
            showNextSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            showNextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            showPrevSlide();
        }
    });

    // Mouse wheel navigation
    if (projectsGrid) {
        let wheelTimeout;
        projectsGrid.addEventListener('wheel', (e) => {
            e.preventDefault();
            clearTimeout(wheelTimeout);
            
            if (e.deltaY > 0) {
                showNextSlide();
            } else {
                showPrevSlide();
            }
            
            wheelTimeout = setTimeout(() => {}, 100);
        }, { passive: false });
    }

    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (projectsGrid) {
        projectsGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        projectsGrid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance < 0) {
                    showNextSlide();
                } else {
                    showPrevSlide();
                }
            }
        });
    }

    // Pause auto slide on hover
    if (projectsGrid) {
        projectsGrid.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        projectsGrid.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // Initialize
    updateActiveSlide(0);
    startAutoSlide();

    // Add parallax effect
    if (projectsGrid) {
        projectsGrid.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.project-card.active-slide');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
        });

        projectsGrid.addEventListener('mouseleave', () => {
            const cards = document.querySelectorAll('.project-card.active-slide');
            cards.forEach(card => {
                card.style.transform = '';
            });
        });
    }
});

// Add ripple effect keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
    }
`;
document.head.appendChild(style);