// ========================================
// MODAL POPUP SYSTEM
// NIKASGARD - Professional Modal
// ========================================

class ProjectModal {
    constructor() {
        // Modal HTML structure
        this.modalHTML = `
            <div class="modal-overlay" id="projectModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <div>
                            <span class="modal-title" id="modalTitle">Project Title</span>
                            <span class="modal-category" id="modalCategory">Category</span>
                        </div>
                        <button class="modal-close" id="closeModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <div class="modal-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading project details...</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <span class="modal-date" id="modalDate">2024</span>
                        <div class="modal-nav">
                            <button class="modal-nav-btn" id="prevProject">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="modal-nav-btn" id="nextProject">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.projects = [];
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', this.modalHTML);
        
        // Get elements
        this.modal = document.getElementById('projectModal');
        this.closeBtn = document.getElementById('closeModal');
        this.prevBtn = document.getElementById('prevProject');
        this.nextBtn = document.getElementById('nextProject');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalCategory = document.getElementById('modalCategory');
        this.modalBody = document.getElementById('modalBody');
        this.modalDate = document.getElementById('modalDate');
        
        // Add event listeners
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Close on overlay click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.close();
            }
            if (e.key === 'ArrowLeft' && this.modal && this.modal.classList.contains('active')) {
                this.prev();
            }
            if (e.key === 'ArrowRight' && this.modal && this.modal.classList.contains('active')) {
                this.next();
            }
        });
        
        // Load projects from page
        this.loadProjects();
    }
    
    loadProjects() {
        // Find all project cards
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            // Extract data from card
            let title = '';
            let category = card.dataset.category || 'General';
            let imgSrc = '';
            let description = '';
            let liveUrl = '#';
            let codeUrl = '#';
            let tags = [];
            
            // ==========================================
            // ✅ CHANGED: Get unique values from data attributes
            // ==========================================
            let date = card.dataset.date || '2024';
            let client = card.dataset.client || 'Client';
            let duration = card.dataset.duration || '2 Weeks';
            
            // Get title
            const titleElem = card.querySelector('h3, h4');
            if (titleElem) title = titleElem.innerText;
            
            // Get image
            const imgElem = card.querySelector('img');
            if (imgElem) imgSrc = imgElem.src;
            
            // Get description
            const descElem = card.querySelector('p');
            if (descElem) description = descElem.innerText;
            
            // Get tags
            const tagElems = card.querySelectorAll('.tag');
            tagElems.forEach(tag => {
                tags.push(tag.innerText);
            });
            
            // Get live URL
            const liveBtn = card.querySelector('.action-btn.live, .live-demo');
            if (liveBtn && liveBtn.href) liveUrl = liveBtn.href;
            
            // Get code URL
            const codeBtn = card.querySelector('.action-btn.code, .view-code');
            if (codeBtn && codeBtn.href) codeUrl = codeBtn.href;
            
            this.projects.push({
                id: index,
                title: title,
                category: category,
                image: imgSrc,
                description: description,
                liveUrl: liveUrl,
                codeUrl: codeUrl,
                tags: tags,
                date: date,
                client: client,
                duration: duration
            });
            
            // Add click event to card (but not on buttons)
            card.style.cursor = 'pointer';
            
            // Remove any existing click listeners to avoid duplicates
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener('click', (e) => {
                // Don't open modal if clicking on buttons or links
                if (e.target.closest('.action-btn') || 
                    e.target.closest('.view-details-btn') || 
                    e.target.closest('a') ||
                    e.target.closest('.live-demo') ||
                    e.target.closest('.view-code')) {
                    return;
                }
                e.preventDefault();
                this.open(index);
            });
            
            // Also handle view details button
            const viewBtn = newCard.querySelector('.view-details-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.open(index);
                });
            }
        });
    }
    
    open(index) {
        if (!this.projects[index]) return;
        this.currentIndex = index;
        this.renderContent();
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    next() {
        if (this.currentIndex < this.projects.length - 1) {
            this.currentIndex++;
            this.renderContent();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderContent();
        }
    }
    
    renderContent() {
        const project = this.projects[this.currentIndex];
        if (!project) return;
        
        // Update header
        if (this.modalTitle) this.modalTitle.textContent = project.title;
        if (this.modalCategory) this.modalCategory.textContent = project.category.toUpperCase();
        if (this.modalDate) this.modalDate.textContent = project.date;
        
        // Build modal body content
        if (this.modalBody) {
            this.modalBody.innerHTML = `
                <div class="modal-image-section">
                    <div class="modal-image">
                        <img src="${project.image}" alt="${project.title}" onerror="this.src='https://placehold.co/600x400/f6e01a/000?text=NO+IMAGE'">
                    </div>
                </div>
                <div class="modal-info-section">
                    <p class="modal-description">${project.description || 'No description available for this project.'}</p>
                    
                    <div class="modal-tech">
                        <h4><i class="fas fa-code"></i> TECHNOLOGIES</h4>
                        <div class="tech-tags">
                            ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                            ${project.tags.length === 0 ? '<span class="tech-tag">Web Development</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="modal-details">
                        <div class="detail-item">
                            <span class="detail-label"><i class="far fa-calendar-alt"></i> PROJECT DATE</span>
                            <span class="detail-value">${project.date}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="far fa-clock"></i> DURATION</span>
                            <span class="detail-value">${project.duration}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-tag"></i> CATEGORY</span>
                            <span class="detail-value">${project.category}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-user"></i> CLIENT</span>
                            <span class="detail-value">${project.client}</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        ${project.liveUrl !== '#' ? `<a href="${project.liveUrl}" target="_blank" class="modal-btn modal-btn-primary"><i class="fas fa-external-link-alt"></i> LIVE DEMO</a>` : ''}
                        ${project.codeUrl !== '#' ? `<a href="${project.codeUrl}" target="_blank" class="modal-btn modal-btn-secondary"><i class="fab fa-github"></i> VIEW CODE</a>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Update navigation buttons state
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
            this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex === this.projects.length - 1 ? '0.3' : '1';
            this.nextBtn.style.cursor = this.currentIndex === this.projects.length - 1 ? 'not-allowed' : 'pointer';
        }
    }
}

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ProjectModal();
    }, 100);
});