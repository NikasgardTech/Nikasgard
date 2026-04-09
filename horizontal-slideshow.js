// Horizontal Slideshow Functionality
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;

    // Set card indices for animation
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Create navigation elements
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
            <span><i class="fas fa-mouse"></i> Click arrows</span>
            <span><i class="fas fa-keyboard"></i> Keyboard arrows</span>
            <span><i class="fas fa-arrows-alt-h"></i> Drag to scroll</span>
        `;
        
        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'slide-progress';
        progressBar.innerHTML = '<div class="slide-progress-bar" id="progressBar"></div>';
        
        // Drag hint
        const dragHint = document.createElement('div');
        dragHint.className = 'drag-hint';
        dragHint.innerHTML = '<i class="fas fa-arrows-alt-h"></i> Drag horizontally to browse <i class="fas fa-arrows-alt-h"></i>';
        
        // Insert all elements
        const container = document.querySelector('.portfolio-container');
        const filterSection = document.querySelector('.filter-section');
        
        container.insertBefore(slideCounter, projectsGrid);
        container.insertBefore(slideControls, projectsGrid.nextSibling);
        container.insertBefore(slideIndicators, slideControls.nextSibling);
        container.insertBefore(progressBar, slideIndicators.nextSibling);
        container.insertBefore(navHints, progressBar.nextSibling);
        container.insertBefore(dragHint, navHints.nextSibling);
        
        return { 
            slideCounter, 
            slideIndicators, 
            prevBtn, 
            nextBtn,
            progressBar: document.getElementById('progressBar')
        };
    }

    const { slideCounter, slideIndicators, prevBtn, nextBtn, progressBar } = createNavigation();
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
        
        // Update progress bar
        const progress = ((index + 1) / projectCards.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update indicators
        indicators.forEach((ind, i) => {
            if (i === index) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
        
        // Smooth scroll to active card
        const cardWidth = projectCards[index].offsetWidth + 30;
        const scrollPosition = cardWidth * index;
        
        projectsGrid.scrollTo({
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

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.dataset.filter;
            filterProjects(filterValue);
        });
    });

    function filterProjects(category) {
        clearInterval(autoSlideInterval);
        
        let visibleCount = 0;
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'cardAppear 0.8s ease forwards';
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        slideCounter.innerHTML = `1 / ${visibleCount}`;
        currentIndex = 0;
        
        indicators.forEach((ind, i) => {
            if (i < visibleCount) {
                ind.style.display = 'block';
            } else {
                ind.style.display = 'none';
            }
        });
        
        if (visibleCount > 0) {
            updateActiveSlide(0);
            startAutoSlide();
        }
    }

    // Navigation click handlers
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

    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
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

    // Drag to scroll
    let isDragging = false;
    let startX;
    let scrollLeft;

    projectsGrid.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - projectsGrid.offsetLeft;
        scrollLeft = projectsGrid.scrollLeft;
        projectsGrid.style.cursor = 'grabbing';
    });

    projectsGrid.addEventListener('mouseleave', () => {
        isDragging = false;
        projectsGrid.style.cursor = 'grab';
    });

    projectsGrid.addEventListener('mouseup', () => {
        isDragging = false;
        projectsGrid.style.cursor = 'grab';
    });

    projectsGrid.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - projectsGrid.offsetLeft;
        const walk = (x - startX) * 2;
        projectsGrid.scrollLeft = scrollLeft - walk;
    });

    // Pause auto slide on hover
    projectsGrid.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    projectsGrid.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Initialize
    updateActiveSlide(0);
    startAutoSlide();

    // Parallax effect
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
});