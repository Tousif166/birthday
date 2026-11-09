// Main Interactive & Shared Utilities for Rajibul's Birthday Website
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Confetti Canvas
    initConfetti();

    // 2. Setup Background Floating Particles / Balloons
    createFloatingElements();

    // 3. Setup Navigation & Active State
    highlightCurrentNav();

    // 4. Setup Keyboard Navigation (Left / Right Arrow keys for next/prev page)
    setupKeyboardNavigation();

    // 5. Setup Sound Toggle Button
    setupMusicButton();

    // 6. Confetti Cannon Button
    setupConfettiButton();

    // 7. Interactive Photo Click Heart Burst & Fullscreen Viewer
    setupPhotoHeartEffects();
    initPhotoLightbox();

    // 8. Auto celebration burst on page load
    setTimeout(() => {
        triggerConfetti(35);
    }, 400);
});

/* ========================================================
   1. Confetti Engine (Lightweight, pure Canvas)
   ======================================================== */
let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
    confettiCanvas = document.getElementById('confettiCanvas');
    if (!confettiCanvas) {
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confettiCanvas';
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.width = '100vw';
        confettiCanvas.style.height = '100vh';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '9999';
        document.body.appendChild(confettiCanvas);
    }
    confettiCtx = confettiCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

const CONFETTI_COLORS = [
    '#FF4D6D', '#FF758F', '#FFB703', '#FB8500', 
    '#06D6A0', '#118AB2', '#7209B7', '#4CC9F0', '#FFE66D'
];

function triggerConfetti(count = 60, originX = null, originY = null) {
    if (!confettiCanvas || !confettiCtx) return;
    if (window.soundManager) window.soundManager.playConfettiPop();

    const startX = originX !== null ? originX : Math.random() * confettiCanvas.width;
    const startY = originY !== null ? originY : Math.random() * (confettiCanvas.height * 0.4);

    for (let i = 0; i < count; i++) {
        confettiParticles.push({
            x: startX,
            y: startY,
            size: Math.random() * 8 + 6,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() * -10) - 4,
            gravity: 0.25,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            opacity: 1,
            shape: Math.random() > 0.4 ? 'rect' : 'circle'
        });
    }

    if (!confettiAnimationId) {
        animateConfetti();
    }
}

function animateConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.007;

        if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
            confettiParticles.splice(i, 1);
            continue;
        }

        confettiCtx.save();
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'rect') {
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        }
        confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        confettiAnimationId = null;
    }
}

/* ========================================================
   2. Ambient Floating Elements (Balloons & Sparkles)
   ======================================================== */
function createFloatingElements() {
    const container = document.createElement('div');
    container.className = 'ambient-floating-container';
    document.body.appendChild(container);

    const emojis = ['🎈', '✨', '🎂', '🌟', '🎉', '🔥', '🎮'];
    
    // Spawn subtle floating balloons and emojis periodically
    const spawnElement = () => {
        if (document.hidden) return;
        const el = document.createElement('div');
        el.className = 'floating-ambient-item';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 92 + 4 + 'vw';
        el.style.animationDuration = (Math.random() * 6 + 9) + 's';
        el.style.fontSize = (Math.random() * 14 + 18) + 'px';
        container.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 15000);
    };

    // Initial batch
    for (let i = 0; i < 6; i++) {
        setTimeout(spawnElement, i * 1200);
    }
    // Periodic interval
    setInterval(spawnElement, 3500);
}

/* ========================================================
   3. Navigation Active Highlight
   ======================================================== */
function highlightCurrentNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .page-pill');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ========================================================
   4. Keyboard Navigation (Arrows Left/Right)
   ======================================================== */
function setupKeyboardNavigation() {
    const prevBtn = document.querySelector('.btn-nav-prev');
    const nextBtn = document.querySelector('.btn-nav-next');

    document.addEventListener('keydown', (e) => {
        // Avoid triggering if user is typing in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' && nextBtn) {
            if (window.soundManager) window.soundManager.playClick();
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' && prevBtn) {
            if (window.soundManager) window.soundManager.playClick();
            prevBtn.click();
        }
    });

    // Touch swipe gesture navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 75; // minimum px for swipe
        if (touchEndX < touchStartX - threshold && nextBtn) {
            nextBtn.click();
        }
        if (touchEndX > touchStartX + threshold && prevBtn) {
            prevBtn.click();
        }
    }
}

/* ========================================================
   5. Music Toggle Button
   ======================================================== */
function setupMusicButton() {
    const btn = document.getElementById('musicToggleBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.toggleBGM();
            }
        });
        // Check initial state
        const savedBgm = localStorage.getItem('birthday_bgm_state');
        if (savedBgm === 'true' && window.soundManager) {
            window.soundManager.updateMusicUI(true);
        }
    }
}

/* ========================================================
   6. Confetti Cannon Button
   ======================================================== */
function setupConfettiButton() {
    const btn = document.getElementById('confettiCannonBtn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            triggerConfetti(70, rect.left + rect.width / 2, rect.top);
        });
    }
}

/* ========================================================
   7. Photo Click Interactive Hearts & Reactions
   ======================================================== */
function setupPhotoHeartEffects() {
    const photoWrappers = document.querySelectorAll('.memory-photo-card, .interactive-photo');
    photoWrappers.forEach(card => {
        card.addEventListener('click', (e) => {
            createFloatingHeart(e.clientX, e.clientY);
            if (window.soundManager) window.soundManager.playClick();
        });
    });
}

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-burst';
    const emojis = ['❤️', '🔥', '💖', '👑', '🎂', '✨'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1200);
}

/* ========================================================
   8. Fullscreen Photo Lightbox
   ======================================================== */
function initPhotoLightbox() {
    let lightbox = document.getElementById('globalPhotoLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'globalPhotoLightbox';
        lightbox.className = 'photo-lightbox-modal';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content-box">
                <button class="lightbox-close-btn" aria-label="Close photo">&times;</button>
                <img src="" alt="Fullscreen memory" class="lightbox-active-img">
                <div class="lightbox-img-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const closeBtn = lightbox.querySelector('.lightbox-close-btn');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            if (window.soundManager) window.soundManager.playClick();
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Attach double-click or zoom button to images
    const photos = document.querySelectorAll('.photo-inner-wrapper img');
    photos.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const lightboxImg = lightbox.querySelector('.lightbox-active-img');
            const captionBox = lightbox.querySelector('.lightbox-img-caption');
            const parentCard = img.closest('.memory-photo-card');
            const titleEl = parentCard ? parentCard.querySelector('.photo-caption-title') : null;

            if (lightboxImg) lightboxImg.src = img.src;
            if (captionBox) captionBox.textContent = titleEl ? titleEl.textContent : 'Memory with Rajibul ❤️';
            lightbox.classList.add('active');
            if (window.soundManager) window.soundManager.playClick();
        });
    });
}


