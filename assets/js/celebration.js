// Interactive Special Features for Rajibul's Birthday
document.addEventListener('DOMContentLoaded', () => {
    initCakeCeremony();
    initBooyahWidget();
    initCertificateModal();
    initWishesBoard();
    initGalleryTabs();
    initGiftBoxModal();
});

/* ========================================================
   Surprise Gift Box Modal (Home Page)
   ======================================================== */
function initGiftBoxModal() {
    const openBtn = document.getElementById('openGiftBoxBtn');
    const modal = document.getElementById('giftBoxModal');
    const closeBtn = document.getElementById('closeGiftBoxBtn');
    const giftBox = document.getElementById('interactiveGiftBox');
    const surpriseReveal = document.getElementById('giftSurpriseReveal');

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            triggerConfetti(40);
            if (window.soundManager) window.soundManager.playClick();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (window.soundManager) window.soundManager.playClick();
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    if (giftBox && surpriseReveal) {
        giftBox.addEventListener('click', () => {
            giftBox.classList.add('opened');
            setTimeout(() => {
                giftBox.style.display = 'none';
                surpriseReveal.style.display = 'block';
                surpriseReveal.classList.add('reveal-pop');
                triggerConfetti(90);
                if (window.soundManager) {
                    window.soundManager.playTone(523.25, 0.3);
                    window.soundManager.playTone(659.25, 0.3);
                    window.soundManager.playTone(783.99, 0.5);
                }
            }, 500);
        });
    }
}

/* ========================================================
   Free Fire Image Gallery Tabs
   ======================================================== */
function initGalleryTabs() {
    const tabBtns = document.querySelectorAll('.ff-tab-btn');
    const tabPanes = document.querySelectorAll('.ff-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');

            if (window.soundManager) window.soundManager.playClick();
        });
    });
}

/* ========================================================
   1. Interactive Virtual Cake Ceremony (Page 5)
   ======================================================== */
function initCakeCeremony() {
    const candle = document.getElementById('cakeCandle');
    const flame = document.getElementById('candleFlame');
    const lightBtn = document.getElementById('lightCandleBtn');
    const blowBtn = document.getElementById('blowCandleBtn');
    const cutBtn = document.getElementById('cutCakeBtn');
    const cakeSlice = document.getElementById('cakeSlice');
    const statusText = document.getElementById('cakeStatusText');

    let candleLit = false;
    let candleBlown = false;
    let cakeCut = false;

    if (lightBtn && flame) {
        lightBtn.addEventListener('click', () => {
            candleLit = true;
            flame.classList.remove('hidden-flame');
            flame.classList.add('lit-flame');
            if (statusText) statusText.innerHTML = "✨ The candle is lit! Make a wish, Rajibul, and blow it out! 🎂";
            lightBtn.style.display = 'none';
            if (blowBtn) blowBtn.style.display = 'inline-flex';
            if (window.soundManager) window.soundManager.playClick();
            triggerConfetti(25);
        });
    }

    if (blowBtn && flame) {
        blowBtn.addEventListener('click', () => {
            if (!candleLit) return;
            candleBlown = true;
            flame.classList.remove('lit-flame');
            flame.classList.add('blown-flame');

            if (window.soundManager) {
                window.soundManager.playBlowCandle();
                window.soundManager.startBGM(); // Start happy birthday melody on blow!
            }

            // Big celebratory confetti
            triggerConfetti(100);
            setTimeout(() => triggerConfetti(80), 500);

            if (statusText) statusText.innerHTML = "🎉 WISH GRANTED! Happy Birthday Rajibul! Now cut the cake! 🍰";
            blowBtn.style.display = 'none';
            if (cutBtn) cutBtn.style.display = 'inline-flex';
        });
    }

    if (cutBtn) {
        cutBtn.addEventListener('click', () => {
            cakeCut = true;
            if (cakeSlice) cakeSlice.classList.add('sliced');
            if (statusText) statusText.innerHTML = "❤️ Sweetest birthday ever, my brother! Here's the first slice for you! 🍰✨";
            cutBtn.style.display = 'none';

            if (window.soundManager) {
                window.soundManager.playTone(523.25, 0.4);
                window.soundManager.playTone(659.25, 0.4);
                window.soundManager.playTone(783.99, 0.6);
            }
            triggerConfetti(90);

            // Reveal special letter popup or highlight
            const letter = document.getElementById('personalLetterSection');
            if (letter) {
                letter.scrollIntoView({ behavior: 'smooth' });
                letter.classList.add('highlight-pulse');
            }
        });
    }
}

/* ========================================================
   2. Free Fire Booyah Mini-Widget (Page 3)
   ======================================================== */
function initBooyahWidget() {
    const booyahBtn = document.getElementById('triggerBooyahBtn');
    const banner = document.getElementById('booyahBannerOverlay');

    if (booyahBtn) {
        booyahBtn.addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playBooyah();
            }

            if (banner) {
                banner.classList.add('show-booyah');
                triggerConfetti(120);

                setTimeout(() => {
                    banner.classList.remove('show-booyah');
                }, 4000);
            }
        });
    }

    // Free Fire "Call for Match" fun alert
    const callMatchBtn = document.getElementById('callMatchBtn');
    if (callMatchBtn) {
        callMatchBtn.addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            alert("🎮 Squad Ping Sent to Rajibul!\n\n'Bhai game khol! Aaj tera birthday hai, custom room me Booyah chahiye!' 🔥\n- Tousif");
        });
    }
}

/* ========================================================
   3. Certificate of Lifelong Friendship
   ======================================================== */
function initCertificateModal() {
    const openCertBtn = document.getElementById('openCertBtn');
    const modal = document.getElementById('certificateModal');
    const closeCertBtn = document.getElementById('closeCertBtn');
    const printCertBtn = document.getElementById('printCertBtn');

    if (openCertBtn && modal) {
        openCertBtn.addEventListener('click', () => {
            modal.classList.add('active');
            triggerConfetti(50);
            if (window.soundManager) window.soundManager.playClick();
        });
    }

    if (closeCertBtn && modal) {
        closeCertBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (window.soundManager) window.soundManager.playClick();
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    if (printCertBtn) {
        printCertBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/* ========================================================
   4. Interactive Birthday Wishes Board (LocalStorage)
   ======================================================== */
function initWishesBoard() {
    const wishesForm = document.getElementById('birthdayWishForm');
    const wishesList = document.getElementById('wishesContainer');
    const defaultWishes = [
        {
            name: "Tousif (Your Brother)",
            msg: "Happy Birthday Rajibul! From Class 5 at Galsi High School till now and forever, you're the greatest friend a guy could ever ask for. Keep smiling and let's keep taking Booyah together!",
            date: "Today, with love"
        },
        {
            name: "Galsi High School Squad",
            msg: "Best wishes on your special day Rajibul! May this year bring endless happiness, success, and epic gaming clutches!",
            date: "School Memories"
        }
    ];

    if (!wishesList) return;

    function loadWishes() {
        const stored = localStorage.getItem('rajibul_birthday_wishes');
        const list = stored ? JSON.parse(stored) : defaultWishes;
        wishesList.innerHTML = '';
        list.forEach(w => {
            const card = document.createElement('div');
            card.className = 'wish-note-item';
            card.innerHTML = `
                <div class="wish-author">
                    <span class="avatar-badge">💌</span>
                    <strong>${escapeHTML(w.name)}</strong>
                    <span class="wish-date">${escapeHTML(w.date)}</span>
                </div>
                <p class="wish-text">"${escapeHTML(w.msg)}"</p>
            `;
            wishesList.appendChild(card);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    loadWishes();

    if (wishesForm) {
        wishesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('wishAuthor');
            const msgInput = document.getElementById('wishContent');

            const name = nameInput.value.trim() || 'A Dear Friend';
            const msg = msgInput.value.trim();

            if (!msg) return;

            const stored = localStorage.getItem('rajibul_birthday_wishes');
            const list = stored ? JSON.parse(stored) : [...defaultWishes];
            list.unshift({
                name: name,
                msg: msg,
                date: "Just now"
            });
            localStorage.setItem('rajibul_birthday_wishes', JSON.stringify(list));

            nameInput.value = '';
            msgInput.value = '';
            loadWishes();
            triggerConfetti(60);
            if (window.soundManager) window.soundManager.playClick();
        });
    }
}

