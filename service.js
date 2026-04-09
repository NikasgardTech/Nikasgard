// Filter functionality with animations
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    let currentIndex = 0;
    let autoSlideInterval;

    // Filter function
    function filterProjects(category) {
        // Stop auto slide during filter
        clearInterval(autoSlideInterval);
        
        projectCards.forEach(card => {
            card.classList.add('hide');
            card.classList.remove('active-slide');
            
            setTimeout(() => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hide');
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'cardPopIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                } else {
                    card.classList.add('hide');
                }
            }, 400);
        });

        // Reset index and start auto slide after filter
        setTimeout(() => {
            currentIndex = 0;
            updateActiveSlide();
            startAutoSlide();
            updateSlideCounter();
        }, 500);
    }

    // Slideshow functions
    function showNextSlide() {
        const visibleCards = getVisibleCards();
        if (visibleCards.length === 0) return;
        
        // Add slide-out animation to current card
        visibleCards[currentIndex].classList.add('slide-out');
        
        setTimeout(() => {
            visibleCards[currentIndex].classList.remove('active-slide', 'slide-out');
            
            // Move to next index
            currentIndex = (currentIndex + 1) % visibleCards.length;
            
            // Add active class to new card with slide-in animation
            visibleCards[currentIndex].classList.add('active-slide', 'slide-in');
            
            setTimeout(() => {
                visibleCards[currentIndex].classList.remove('slide-in');
            }, 600);
            
            updateSlideCounter();
            updateIndicators();
        }, 400);
    }

    function showPrevSlide() {
        const visibleCards = getVisibleCards();
        if (visibleCards.length === 0) return;
        
        // Add slide-out animation to current card
        visibleCards[currentIndex].classList.add('slide-out-left');
        
        setTimeout(() => {
            visibleCards[currentIndex].classList.remove('active-slide', 'slide-out-left');
            
            // Move to previous index
            currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
            
            // Add active class to new card with slide-in animation from left
            visibleCards[currentIndex].classList.add('active-slide', 'slide-in-left');
            
            setTimeout(() => {
                visibleCards[currentIndex].classList.remove('slide-in-left');
            }, 600);
            
            updateSlideCounter();
            updateIndicators();
        }, 400);
    }

    function getVisibleCards() {
        return Array.from(projectCards).filter(card => !card.classList.contains('hide'));
    }

    function updateActiveSlide() {
        const visibleCards = getVisibleCards();
        projectCards.forEach(card => card.classList.remove('active-slide'));
        if (visibleCards.length > 0 && visibleCards[currentIndex]) {
            visibleCards[currentIndex].classList.add('active-slide');
        }
        updateSlideCounter();
    }

    function updateSlideCounter() {
        const visibleCards = getVisibleCards();
        const slideCounter = document.getElementById('slideCounter');
        if (slideCounter && visibleCards.length > 0) {
            slideCounter.innerHTML = `${currentIndex + 1} / ${visibleCards.length}`;
        }
    }

    function updateIndicators() {
        const visibleCards = getVisibleCards();
        const indicators = document.querySelectorAll('.slide-indicator');
        
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            showNextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    // Add click handlers to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Button click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;
            filterProjects(filterValue);
        });
    });

    // Create slide controls
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-nav-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-nav-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const slideControls = document.createElement('div');
    slideControls.className = 'slide-controls';
    slideControls.appendChild(prevBtn);
    slideControls.appendChild(nextBtn);
    
    // Create slide indicators
    const slideIndicators = document.createElement('div');
    slideIndicators.className = 'slide-indicators';
    
    // Insert controls after filter section
    const filterSection = document.querySelector('.filter-section');
    filterSection.appendChild(slideControls);
    filterSection.appendChild(slideIndicators);

    // Update indicators
    function createIndicators() {
        const visibleCards = getVisibleCards();
        slideIndicators.innerHTML = '';
        visibleCards.forEach((_, i) => {
            const indicator = document.createElement('span');
            indicator.className = 'slide-indicator';
            if (i === currentIndex) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                // Add click animation
                indicator.style.transform = 'scale(1.5)';
                setTimeout(() => indicator.style.transform = 'scale(1)', 200);
                
                currentIndex = i;
                updateActiveSlide();
                updateIndicators();
            });
            slideIndicators.appendChild(indicator);
        });
    }

    // Navigation click handlers
    nextBtn.addEventListener('click', () => {
        // Button click animation
        nextBtn.style.transform = 'scale(0.9)';
        setTimeout(() => nextBtn.style.transform = 'scale(1)', 200);
        
        // Create particle effect
        createParticleEffect(nextBtn);
        showNextSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevBtn.style.transform = 'scale(0.9)';
        setTimeout(() => prevBtn.style.transform = 'scale(1)', 200);
        
        createParticleEffect(prevBtn);
        showPrevSlide();
    });

    // Particle effect function
    function createParticleEffect(element) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            const rect = element.getBoundingClientRect();
            particle.style.left = rect.left + rect.width/2 + 'px';
            particle.style.top = rect.top + rect.height/2 + 'px';
            particle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
            particle.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            showNextSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            showPrevSlide();
            e.preventDefault();
        }
    });

    // Mouse wheel navigation
    let wheelTimeout;
    document.querySelector('.projects-grid').addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        e.preventDefault();
        
        if (e.deltaY > 0) {
            showNextSlide();
        } else {
            showPrevSlide();
        }
        
        wheelTimeout = setTimeout(() => {}, 100);
    }, { passive: false });

    // Touch navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelector('.projects-grid').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.querySelector('.projects-grid').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
            showNextSlide();
        } else if (touchEndX > touchStartX + 50) {
            showPrevSlide();
        }
    });

    // Initialize
    createIndicators();
    updateActiveSlide();
    startAutoSlide();

    // Pause auto slide on hover
    const grid = document.querySelector('.projects-grid');
    grid.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    grid.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Stagger animation on load
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add page transition effect
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});

// Mouse move parallax effect for cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card.active-slide');
    cards.forEach(card => {
        const speed = 5;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        card.style.transform = `translateY(-10px) scale(1.02) rotateX(${y}deg) rotateY(${x}deg)`;
    });
});