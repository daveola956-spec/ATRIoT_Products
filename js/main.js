import { animate, scroll, cubicBezier } from 'https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm';

// Intersection Observer for generic reveal elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const nav = document.querySelector('.floating-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (nav && navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Ecosystem image lightbox
    const lightbox = document.querySelector('#image-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const ecosystemImages = document.querySelectorAll('#ecosystem-reveal .grid img');

    const openLightbox = (src, alt) => {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxImage.alt = alt || 'Expanded image preview';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        document.body.classList.remove('lightbox-open');
    };

    ecosystemImages.forEach(image => {
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `${image.alt || 'Image'} - open full size`);

        image.addEventListener('click', () => openLightbox(image.src, image.alt));
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(image.src, image.alt);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });

    // Basic reveals
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // Navbar state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.9)';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            nav.style.background = 'var(--card-bg)';
            nav.style.boxShadow = 'none';
        }
    });

    // --- Motion Scroll Reveal Logic ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const image = document.querySelector('.scaler img');
        const scrollSection = document.querySelector('#ecosystem-reveal');
        const layers = document.querySelectorAll('.grid > .layer');

        if (image && scrollSection) {
            // Measure natural size
            const naturalWidth = image.offsetWidth;
            const naturalHeight = image.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Shrink center image from full screen to grid size
            scroll(
                animate(image, {
                    width: [viewportWidth, naturalWidth],
                    height: [viewportHeight, naturalHeight]
                }, {
                    width: { easing: cubicBezier(0.65, 0, 0.35, 1) },
                    height: { easing: cubicBezier(0.42, 0, 0.58, 1) }
                }),
                {
                    target: scrollSection,
                    offset: ['start start', '80% end']
                }
            );

            // Animate each layer staggered
            const scaleEasings = [
                cubicBezier(0.42, 0, 0.58, 1),
                cubicBezier(0.76, 0, 0.24, 1),
                cubicBezier(0.87, 0, 0.13, 1)
            ];

            layers.forEach((layer, index) => {
                const endOffset = `${1 - (index * 0.05)} end`;

                // Fade in
                scroll(
                    animate(layer, {
                        opacity: [0, 0, 1]
                    }, {
                        offset: [0, 0.55, 1],
                        easing: cubicBezier(0.61, 1, 0.88, 1)
                    }),
                    {
                        target: scrollSection,
                        offset: ['start start', endOffset]
                    }
                );

                // Scale in
                scroll(
                    animate(layer, {
                        scale: [0, 0, 1]
                    }, {
                        offset: [0, 0.3, 1],
                        easing: scaleEasings[index]
                    }),
                    {
                        target: scrollSection,
                        offset: ['start start', endOffset]
                    }
                );
            });
        }
    }
});
