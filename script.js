// Smooth Scrolling Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const ctaButton = document.querySelector('.cta-button');
    
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Global function for HTML onclick attributes
    window.scrollToSection = function(sectionId) {
        smoothScroll('#' + sectionId);
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    // CTA Button smooth scroll to contact
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll('#contact');
        });
    }
    
    // Mobile menu toggle - Fixed to use correct class name
    const mobileMenuBtn = document.querySelector('.hamburger'); // Changed from .mobile-menu-btn
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// Enhanced Count-up Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Enhanced Stats Counter Animation
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const targetValue = counter.getAttribute('data-target');
                // Remove commas and parse as integer
                const target = parseInt(targetValue.replace(/[^0-9]/g, ''));
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    // Observe all stats sections
    const heroStats = document.querySelector('.hero-stats');
    const brandsStats = document.querySelector('.brands-stats');
    const instagramStatsNumbers = document.querySelector('.instagram-stats-numbers');
    
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    if (brandsStats) {
        statsObserver.observe(brandsStats);
    }
    if (instagramStatsNumbers) {
        statsObserver.observe(instagramStatsNumbers);
    }
});

// About Section Photo Slideshow - Fixed to match HTML structure
class PhotoSlideshow {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length > 0) {
            this.showSlide(0);
            this.startAutoSlide();
            this.addEventListeners();
        }
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }
    
    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 2000);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
    
    addEventListeners() {
        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoSlide();
                this.showSlide(index);
                this.startAutoSlide();
            });
        });
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
}

// Global functions for HTML onclick attributes
window.currentSlide = function(n) {
    const slideshow = document.querySelector('.slideshow-container');
    if (slideshow && slideshow.slideshowInstance) {
        slideshow.slideshowInstance.showSlide(n - 1);
    }
};

// Initialize slideshow
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        const slideshow = new PhotoSlideshow(slideshowContainer);
        slideshowContainer.slideshowInstance = slideshow; // Store reference for global function
    }
});

// Video Modal Functionality
class VideoModal {
    constructor() {
        this.modal = document.querySelector('#videoModal');
        if (!this.modal) {
            this.createModal();
        }
        this.addEventListeners();
    }
    
    createModal() {
        // Modal already exists in HTML, just get reference
        this.modal = document.querySelector('#videoModal');
    }
    
    open(videoSrc, title) {
        const video = this.modal.querySelector('#modalVideo');
        const source = video.querySelector('source');
        const titleEl = this.modal.querySelector('#modalTitle');
        
        source.src = videoSrc;
        titleEl.textContent = title;
        video.load();
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        const video = this.modal.querySelector('#modalVideo');
        video.pause();
        video.currentTime = 0;
        
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    addEventListeners() {
        // Close modal events
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('close')) {
                this.close();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
    }
}

// Global functions for HTML onclick attributes
let videoModalInstance;

window.openModal = function(videoSrc, title) {
    if (!videoModalInstance) {
        videoModalInstance = new VideoModal();
    }
    videoModalInstance.open(videoSrc, title);
};

window.closeModal = function() {
    if (videoModalInstance) {
        videoModalInstance.close();
    }
};

// Initialize video modal
document.addEventListener('DOMContentLoaded', function() {
    videoModalInstance = new VideoModal();
});

// Infinite Logo Carousel
class LogoCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.brands-track');
        if (!this.track) return;
        
        this.logos = Array.from(this.track.children);
        this.init();
    }
    
    init() {
        // Clone logos for infinite effect
        this.logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            this.track.appendChild(clone);
        });
        
        // Add hover effects
        this.addHoverEffects();
    }
    
    addHoverEffects() {
        const allLogos = this.track.querySelectorAll('img');
        
        allLogos.forEach(logo => {
            logo.addEventListener('mouseenter', () => {
                this.track.style.animationPlayState = 'paused';
                logo.style.filter = 'grayscale(0%) brightness(1.1)';
                logo.style.transform = 'scale(1.05)';
            });
            
            logo.addEventListener('mouseleave', () => {
                this.track.style.animationPlayState = 'running';
                logo.style.filter = 'grayscale(100%)';
                logo.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize logo carousel
document.addEventListener('DOMContentLoaded', function() {
    const brandsSlider = document.querySelector('.brands-slider');
    if (brandsSlider) {
        new LogoCarousel(brandsSlider);
    }
});

// Circular Progress Bars for Instagram Stats
function animateProgressBar(progressBar, percentage) {
    const circle = progressBar.querySelector('.progress-circle');
    const percentText = progressBar.querySelector('.progress-percent');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    const offset = circumference - (percentage / 100) * circumference;
    
    // Animate the circle
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
        circle.style.strokeDashoffset = offset;
    }, 100);
    
    // Animate the percentage text
    let current = 0;
    const increment = percentage / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
            current = percentage;
            clearInterval(timer);
        }
        percentText.textContent = Math.floor(current) + '%';
    }, 20);
}

// Instagram Stats Observer
const instagramStatsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const percentage = parseInt(bar.getAttribute('data-percentage'));
                animateProgressBar(bar, percentage);
            });
            instagramStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const instagramStats = document.querySelector('.instagram-stats');
    if (instagramStats) {
        instagramStatsObserver.observe(instagramStats);
    }
});

// Contact Form Handling - Fixed ID mismatch
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contactForm'); // Changed from #contact-form
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Lazy Loading for Images
const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Scroll to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any additional scroll handling can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.portfolio .video-item video');
    const lightbox = document.querySelector('.lightbox');
    const lightboxVideo = document.querySelector('.lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentVideoIndex = 0;
    let videoItems = [];
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Auto-play videos in viewport
    function handleVideoPlayback() {
        videos.forEach(video => {
            if (isInViewport(video)) {
                if (video.paused) {
                    video.play().catch(e => console.log("Video play error:", e));
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }
    
    // Check videos on scroll and load
    window.addEventListener('scroll', handleVideoPlayback);
    handleVideoPlayback();
    
    // Create video items array for navigation
    videoItems = Array.from(videos);
    
    // Function to show video in lightbox
    function showVideoInLightbox(index) {
        if (index >= 0 && index < videoItems.length) {
            currentVideoIndex = index;
            lightboxVideo.src = videoItems[index].src;
            lightbox.classList.add('active');
            lightboxVideo.muted = false;
            lightboxVideo.play().catch(e => console.log("Video play error:", e));
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Function to show previous video
    function showPreviousVideo() {
        const prevIndex = (currentVideoIndex - 1 + videoItems.length) % videoItems.length;
        showVideoInLightbox(prevIndex);
    }
    
    // Function to show next video
    function showNextVideo() {
        const nextIndex = (currentVideoIndex + 1) % videoItems.length;
        showVideoInLightbox(nextIndex);
    }
    
    // Handle video clicks for lightbox
    videos.forEach((video, index) => {
        video.addEventListener('click', function(e) {
            e.preventDefault();
            showVideoInLightbox(index);
        });
    });
    
    // Navigation controls
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviousVideo();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextVideo();
        });
    }
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            lightboxVideo.pause();
            lightboxVideo.muted = true;
        });
    }
    
    // Close on outside click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                lightboxVideo.pause();
                lightboxVideo.muted = true;
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                lightboxVideo.pause();
                lightboxVideo.muted = true;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPreviousVideo();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextVideo();
                break;
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next video
            showNextVideo();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous video
            showPreviousVideo();
        }
    }
});

// Product Portfolio Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Product Grid View Toggle
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    const hiddenProducts = document.querySelectorAll('.hidden-product');
    let isExpanded = false;
    
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', function() {
            if (!isExpanded) {
                // Show all products
                hiddenProducts.forEach(product => {
                    product.style.display = 'block';
                    product.classList.add('fade-in-visible');
                });
                viewToggleBtn.textContent = 'View Less';
                isExpanded = true;
            } else {
                // Hide extra products
                hiddenProducts.forEach(product => {
                    product.style.display = 'none';
                    product.classList.remove('fade-in-visible');
                });
                viewToggleBtn.textContent = 'View All';
                isExpanded = false;
                
                // Scroll back to portfolio section
                document.getElementById('portfolio').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Product Lightbox Functionality
    const productItems = document.querySelectorAll('.product-item img');
    const productLightbox = document.querySelector('.product-lightbox');
    const productLightboxImage = document.querySelector('.product-lightbox-image');
    const productLightboxClose = document.querySelector('.product-lightbox-close');
    const productLightboxPrev = document.querySelector('.product-lightbox-prev');
    const productLightboxNext = document.querySelector('.product-lightbox-next');
    
    let currentProductIndex = 0;
    let allProductImages = [];
    
    // Create array of all product images (visible and hidden)
    function updateProductImages() {
        allProductImages = Array.from(document.querySelectorAll('.product-item img'));
    }
    
    // Initialize product images array
    updateProductImages();
    
    // Function to show product in lightbox
    function showProductInLightbox(index) {
        if (index >= 0 && index < allProductImages.length) {
            currentProductIndex = index;
            productLightboxImage.src = allProductImages[index].src;
            productLightboxImage.alt = allProductImages[index].alt;
            productLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Function to show previous product
    function showPreviousProduct() {
        const prevIndex = (currentProductIndex - 1 + allProductImages.length) % allProductImages.length;
        showProductInLightbox(prevIndex);
    }
    
    // Function to show next product
    function showNextProduct() {
        const nextIndex = (currentProductIndex + 1) % allProductImages.length;
        showProductInLightbox(nextIndex);
    }
    
    // Add click event to all product images
    function addProductClickEvents() {
        const currentProductItems = document.querySelectorAll('.product-item img');
        currentProductItems.forEach((img, index) => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                updateProductImages(); // Update array to include newly visible items
                const globalIndex = allProductImages.indexOf(this);
                showProductInLightbox(globalIndex);
            });
        });
    }
    
    // Initialize product click events
    addProductClickEvents();
    
    // Re-add events when view toggle is used
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', function() {
            setTimeout(() => {
                updateProductImages();
                addProductClickEvents();
            }, 100);
        });
    }
    
    // Navigation controls
    if (productLightboxPrev) {
        productLightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviousProduct();
        });
    }
    
    if (productLightboxNext) {
        productLightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextProduct();
        });
    }
    
    // Close lightbox
    if (productLightboxClose) {
        productLightboxClose.addEventListener('click', () => {
            productLightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close on outside click
    if (productLightbox) {
        productLightbox.addEventListener('click', (e) => {
            if (e.target === productLightbox) {
                productLightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Keyboard navigation for product lightbox
    document.addEventListener('keydown', (e) => {
        if (!productLightbox || !productLightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                productLightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPreviousProduct();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextProduct();
                break;
        }
    });
    
    // Touch swipe support for product lightbox
    let productTouchStartX = 0;
    let productTouchEndX = 0;
    
    if (productLightbox) {
        productLightbox.addEventListener('touchstart', (e) => {
            productTouchStartX = e.changedTouches[0].screenX;
        }, false);
        
        productLightbox.addEventListener('touchend', (e) => {
            productTouchEndX = e.changedTouches[0].screenX;
            handleProductSwipe();
        }, false);
    }
    
    function handleProductSwipe() {
        const swipeThreshold = 50;
        if (productTouchEndX < productTouchStartX - swipeThreshold) {
            // Swipe left - next product
            showNextProduct();
        }
        if (productTouchEndX > productTouchStartX + swipeThreshold) {
            // Swipe right - previous product
            showPreviousProduct();
        }
    }
});
