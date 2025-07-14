// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 1,
    class: 'is-reveal'
});

// Update scroll on window resize
window.addEventListener('resize', () => {
    scroll.update();
});

// GSAP ScrollTrigger integration with Locomotive Scroll
gsap.registerPlugin(ScrollTrigger);

scroll.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            scroll.scrollTo(target);
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// Navbar background on scroll
scroll.on('scroll', (instance) => {
    const navbar = document.getElementById('navbar');
    if (instance.scroll.y > 100) {
        navbar.classList.add('bg-maze-dark/95');
        navbar.classList.remove('bg-maze-dark/80');
    } else {
        navbar.classList.add('bg-maze-dark/80');
        navbar.classList.remove('bg-maze-dark/95');
    }
});

// Countdown Timer
function updateCountdown() {
    const countDownDate = new Date("Aug 1, 2025 23:59:59").getTime();
    const now = new Date().getTime();
    const timeRemaining = countDownDate - now;

    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById("countdown-timer").innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        document.getElementById("countdown-timer").innerHTML = "Album Released!";
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// GSAP Animations
gsap.timeline()
    .from('.thought-bubble', {
        scale: 0,
        opacity: 0,
        duration: 2,
        stagger: 0.5,
        ease: "back.out(1.7)"
    });

// Parallax effect for hero image
gsap.to('[data-scroll-speed="-1"]', {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: '#home',
        start: "top bottom",
        end: "bottom top",
        scroller: '[data-scroll-container]',
        scrub: true
    }
});

// Text reveal animations
gsap.utils.toArray('.journey-step').forEach((step, index) => {
    gsap.from(step, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: step,
            start: "top 80%",
            scroller: '[data-scroll-container]',
            toggleActions: "play none none reverse"
        }
    });
});

// Floating elements animation
gsap.to('.thought-bubble', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
    stagger: 0.5
});

// Merch cards hover effect
document.querySelectorAll('.merch-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Platform icons animation
gsap.from('.platform-icon', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: '#music',
        start: "top 80%",
        scroller: '[data-scroll-container]'
    }
});

// Neural network background animation
gsap.to('.bg-neural-pattern', {
    backgroundPosition: '60px 60px',
    duration: 20,
    repeat: -1,
    ease: "none"
});

// Glitch effect for main title
function glitchEffect() {
    const title = document.querySelector('h1');
    if (title) {
        gsap.to(title, {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(title, { x: 0, y: 0 });
            }
        });
    }
}

// Trigger glitch effect randomly
setInterval(() => {
    if (Math.random() > 0.95) {
        glitchEffect();
    }
}, 1000);

// Form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Sending...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Request Sent!';
        button.classList.add('bg-maze-green-200');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('bg-maze-green-200');
            this.reset();
        }, 2000);
    }, 1000);
});

// Refresh ScrollTrigger after all animations
ScrollTrigger.refresh();