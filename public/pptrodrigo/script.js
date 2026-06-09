document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const presentation = document.querySelector('.presentation');
    const progressBar = document.querySelector('.progress-bar');
    const counters = document.querySelectorAll('.counter');
    const progressRings = document.querySelectorAll('.progress-ring__circle.fg');

    // Number formatting function
    const formatNumber = (num, isCurrency) => {
        if (num >= 1000000) {
            return (num / 1000000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'M';
        } else if (num >= 1000 && isCurrency) {
            return (num / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'K';
        }
        return num.toLocaleString('pt-BR');
    };

    // Animation for counters
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const isCurrency = counter.parentElement.textContent.includes('R$');
        const duration = 2000; // ms
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));
        
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = formatNumber(target, isCurrency);
                clearInterval(timer);
            } else {
                counter.innerText = formatNumber(Math.ceil(current), isCurrency);
            }
        }, stepTime);
    };

    // Animation for SVG Progress Ring
    const animateProgressRing = (ring) => {
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const percent = ring.getAttribute('data-percentage');
        
        const offset = circumference - (percent / 100) * circumference;
        
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 500);
    };

    // Intersection Observer for slides
    const observerOptions = {
        root: presentation,
        threshold: 0.5
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Update Progress Bar
                const slideIndex = Array.from(slides).indexOf(entry.target);
                const progress = ((slideIndex) / (slides.length - 1)) * 100;
                progressBar.style.width = `${progress}%`;

                // Trigger animations inside slide
                const slideCounters = entry.target.querySelectorAll('.counter');
                slideCounters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        animateCounter(counter);
                        counter.classList.add('animated');
                    }
                });

                const rings = entry.target.querySelectorAll('.progress-ring__circle.fg');
                rings.forEach(ring => {
                    if (!ring.classList.contains('animated')) {
                        animateProgressRing(ring);
                        ring.classList.add('animated');
                    }
                });
            }
        });
    }, observerOptions);

    slides.forEach(slide => {
        slideObserver.observe(slide);
    });

    // Initialize stroke dasharray for rings
    progressRings.forEach(ring => {
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;
    });
});
