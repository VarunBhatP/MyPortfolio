// Smooth scrolling for navigation links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80; // Height of your fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling with emailjs
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(() => {
                showCustomModal('Message sent successfully!');
                contactForm.reset();
            }, (error) => {
                showCustomModal('Something went wrong. Please try again.');
                console.error('EmailJS Error:', error);
            });
    });
}


function showCustomModal(message) {
    let modal = document.getElementById('custom-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.innerHTML = '<div class="modal-content"></div>';
        document.body.appendChild(modal);
    }
    modal.querySelector('.modal-content').textContent = message;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = 1;
        setTimeout(() => {
            modal.style.opacity = 0;
            setTimeout(() => { modal.style.display = 'none'; }, 500);
        }, 2500);
    }, 10);
}

// Remove dark/light mode toggle and force dark mode with a blue-based palette
function setTheme() {
    document.documentElement.style.setProperty('--primary-color', '#2563eb'); // blue-600
    document.documentElement.style.setProperty('--secondary-color', '#7c3aed'); // violet-600
    document.documentElement.style.setProperty('--text-color', '#e0e7ef'); // light blue-gray
    document.documentElement.style.setProperty('--light-bg', '#232946'); // deep blue
    document.documentElement.style.setProperty('--dark-bg', '#181c2f'); // navy
    document.documentElement.style.setProperty('--card-bg', '#212b42'); // blue-gray
    document.documentElement.style.setProperty('--accent', '#38bdf8'); // sky-400
    document.documentElement.style.setProperty('--accent2', '#06b6d4'); // cyan-500
    document.documentElement.style.setProperty('--accent3', '#a78bfa'); // purple-400
    document.body.classList.add('dark');
}
setTheme();

// Remove theme toggle button if present
const oldToggle = document.querySelector('.theme-toggle');
if (oldToggle) oldToggle.remove();

// Fix nav bar background on scroll for both themes
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        if (document.body.classList.contains('dark')) {
            nav.style.background = 'rgba(35, 39, 47, 0.95)';
        } else {
            nav.style.background = 'rgba(255,255,255,0.95)';
        }
    } else {
        if (document.body.classList.contains('dark')) {
            nav.style.background = 'rgba(35, 39, 47, 0.85)';
        } else {
            nav.style.background = 'rgba(255,255,255,0.85)';
        }
    }
});

// Animated background particles for hero section
const hero = document.querySelector('.hero');
const canvas = document.createElement('canvas');
canvas.className = 'hero-particles';
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = 0;
canvas.style.pointerEvents = 'none';
hero.appendChild(canvas);

function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = Array.from({length: 40}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    color: 'rgba(96,165,250,0.5)'
}));

function drawParticles() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

// Enhanced Intersection Observer for scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animated-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        // Don't observe elements that are already animated
        if (!element.classList.contains('animate')) {
            observer.observe(element);
        }
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation to the hero section immediately
    const heroSection = document.querySelector('.hero.animated-section');
    if (heroSection) {
        heroSection.classList.add('animate');
    }
    
    // Initialize scroll animations for other sections
    animateOnScroll();
    
    // Re-run animations on window resize to handle any layout changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.animated-section:not(.hero)').forEach(section => {
                section.classList.remove('animate');
            });
            requestAnimationFrame(() => {
                animateOnScroll();
            });
        }, 250);
    });
    
    // Add hover effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});
