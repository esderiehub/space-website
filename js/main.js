/* ============================================
   COSMOS — ULTRA PREMIUM JAVASCRIPT
   ============================================ */

'use strict';

/* ---- LOADER ---- */
const loader       = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');

let progress = 0;
const loadInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 400);
    }
    loaderProgress.style.width = progress + '%';
}, 120);

document.body.style.overflow = 'hidden';

/* ---- CUSTOM CURSOR ---- */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function followCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(followCursor);
})();

document.querySelectorAll('a, button, .planet-card, .fact-bento-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

/* ---- CANVAS STARS ---- */
const canvas = document.getElementById('spaceCanvas');
const ctx    = canvas.getContext('2d');

let stars  = [];
let WIDTH, HEIGHT;

function resizeCanvas() {
    WIDTH  = canvas.width  = window.innerWidth;
    HEIGHT = canvas.height = window.innerHeight;
    createStars();
}

function createStars() {
    stars = [];
    const count = Math.floor((WIDTH * HEIGHT) / 3000);
    for (let i = 0; i < count; i++) {
        stars.push({
            x:       Math.random() * WIDTH,
            y:       Math.random() * HEIGHT,
            r:       Math.random() * 1.8 + 0.2,
            alpha:   Math.random(),
            speed:   Math.random() * 0.003 + 0.001,
            phase:   Math.random() * Math.PI * 2,
            color:   pickStarColor(),
            twinkle: Math.random() > 0.6,
        });
    }
}

function pickStarColor() {
    const colors = ['255,255,255','200,210,255','255,220,180','180,220,255','255,180,200'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawStars(time) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    stars.forEach(s => {
        const alpha = s.twinkle
            ? 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed * 60 + s.phase))
            : s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();

        if (s.r > 1.3) {
            const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
            grad.addColorStop(0, `rgba(${s.color},${alpha * 0.4})`);
            grad.addColorStop(1, `rgba(${s.color},0)`);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    });
}

/* Shooting Stars */
let shootingStars = [];

function maybeSpawnShootingStar() {
    if (Math.random() < 0.004 && shootingStars.length < 3) {
        shootingStars.push({
            x:     Math.random() * WIDTH,
            y:     Math.random() * HEIGHT * 0.5,
            len:   Math.random() * 120 + 60,
            speed: Math.random() * 6 + 4,
            alpha: 1,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        });
    }
}

function drawShootingStars() {
    shootingStars = shootingStars.filter(s => s.alpha > 0.01);
    shootingStars.forEach(s => {
        const dx = Math.cos(s.angle) * s.speed;
        const dy = Math.sin(s.angle) * s.speed;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        grad.addColorStop(0.3, `rgba(180,200,255,${s.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = s.alpha * 2;
        ctx.stroke();
        s.x += dx;
        s.y += dy;
        s.alpha -= 0.015;
    });
}

/* Nebula / Glow Clouds */
const nebulae = [];
function createNebulae() {
    const colors = ['108,99,255','0,212,255','157,78,221','255,107,107'];
    for (let i = 0; i < 5; i++) {
        nebulae.push({
            x:     Math.random() * WIDTH,
            y:     Math.random() * HEIGHT,
            r:     Math.random() * 300 + 150,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.04 + 0.01,
        });
    }
}

function drawNebulae() {
    nebulae.forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, `rgba(${n.color},${n.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    });
}

let animFrame;
function animateCanvas(time = 0) {
    drawNebulae();
    drawStars(time / 1000);
    drawShootingStars();
    maybeSpawnShootingStar();
    animFrame = requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
createNebulae();
animateCanvas();

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link
    const scrollY = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

/* Hamburger */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
});

navLinks.forEach(l => {
    l.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('open');
    });
});

/* ---- SCROLL REVEAL ---- */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ---- COUNTER ANIMATION ---- */
function animateCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const duration = 2000;
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    });
}

/* ---- GALAXY BARS ---- */
function animateGalaxyBars() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.gm-fill[data-width]').forEach(bar => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width + '%';
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const galaxySec = document.getElementById('galaxy');
    if (galaxySec) observer.observe(galaxySec);
}

/* ---- PLANET FILTER ---- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const planetCards = document.querySelectorAll('.planet-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        planetCards.forEach((card, i) => {
            const category = card.dataset.category || '';
            const show = filter === 'all' || category.includes(filter);

            if (show) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, i * 60);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => card.style.display = 'none', 400);
            }
        });
    });
});

/* ---- PLANET MODAL ---- */
const planetData = {
    mercury: {
        name: 'Mercury',
        color: '#b5b5b5',
        gradient: 'linear-gradient(135deg, #b5b5b5, #555)',
        emoji: '🪨',
        diameter: '4,879 km',
        orbit: '88 Earth Days',
        moons: '0',
        temp: '-180°C to 430°C',
        distance: '77.3 million km from Earth',
        desc: `Mercury is the smallest planet in our Solar System and the closest to the Sun. 
        Despite being closest to the Sun, it's not the hottest — that title belongs to Venus. 
        Mercury has an extremely thin atmosphere (exosphere), which means it can't trap heat. 
        Its surface is heavily cratered, resembling Earth's Moon.`,
        facts: ['Fastest planet — orbits Sun in 88 days', 'Surface temperatures swing 600°C', 'Has no moons or rings', 'Visited by Mariner 10 and MESSENGER', 'Its core makes up 85% of its radius'],
    },
    venus: {
        name: 'Venus',
        color: '#c9a227',
        gradient: 'linear-gradient(135deg, #e8c97d, #8a6a10)',
        emoji: '🌋',
        diameter: '12,104 km',
        orbit: '225 Earth Days',
        moons: '0',
        temp: '465°C (average)',
        distance: '40.4 million km from Earth',
        desc: `Venus is the hottest planet in our Solar System, despite not being the closest to the Sun. 
        Its thick atmosphere of carbon dioxide creates a runaway greenhouse effect. 
        Venus rotates backwards compared to most planets and its day is longer than its year. 
        The atmospheric pressure on the surface is 92 times that of Earth.`,
        facts: ['Hottest planet — 465°C surface temp', 'Rotates backwards (east to west)', 'A day on Venus is longer than its year', 'Covered in thousands of volcanoes', 'Atmospheric pressure crushes metal'],
    },
    earth: {
        name: 'Earth',
        color: '#4a9eff',
        gradient: 'linear-gradient(135deg, #4a9eff, #0d4a8f)',
        emoji: '🌍',
        diameter: '12,742 km',
        orbit: '365.25 Days',
        moons: '1 (The Moon)',
        temp: '-88°C to 58°C',
        distance: '0 km (Home)',
        desc: `Earth is the third planet from the Sun and the only known planet to harbor life. 
        It has liquid water on its surface, a protective magnetic field, and an atmosphere rich in oxygen and nitrogen. 
        Our planet is approximately 4.5 billion years old and hosts an extraordinary diversity of life forms — 
        from the deepest ocean trenches to the highest mountain peaks.`,
        facts: ['Only known planet with life', '71% of surface covered by oceans', 'Has a powerful protective magnetic field', 'Tilted 23.5° — creating our seasons', 'Moving 30 km/s around the Sun right now'],
    },
    mars: {
        name: 'Mars',
        color: '#e07050',
        gradient: 'linear-gradient(135deg, #e07050, #8a2510)',
        emoji: '🔴',
        diameter: '6,779 km',
        orbit: '687 Earth Days',
        moons: '2 (Phobos & Deimos)',
        temp: '-125°C to 20°C',
        distance: '78.3 million km from Earth',
        desc: `Mars is the fourth planet from the Sun and humanity's most likely next home. 
        Known as the Red Planet due to iron oxide (rust) covering its surface. 
        It hosts Olympus Mons — the largest volcano in the Solar System — and Valles Marineris, 
        a canyon system stretching 4,000 km. NASA's Perseverance rover is currently exploring its surface.`,
        facts: ['Home to the largest volcano: Olympus Mons', 'Has the longest canyon in the Solar System', 'Perseverance rover is active there now', 'A Martian day is 24h 37m — similar to Earth', 'SpaceX plans to colonize Mars'],
    },
    jupiter: {
        name: 'Jupiter',
        color: '#c8903a',
        gradient: 'linear-gradient(135deg, #c8903a, #6b4010)',
        emoji: '🌪️',
        diameter: '139,820 km',
        orbit: '12 Earth Years',
        moons: '95 confirmed',
        temp: '-110°C (cloud tops)',
        distance: '628.7 million km from Earth',
        desc: `Jupiter is the largest planet in our Solar System — so massive that all other planets combined 
        could fit inside it twice. It's a gas giant with no solid surface. 
        Its iconic Great Red Spot is a storm larger than Earth that has raged for over 350 years. 
        Jupiter has a strong magnetic field and 95 known moons, including the volcanic Io and the ocean-bearing Europa.`,
        facts: ['11× wider and 318× more massive than Earth', 'Great Red Spot storm is 350+ years old', 'Europa may have a subsurface ocean with life', 'Has a faint ring system', 'Acts as a cosmic vacuum cleaner protecting Earth'],
    },
    saturn: {
        name: 'Saturn',
        color: '#c8b840',
        gradient: 'linear-gradient(135deg, #e8d870, #8a7810)',
        emoji: '💍',
        diameter: '116,460 km',
        orbit: '29 Earth Years',
        moons: '146 confirmed',
        temp: '-140°C (average)',
        distance: '1.2 billion km from Earth',
        desc: `Saturn is the second-largest planet and arguably the most beautiful, with its magnificent ring system 
        visible even through a small telescope. The rings are made of billions of ice and rock particles ranging from 
        tiny grains to chunks the size of houses. Saturn is so light that it would float on water. 
        Its moon Titan has a thick atmosphere and lakes of liquid methane.`,
        facts: ['Ring system spans 282,000 km but is only 1km thick', 'Least dense planet — would float on water', 'Titan is the only moon with a thick atmosphere', 'Winds reach 1,800 km/h', '146 known moons — the most in the Solar System'],
    },
    uranus: {
        name: 'Uranus',
        color: '#40b8c8',
        gradient: 'linear-gradient(135deg, #40b8c8, #104858)',
        emoji: '🔵',
        diameter: '50,724 km',
        orbit: '84 Earth Years',
        moons: '27 confirmed',
        temp: '-224°C (coldest planet)',
        distance: '2.7 billion km from Earth',
        desc: `Uranus is unique — it rotates on its side with an axial tilt of 98°, likely caused by a massive 
        collision billions of years ago. This means its poles experience 42 years of continuous sunlight followed by 
        42 years of darkness. Despite being called an "ice giant," its interior is mostly hot, dense fluid of water, 
        methane, and ammonia. Its blue-green color comes from methane in its atmosphere.`,
        facts: ['Rotates on its side — 98° axial tilt', 'Coldest planetary atmosphere: -224°C', 'Has 13 known rings', 'Its moons are named after Shakespeare characters', 'Only visited by Voyager 2 in 1986'],
    },
    neptune: {
        name: 'Neptune',
        color: '#3060b8',
        gradient: 'linear-gradient(135deg, #4080e8, #102060)',
        emoji: '💨',
        diameter: '49,244 km',
        orbit: '165 Earth Years',
        moons: '16 confirmed',
        temp: '-214°C (average)',
        distance: '4.4 billion km from Earth',
        desc: `Neptune is the farthest planet from the Sun and the windiest world in our Solar System, 
        with storms reaching speeds of 2,100 km/h — faster than the speed of sound on Earth. 
        It was the first planet predicted mathematically before it was observed. 
        Its largest moon, Triton, orbits backwards and is slowly spiraling inward, destined to be torn apart in ~3.6 billion years.`,
        facts: ['Strongest winds: 2,100 km/h', 'Takes 165 years to orbit the Sun', 'Discovered by math before it was seen', 'Triton orbits backwards (retrograde)', 'Only visited by Voyager 2 in 1989'],
    },
};

const modal    = document.getElementById('planetModal');
const pmBody   = document.getElementById('pmBody');
const pmClose  = document.getElementById('pmClose');
const pmOverlay= document.getElementById('pmOverlay');

function openModal(planet) {
    const d = planetData[planet];
    if (!d) return;
    pmBody.innerHTML = `
        <div class="pm-hero" style="background: ${d.gradient}">
            <div class="pm-planet-emoji">${d.emoji}</div>
            <div class="pm-hero-info">
                <h2 class="pm-planet-name">${d.name}</h2>
                <p class="pm-planet-dist">${d.distance}</p>
            </div>
        </div>
        <div class="pm-details">
            <div class="pm-grid">
                <div class="pm-stat"><span class="pm-stat-label">Diameter</span><span class="pm-stat-value">${d.diameter}</span></div>
                <div class="pm-stat"><span class="pm-stat-label">Orbital Period</span><span class="pm-stat-value">${d.orbit}</span></div>
                <div class="pm-stat"><span class="pm-stat-label">Moons</span><span class="pm-stat-value">${d.moons}</span></div>
                <div class="pm-stat"><span class="pm-stat-label">Temperature</span><span class="pm-stat-value">${d.temp}</span></div>
            </div>
            <p class="pm-desc">${d.desc}</p>
            <h4 class="pm-facts-title">Key Facts</h4>
            <ul class="pm-facts-list">
                ${d.facts.map(f => `<li><i class="fas fa-star"></i><span>${f}</span></li>`).join('')}
            </ul>
        </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

planetCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.planet));
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

pmClose.addEventListener('click', closeModal);
pmOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Transmission Sent!</span><div class="btn-icon"><i class="fas fa-check"></i></div>';
        btn.style.background = 'linear-gradient(135deg, #00c851, #007e33)';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3500);
    });
}

/* ---- SCROLL TO TOP ---- */
const scrollTopBtn = document.getElementById('scrollTop');
const stCircle     = document.getElementById('stCircle');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = scrolled / maxScroll;

    scrollTopBtn.classList.toggle('visible', scrolled > 400);

    if (stCircle) {
        const dashOffset = 138 - (138 * progress);
        stCircle.style.strokeDashoffset = dashOffset;
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- PARALLAX ---- */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
            }
            const glows = document.querySelectorAll('.hero-bg-glow');
            glows.forEach((g, i) => {
                g.style.transform = `translateY(${scrollY * (0.05 + i * 0.02)}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

/* ---- TIMELINE ITEMS ---- */
function initTimeline() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('tl-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.tl-item').forEach(item => observer.observe(item));
}

/* ---- SMOOTH LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = target.offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

/* ---- FOOTER NEWSLETTER ---- */
const footerNl = document.querySelector('.footer-nl');
if (footerNl) {
    footerNl.querySelector('button').addEventListener('click', () => {
        const input = footerNl.querySelector('input');
        if (input.value && input.value.includes('@')) {
            const btn = footerNl.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg,#00c851,#007e33)';
            input.value = '';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
                btn.style.background = '';
            }, 3000);
        }
    });
}

/* ---- CARD 3D TILT ---- */
function initTilt() {
    document.querySelectorAll('.planet-card, .fact-bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const x      = (e.clientX - rect.left) / rect.width  - 0.5;
            const y      = (e.clientY - rect.top)  / rect.height - 0.5;
            const tiltX  = y * -12;
            const tiltY  = x *  12;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ---- GALAXY VIZ MOUSE PARALLAX ---- */
function initGalaxyParallax() {
    const gviz = document.querySelector('.galaxy-viz');
    if (!gviz) return;
    document.addEventListener('mousemove', e => {
        const rect = gviz.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;
        gviz.style.transform = `rotateX(${55 + dy * 4}deg) rotateZ(${dy * 3}deg) translateX(${dx * 10}px)`;
    });
}

/* ---- FACT BENTO HOVER GLOW ---- */
function initFactGlow() {
    document.querySelectorAll('.fact-bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
        });
    });
}

/* ---- INIT ALL ---- */
function initAnimations() {
    initReveal();
    animateCounters();
    animateGalaxyBars();
    initTimeline();
    initTilt();
    initGalaxyParallax();
    initFactGlow();
}
