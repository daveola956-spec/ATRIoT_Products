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

    if (heroGalleryTrack) {
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
        });

        // --- Auto-scroll logic ---
        const galleryItems = Array.from(heroGalleryTrack.querySelectorAll('.hero-gallery-item'));
        let currentIndex = 0;
        let autoScrollTimer = null;
        let resumeTimer = null;
        let isUserScrolling = false;

        const scrollToIndex = (index) => {
            const target = galleryItems[index];
            if (!target) return;
            // Smooth scroll the item into the start of the track
            heroGalleryTrack.scrollTo({
                left: target.offsetLeft,
                behavior: 'smooth'
            });
        };

        const startAutoScroll = () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
            autoScrollTimer = setInterval(() => {
                if (isUserScrolling) return;
                currentIndex = (currentIndex + 1) % galleryItems.length;
                scrollToIndex(currentIndex);
            }, 3500); // Advance every 3.5 seconds
        };

        const pauseAndResume = () => {
            isUserScrolling = true;
            if (resumeTimer) clearTimeout(resumeTimer);
            // Resume auto-scroll 6 seconds after the user stops interacting
            resumeTimer = setTimeout(() => {
                isUserScrolling = false;
                // Sync currentIndex to wherever the user scrolled to
                const trackCenter = heroGalleryTrack.scrollLeft + heroGalleryTrack.clientWidth / 2;
                let closest = 0;
                let minDist = Infinity;
                galleryItems.forEach((item, i) => {
                    const dist = Math.abs(item.offsetLeft + item.clientWidth / 2 - trackCenter);
                    if (dist < minDist) { minDist = dist; closest = i; }
                });
                currentIndex = closest;
            }, 6000);
        };

        // Pause on any user interaction with the track
        heroGalleryTrack.addEventListener('scroll', pauseAndResume, { passive: true });
        heroGalleryTrack.addEventListener('touchstart', pauseAndResume, { passive: true });
        heroGalleryTrack.addEventListener('mousedown', pauseAndResume);

        // Start auto-scroll after a short delay to let images load
        setTimeout(startAutoScroll, 1500);
    }

    // --- ATRIoT + Unlimited Internet Gallery ---
    const internetGalleryTrack = document.querySelector('#internet-gallery-track');
    const internetImageSources = [
        'assets/images/1.png',
        'assets/images/2.png',
        'assets/images/3.png',
        'assets/images/4.png'
    ];

    if (internetGalleryTrack) {
        internetImageSources.forEach((source, index) => {
            const card = document.createElement('article');
            card.className = 'hero-gallery-item';

            const img = document.createElement('img');
            img.src = source;
            img.alt = `ATRIoT Internet product image ${index + 1}`;
            img.decoding = 'sync';
            img.classList.add('js-open-image');
            img.dataset.galleryIndex = String(index);

            card.appendChild(img);
            internetGalleryTrack.appendChild(card);
        });

        // Auto-scroll — identical behaviour to the hero gallery
        const inetItems = Array.from(internetGalleryTrack.querySelectorAll('.hero-gallery-item'));
        let inetIndex = 0;
        let inetTimer = null;
        let inetResumeTimer = null;
        let inetUserScrolling = false;

        const inetScrollTo = (index) => {
            const target = inetItems[index];
            if (!target) return;
            internetGalleryTrack.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
        };

        const startInetAutoScroll = () => {
            if (inetTimer) clearInterval(inetTimer);
            inetTimer = setInterval(() => {
                if (inetUserScrolling) return;
                inetIndex = (inetIndex + 1) % inetItems.length;
                inetScrollTo(inetIndex);
            }, 3500);
        };

        const inetPauseResume = () => {
            inetUserScrolling = true;
            if (inetResumeTimer) clearTimeout(inetResumeTimer);
            inetResumeTimer = setTimeout(() => {
                inetUserScrolling = false;
                const center = internetGalleryTrack.scrollLeft + internetGalleryTrack.clientWidth / 2;
                let closest = 0, minDist = Infinity;
                inetItems.forEach((item, i) => {
                    const dist = Math.abs(item.offsetLeft + item.clientWidth / 2 - center);
                    if (dist < minDist) { minDist = dist; closest = i; }
                });
                inetIndex = closest;
            }, 6000);
        };

        internetGalleryTrack.addEventListener('scroll', inetPauseResume, { passive: true });
        internetGalleryTrack.addEventListener('touchstart', inetPauseResume, { passive: true });
        internetGalleryTrack.addEventListener('mousedown', inetPauseResume);

        setTimeout(startInetAutoScroll, 2000); // Slightly offset from hero to avoid simultaneous ticks
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

    if (!prefersReducedMotion) {
        const scaler = document.querySelector('.scaler');
        const image = document.querySelector('.scaler img');
        const scrollSection = document.querySelector('#ecosystem-reveal');
        const layers = document.querySelectorAll('.grid > .layer');

        if (scaler && scrollSection) {
            // Function to initialize scroll animations
            const initScrollAnimations = () => {
                const containerRect = document.querySelector('.grid').getBoundingClientRect();
                
                // On mobile we use 3 cols, desktop 5 cols. Target width matches 1 column.
                const cols = window.innerWidth <= 800 ? 3 : 5;
                const targetWidth = containerRect.width / cols; 
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Calculate startScale to overcover the viewport
                const startScale = Math.max(viewportWidth / (targetWidth || 1), viewportHeight / (targetWidth * 1.25 || 1)) * 1.5;

                const isMobile = window.innerWidth <= 800;

                // Animate the .scaler WRAPPER — not the img — so Motion never
                // overwrites the img's translate(-50%,-50%) centering transform.
                scroll(
                    animate(scaler, {
                        scale: [startScale, 1]
                    }, {
                        easing: cubicBezier(0.65, 0, 0.35, 1)
                    }),
                    {
                        target: scrollSection,
                        offset: ['start start', isMobile ? '65% end' : '80% end']
                    }
                );

                // Animate border-radius separately on the image (safe — no translate conflict)
                scroll(
                    animate(image, {
                        borderRadius: ['0rem', '1.5rem']
                    }, {
                        easing: cubicBezier(0.65, 0, 0.35, 1)
                    }),
                    {
                        target: scrollSection,
                        offset: ['start start', isMobile ? '65% end' : '80% end']
                    }
                );

                // Animate each layer staggered
                const scaleEasings = [
                    cubicBezier(0.42, 0, 0.58, 1),
                    cubicBezier(0.76, 0, 0.24, 1),
                    cubicBezier(0.87, 0, 0.13, 1)
                ];

                layers.forEach((layer, index) => {
                    // Skip animating if the layer is hidden via CSS (e.g., layer 1 on mobile)
                    if (window.getComputedStyle(layer).display === 'none') return;

                    // On mobile, spread the layer reveals across a larger portion of the section
                    // so they don't all complete and vanish before the user finishes scrolling
                    const staggerBase = isMobile ? 0.9 : 0.95;
                    const endOffset = `${staggerBase - (index * 0.04)} end`;

                    // Fade in
                    scroll(
                        animate(layer, {
                            opacity: [0, 0, 1]
                        }, {
                            offset: [0, 0.4, 1],
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
                            scale: [0.4, 1]
                        }, {
                            offset: [0.25, 1],
                            easing: scaleEasings[index]
                        }),
                        {
                            target: scrollSection,
                            offset: ['start start', endOffset]
                        }
                    );
                });
            };

            // Use requestAnimationFrame to ensure layout is ready
            requestAnimationFrame(() => {
                if (image && image.complete && image.naturalWidth > 0) {
                    initScrollAnimations();
                } else if (image) {
                    image.addEventListener('load', initScrollAnimations, { once: true });
                    setTimeout(initScrollAnimations, 500);
                } else {
                    initScrollAnimations();
                }
            });
        }
    }
});
