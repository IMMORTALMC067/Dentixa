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

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const menu = document.querySelector('.menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            menu.classList.toggle('open');
        });
    }

    // Закривати меню при кліку на посилання
    document.querySelectorAll('.menu .nav_link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            menu.classList.remove('open');
        });
    });

    // Закривати меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (menu && burger && !menu.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('open');
            menu.classList.remove('open');
        }
    });
});
