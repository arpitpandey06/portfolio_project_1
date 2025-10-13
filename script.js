// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the page
    initializePage();

    // Set up navigation
    setupNavigation();

    // Set up dark mode
    setupDarkMode();

    // Set up form handling
    setupContactForm();

    // Set up mobile sidebar toggle
    setupMobileToggle();

    // Set up smooth scrolling
    setupSmoothScrolling();

    // Set up intersection observer for animations
    setupAnimations();

    // Set up resume animations
    setupResumeAnimations();
});

// Initialize page state
function initializePage() {
    // Check for hash in URL and activate corresponding section
    const hash = window.location.hash;
    if (hash) {
        activateSection(hash.substring(1));
    } else {
        // Activate home section by default
        activateSection('home');
    }

    // Set initial dark mode state from localStorage
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
        updateDarkMode(isDarkMode);
    }
}

// Set up navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            activateSection(targetId);

            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);

            // Close mobile sidebar if open
            const sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebarToggle && sidebarToggle.checked) {
                sidebarToggle.checked = false;
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.substring(1);
        if (hash) {
            activateSection(hash);
        }
    });
}

// Activate a specific section
function activateSection(sectionId) {
    // Deactivate all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Activate target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Activate corresponding nav link
        const targetNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
    }
}

// Set up dark mode functionality
function setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function () {
            const isDarkMode = this.checked;
            updateDarkMode(isDarkMode);
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
}

// Update dark mode state
function updateDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDarkMode ? '#161a2e' : '#ffffff');
    }
}

// Set up contact form handling with Web3Forms
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm?.querySelector('.submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                submitBtn.classList.add('loading');
            }

            // Show loading message
            showFormMessage('Sending message...', 'info');

            // Prepare form data for Web3Forms
            const formData = new FormData(contactForm);

            try {
                // Send to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
                    console.error('Web3Forms Error:', result);
                }
            } catch (error) {
                showFormMessage('Network error. Please check your connection and try again.', 'error');
                console.error('Submission Error:', error);
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message 📬';
                    submitBtn.classList.remove('loading');
                }
            }
        });
    }

    // Show form message
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';

            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
}

// Set up mobile sidebar toggle
function setupMobileToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (sidebarToggle && mobileToggleBtn) {
        // Close sidebar when clicking on overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                sidebarToggle.checked = false;
            });
        }

        // Close sidebar when pressing Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && sidebarToggle.checked) {
                sidebarToggle.checked = false;
            }
        });
    }
}

// Set up smooth scrolling for anchor links
function setupSmoothScrolling() {
    // This is handled by the navigation setup, but we can add additional smooth scrolling if needed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal anchor links
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // If we're already on the page with the target section, just activate it
                    if (targetElement.classList.contains('page-section')) {
                        activateSection(targetId);
                    } else {
                        // Otherwise, scroll to the element
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    });
}

// Set up animations for elements when they come into view
function setupAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.project-card, .certificate-card, .skill-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Set up resume-specific animations
function setupResumeAnimations() {
    const resumeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const resumeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-30px)';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, 100);
                }

                if (entry.target.classList.contains('skill-category')) {
                    entry.target.style.animation = 'slideInRight 0.6s ease forwards';
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(30px)';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, 100);
                }

                if (entry.target.classList.contains('project-highlight')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            }
        });
    }, resumeObserverOptions);

    // Observe resume elements
    const resumeElements = document.querySelectorAll('.timeline-item, .skill-category, .project-highlight, .achievement-item');
    resumeElements.forEach(el => {
        resumeObserver.observe(el);
    });
}

// Add some utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Handle window resize with debounce
window.addEventListener('resize', debounce(function () {
    // Adjust layout if needed on resize
}, 250));

// Add loading state for images
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');

        // Remove loading class when image is loaded
        if (img.complete) {
            img.classList.remove('loading');
        } else {
            img.addEventListener('load', function () {
                this.classList.remove('loading');
            });

            img.addEventListener('error', function () {
                // Handle broken images
                this.classList.remove('loading');
                this.classList.add('image-error');
            });
        }
    });
});