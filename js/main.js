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