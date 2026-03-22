document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Highlight current page
    const currentLocation = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll('.nav-links a');
    menuItems.forEach(item => {
        const link = item.getAttribute('href');
        if (link === currentLocation || (currentLocation === '' && link === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Change icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Smooth Scroll for anchor links (fallback if CSS scroll-behavior fails)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Validation
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Submit via AJAX to Formspree
        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Message sent successfully! We will get back to you shortly.');
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                });
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form");
        });
    };

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        heroForm.addEventListener('submit', handleFormSubmit);
    }

    // Stats Counter Animation
    const statsContainer = document.querySelector('.stats-container');

    const countUp = (el) => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const duration = 2000; // 2 seconds
        let current = 0;
        const increment = target / (duration / 16); // Approx 16ms per frame

        const updateCount = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = target + suffix;
            }
        };
        requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(el => {
                    countUp(el);
                });
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.5 });

    if (statsContainer) {
        observer.observe(statsContainer);
    }

    // Blog Page Functionality
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        const searchInput = document.getElementById('blogSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');

        // Search functionality
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Manage active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                
                blogCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const currentlyActive = document.querySelector('.accordion-item.active');
                if (currentlyActive && currentlyActive !== item) {
                    currentlyActive.classList.remove('active');
                }
                item.classList.toggle('active');
            });
        });
    }

    // Mobile Dropdown Accordion Logic
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        
        if (dropbtn) {
            dropbtn.addEventListener('click', (e) => {
                // Only apply toggle logic on mobile screens
                if (window.innerWidth <= 768) {
                    // Prevent default only if it's a link to the current page or a placeholder
                    const href = dropbtn.getAttribute('href');
                    if (href === '#' || href === window.location.pathname.split("/").pop()) {
                         e.preventDefault();
                    } else {
                         // If it's a different page, allow navigation (or prevent if you want accordion style only)
                         e.preventDefault(); // Keeping this to ensure submenu opens first on mobile
                    }
                    
                    // Close other open dropdowns (Accordion behavior)
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Inject Floating Contact Buttons (WhatsApp & Call)
    const floatingButtons = document.createElement('div');
    floatingButtons.classList.add('floating-buttons');
    floatingButtons.innerHTML = `
        <a href="https://wa.me/919773557601" target="_blank" class="float-btn whatsapp-btn" aria-label="Chat on WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
        <a href="tel:+919773557601" class="float-btn call-btn" aria-label="Call Us">
            <i class="fas fa-phone-alt"></i>
        </a>
    `;
    document.body.appendChild(floatingButtons);
});