document.addEventListener('DOMContentLoaded', function () {
    new Swiper('.blog_swiper', {
        slidesPerView: 4,
        spaceBetween: 13,
        loop: true,
        navigation: {
            nextEl: '.blog_btn_next',
            prevEl: '.blog_btn_prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            361: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            769: {
                slidesPerView: 4,
                spaceBetween: 13,
            },
        },
    });

    new Swiper('.reviews_swiper', {
        slidesPerView: 'auto',
        spaceBetween: 60,
        loop: true,
        speed: 500,
        navigation: {
            nextEl: '.reviews_btn_next',
            prevEl: '.reviews_btn_prev',
        },
    });
});


const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => sectionObserver.observe(el));

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const menu = document.querySelector('.menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            menu.classList.toggle('open');
        });
    }


    document.querySelectorAll('.menu .nav_link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            menu.classList.remove('open');
        });
    });


    document.addEventListener('click', (e) => {
        if (menu && burger && !menu.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('open');
            menu.classList.remove('open');
        }
    });
});

(function initSmoothHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const spacer = document.createElement('div');
    spacer.className = 'header_spacer';
    header.insertAdjacentElement('afterend', spacer);

    function syncSpacerHeight() {
        spacer.style.height = header.offsetHeight + 'px';
    }

    let ticking = false;

    function update() {
        const scrollY = window.pageYOffset;
        header.classList.toggle('header--scrolled', scrollY > 10);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', syncSpacerHeight);
    window.addEventListener('load', syncSpacerHeight);
    syncSpacerHeight();
    update();
})();


document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (event) => {
        const raw = link.dataset.scroll || '';
        const id = raw.startsWith('#') ? raw.slice(1) : raw;
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


(function initRevealCards() {
    const groups = [
        document.querySelectorAll('.about_variant'),
        document.querySelectorAll('.services_block1, .services_block2'),
    ];

    groups.forEach(nodeList => {
        nodeList.forEach((el, index) => {
            el.classList.add('reveal-up');
            el.style.setProperty('--reveal-delay', (index * 0.12) + 's');
        });
    });

    const cards = document.querySelectorAll('.reveal-up');
    if (!cards.length) return;

    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(el => cardObserver.observe(el));
})();


(function initCounters() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const candidates = [
        ...document.querySelectorAll('.home_num'),
        ...document.querySelectorAll('.numbers'),
        ...document.querySelectorAll('.services_block1 h2, .services_block2 h2'),
    ];
    if (!candidates.length) return;

    const counterData = new WeakMap();

    function parseCounter(el) {
      
        const textNode = Array.from(el.childNodes).find(node =>
            node.nodeType === Node.TEXT_NODE && /\d/.test(node.nodeValue)
        );
        if (!textNode) return null;

        const match = textNode.nodeValue.trim().match(/^(\D*)(\d+)(\D*)$/);
        if (!match) return null;

        return { textNode, prefix: match[1], target: parseInt(match[2], 10), suffix: match[3] };
    }

    function animateCounter(data, duration) {
        const { textNode, prefix, target, suffix } = data;

        if (prefersReducedMotion) {
            textNode.nodeValue = prefix + target + suffix;
            return;
        }

        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            textNode.nodeValue = prefix + Math.round(target * eased) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                textNode.nodeValue = prefix + target + suffix;
            }
        }

        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const data = counterData.get(entry.target);
            if (data) animateCounter(data, 1400);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    candidates.forEach(el => {
        const data = parseCounter(el);
        if (!data) return;

        counterData.set(el, data);
        data.textNode.nodeValue = data.prefix + '0' + data.suffix;
        counterObserver.observe(el);
    });
})();


(function initBackToTop() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back_to_top';
    button.setAttribute('aria-label', 'Прокрутити сторінку нагору');
    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(button);

    function toggleVisibility() {
        if (window.pageYOffset > 500) {
            button.classList.add('is-visible');
        } else {
            button.classList.remove('is-visible');
        }
    }

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
})();
