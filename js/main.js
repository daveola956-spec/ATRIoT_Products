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

    // Hero gallery generation (unique images only)
    const heroGalleryTrack = document.querySelector('#hero-gallery-track');
    const heroGalleryDots = document.querySelector('#hero-gallery-dots');
    const heroImageSources = [
        'assets/images/ac-controller.png',
        'assets/images/app-energy.png',
        'assets/images/app-thermostat.png',
        'assets/images/atriot-scene-01.png',
        'assets/images/atriot-scene-02.png',
        'assets/images/atriot-scene-03.png',
        'assets/images/atriot-scene-04.png',
        'assets/images/atriot-scene-05.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 04_47_34 PM.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 06_09_00 PM.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 06_09_08 PM.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 06_37_25 PM.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 11_22_02 PM.png',
        'assets/images/ChatGPT Image Apr 24, 2026, 11_27_34 PM.png',
        'assets/images/energy-hub.png',
        'assets/images/fan-controller.png',
        'assets/images/future-homes-banner.png',
        'assets/images/Gemini_Generated_Image_2stxyd2stxyd2stx.png',
        'assets/images/Gemini_Generated_Image_9sc4t69sc4t69sc4.png',
        'assets/images/Gemini_Generated_Image_jzh4fwjzh4fwjzh4.png',
        'assets/images/Gemini_Generated_Image_rio3d7rio3d7rio3.png'
    ];

    const uniqueHeroImages = heroImageSources.filter((source, index, list) => {
        return list.indexOf(source) === index;
    });

    if (heroGalleryTrack && heroGalleryDots) {
        uniqueHeroImages.forEach((source, index) => {
            const card = document.createElement('article');
            card.className = 'hero-gallery-item';

            const image = document.createElement('img');
            image.src = source;
            image.alt = `ATRIoT gallery image ${index + 1}`;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.classList.add('js-open-image');
            image.dataset.galleryIndex = String(index);

            card.appendChild(image);
            heroGalleryTrack.appendChild(card);

            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-gallery-dot';
            dot.setAttribute('aria-label', `View gallery image ${index + 1}`);
            dot.dataset.galleryIndex = String(index);
            heroGalleryDots.appendChild(dot);
        });

        const galleryItems = Array.from(heroGalleryTrack.querySelectorAll('.hero-gallery-item'));
        const galleryDots = Array.from(heroGalleryDots.querySelectorAll('.hero-gallery-dot'));

        const setActiveDot = (activeIndex) => {
            galleryDots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };

        const getClosestIndex = () => {
            const trackCenter = heroGalleryTrack.scrollTop + (heroGalleryTrack.clientHeight / 2);
            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            galleryItems.forEach((item, itemIndex) => {
                const itemCenter = item.offsetTop + (item.clientHeight / 2);
                const distance = Math.abs(itemCenter - trackCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = itemIndex;
                }
            });

            return closestIndex;
        };

        setActiveDot(0);

        let ticking = false;
        heroGalleryTrack.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                setActiveDot(getClosestIndex());
                ticking = false;
            });
        });

        galleryDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number(dot.dataset.galleryIndex || '0');
                const target = galleryItems[index];
                if (!target) return;
                const targetTop = target.offsetTop - ((heroGalleryTrack.clientHeight - target.clientHeight) / 2);
                heroGalleryTrack.scrollTo({ top: targetTop, behavior: 'smooth' });
                setActiveDot(index);
            });
        });
    }

    // Shared image lightbox (hero gallery + ecosystem images)
    const lightbox = document.querySelector('#image-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const interactiveImages = document.querySelectorAll('#ecosystem-reveal .grid img, .js-open-image, #energy .mobile-mockup img');

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

    interactiveImages.forEach(image => {
        image.classList.add('js-open-image');
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
    const compactMotionView = window.matchMedia('(max-width: 800px)').matches;

    if (!prefersReducedMotion && !compactMotionView) {
        const image = document.querySelector('.scaler img');
        const scrollSection = document.querySelector('#ecosystem-reveal');
        const layers = document.querySelectorAll('.grid > .layer');

        if (image && scrollSection) {
            // Measure current size and compute a scale start point to avoid aspect-ratio distortion.
            const rect = image.getBoundingClientRect();
            const naturalWidth = rect.width || image.offsetWidth;
            const naturalHeight = rect.height || image.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const startScale = Math.max(
                viewportWidth / Math.max(naturalWidth, 1),
                viewportHeight / Math.max(naturalHeight, 1)
            );

            // Shrink center image from oversized scale to native size.
            scroll(
                animate(image, {
                    scale: [startScale, 1]
                }, {
                    easing: cubicBezier(0.65, 0, 0.35, 1)
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
    } else {
        // Keep ecosystem content fully visible without heavy scroll choreography on compact/reduced-motion views.
        const layers = document.querySelectorAll('.grid > .layer');
        layers.forEach(layer => {
            layer.style.opacity = '1';
            layer.style.transform = 'none';
        });
    }
});
