// Project Slideshow Functionality
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectGrid = document.querySelector('.project-grid');
    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;

    // Create navigation controls
    function createNavigation() {
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
            <span><i class="fas fa-mouse"></i> Click arrows or swipe</span>
            <span><i class="fas fa-keyboard"></i> Use keyboard arrows</span>
            <span><i class="fas fa-sync-alt"></i> Auto-slideshow every 5s</span>
        `;
        
        // Insert all elements
        const container = document.querySelector('.projects-container');
        const title = document.querySelector('.section-title');
        
        container.insertBefore(slideCounter, projectGrid);
        container.insertBefore(slideControls, projectGrid.nextSibling);
        container.insertBefore(slideIndicators, slideControls.nextSibling);
        container.insertBefore(navHints, slideIndicators.nextSibling);
        
        // Add click handlers
        prevBtn.addEventListener('click', () => showPrevSlide());
        nextBtn.addEventListener('click', () => showNextSlide());
        
        return { slideCounter, slideIndicators };
    }

    const { slideCounter, slideIndicators } = createNavigation();
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
        const cardWidth = projectCards[index].offsetWidth;
        const scrollPosition = (cardWidth + 40) * index; // 40px is margin
        projectGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    // Next slide function
    function showNextSlide() {
        if (isTransitioning) return;
        
        // Add click ripple effect
        createRippleEffect();
        
        // Animation for current card
        projectCards[currentIndex].classList.add('slide-out-left');
        
        setTimeout(() => {
            projectCards[currentIndex].classList.remove('slide-out-left');
            currentIndex = (currentIndex + 1) % projectCards.length;
            updateActiveSlide(currentIndex);
            
            // Add slide-in animation to new card
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
        
        // Add click ripple effect
        createRippleEffect();
        
        // Animation for current card
        projectCards[currentIndex].classList.add('slide-out-right');
        
        setTimeout(() => {
            projectCards[currentIndex].classList.remove('slide-out-right');
            currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
            updateActiveSlide(currentIndex);
            
            // Add slide-in animation to new card
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
        
        // Add click ripple effect
        createRippleEffect();
        
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

    // Create ripple effect on click
    function createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Auto slide function
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showNextSlide();
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
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
    let wheelTimeout;
    projectGrid.addEventListener('wheel', (e) => {
        e.preventDefault();
        clearTimeout(wheelTimeout);
        
        if (e.deltaY > 0) {
            showNextSlide();
        } else {
            showPrevSlide();
        }
        
        wheelTimeout = setTimeout(() => {}, 100);
    }, { passive: false });

    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    projectGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    projectGrid.addEventListener('touchend', (e) => {
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

    // Pause auto slide on hover
    projectGrid.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    projectGrid.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Initialize
    updateActiveSlide(0);
    startAutoSlide();

    // Add staggered animation on load
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
});