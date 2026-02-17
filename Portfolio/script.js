// ============================================
// PORTFOLIO - INTERACTIVE FUNCTIONALITY
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // PAGE LOADER
    // ============================================

    const pageLoader = document.getElementById('pageLoader');
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 500); // Small delay for smooth transition
    });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================

    const backToTopBtn = document.getElementById('backToTop');

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // NAVIGATION
    // ============================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ============================================

    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or doesn't start with "#"
            if (href === '#' || !href.startsWith('#')) return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // ============================================
    // SKILL BARS ANIMATION
    // ============================================

    function animateSkillBars(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-progress');

        skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');

            setTimeout(() => {
                bar.style.width = progress + '%';
            }, index * 100); // Stagger animation
        });
    }

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.textContent = '';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.style.color = '#22c55e';
                    formStatus.textContent = '✓ Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.style.color = '#ef4444';
                formStatus.textContent = '✗ Oops! There was a problem sending your message. Please try again.';
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }

    // ============================================
    // CERTIFICATE MODAL
    // ============================================

    const certModal = document.getElementById('certModal');
    const certModalOverlay = document.getElementById('certModalOverlay');
    const certModalClose = document.getElementById('certModalClose');
    const certViewer = document.getElementById('certViewer');
    const viewCertBtns = document.querySelectorAll('.view-cert-btn');

    if (certModal) {
        viewCertBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const certPath = this.getAttribute('data-cert');
                if (certPath) {
                    certViewer.src = certPath;
                    certModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        function closeModal() {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
            // Clear src after transition to stop display
            setTimeout(() => {
                if (certViewer) certViewer.src = '';
            }, 300);
        }

        if (certModalClose) certModalClose.addEventListener('click', closeModal);
        if (certModalOverlay) certModalOverlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) closeModal();
        });
    }

    // ============================================
    // TYPING EFFECT FOR HERO SUBTITLE (Optional)
    // ============================================

    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Uncomment to enable typing effect
    // const heroSubtitle = document.querySelector('.hero-subtitle .text-gradient');
    // if (heroSubtitle) {
    //     const originalText = heroSubtitle.textContent;
    //     setTimeout(() => {
    //         typeWriter(heroSubtitle, originalText, 80);
    //     }, 1000);
    // }

    // ============================================
    // CURSOR EFFECT (Optional Premium Feature)
    // ============================================

    // Uncomment to enable custom cursor effect
    /*
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #6366f1;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease-out;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
    */

    // ============================================
    // PERFORMANCE: Lazy Loading Images
    // ============================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // CONSOLE MESSAGE
    // ============================================

    console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cLooking for something? Feel free to reach out!', 'font-size: 14px; color: #94a3b8;');

});
