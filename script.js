// ==================== CONSTANTS & VARIABLES ====================
const CORRECT_PASSWORD = '05202006';

const lampChain = document.getElementById('lampChain');
const lampShade = document.getElementById('lampShade');
const lampBulb = document.getElementById('lampBulb');
const shadeInner = document.querySelector('.shade-inner');
const passwordContainer = document.getElementById('passwordContainer');
const passwordField = document.getElementById('passwordField');
const submitBtn = document.getElementById('submitBtn');

const loginPage = document.getElementById('loginPage');
const wrongPasswordPage = document.getElementById('wrongPasswordPage');
const landingPage = document.getElementById('landingPage');
const backBtn = document.getElementById('backBtn');

const envelope = document.getElementById('envelope');
const letterModal = document.getElementById('letterModal');
const closeLetterBtn = document.querySelector('.close-letter');

const photoOverlay = document.getElementById('photoOverlay');
const photoOverlayImg = document.getElementById('photoOverlayImg');
const photoCloseBtn = document.getElementById('photoClose');

const imageSlots = document.querySelectorAll('.image-slot');
const tulipsAll = document.querySelectorAll('.tulip');

let lampIsLit = false;
let envelopeOpened = false;
let tulipClickCount = 0;

const tulipStarsLayer = document.createElement('div');
tulipStarsLayer.className = 'tulip-stars-layer';
document.body.appendChild(tulipStarsLayer);

// ==================== LAMP INTERACTION ====================
lampChain.addEventListener('click', lightUpLamp);

function lightUpLamp() {
    if (lampIsLit) return;
    
    lampIsLit = true;
    lampShade.classList.add('lit');
    shadeInner.classList.add('lit');
    lampBulb.classList.add('lit');
    
    setTimeout(() => {
        passwordContainer.classList.remove('hidden');
        passwordField.focus();
    }, 300);
}

// ==================== PASSWORD VALIDATION ====================
passwordField.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkPassword();
    }
});

submitBtn.addEventListener('click', checkPassword);

function checkPassword() {
    const enteredPassword = passwordField.value;

    if (enteredPassword === CORRECT_PASSWORD) {
        transitionToPage(landingPage);
        startLandingPageAnimations();
    } else {
        transitionToPage(wrongPasswordPage);
    }
}

// ==================== PAGE TRANSITIONS ====================
function transitionToPage(targetPage) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    targetPage.classList.add('active');
}

backBtn.addEventListener('click', () => {
    passwordField.value = '';
    passwordContainer.classList.add('hidden');
    lampIsLit = false;
    lampShade.classList.remove('lit');
    shadeInner.classList.remove('lit');
    lampBulb.classList.remove('lit');
    transitionToPage(loginPage);
});

// ==================== LANDING PAGE ANIMATIONS ====================
function startLandingPageAnimations() {
    setTimeout(() => {
        document.querySelectorAll('.tulip').forEach(tulip => {
            tulip.classList.add('glow-active');
        });
    }, 3500);

    setTimeout(() => {
        const bouquetWrapper = document.querySelector('.bouquet-wrapper');
        bouquetWrapper.classList.remove('hidden');
    }, 3700);

    setTimeout(() => {
        const envelopeSection = document.querySelector('.envelope-section');
        envelopeSection.classList.remove('hidden');
    }, 3500);
}

// ==================== ENVELOPE & LETTER ====================
envelope.addEventListener('click', () => {
    if (!envelopeOpened) {
        envelope.classList.add('opened');
        setTimeout(() => openLetterModal(), 200);
        envelopeOpened = true;
    } else {
        closeMessage();
    }
});

closeLetterBtn.addEventListener('click', closeMessage);

letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        closeMessage();
    }
});

function openLetterModal() {
    letterModal.classList.remove('hidden');
    letterModal.classList.add('show');
}

function closeMessage() {
    letterModal.classList.remove('show');
    setTimeout(() => {
        letterModal.classList.add('hidden');
        if (envelopeOpened) {
            envelope.classList.remove('opened');
            envelopeOpened = false;
        }
    }, 200);
}

// ==================== PHOTO OVERLAY ====================
imageSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        const img = slot.querySelector('img');
        if (!img) return;
        photoOverlayImg.src = img.src;
        photoOverlay.classList.remove('hidden');
        photoOverlay.classList.add('show');
    });
});

function closePhotoOverlay() {
    photoOverlay.classList.remove('show');
    setTimeout(() => photoOverlay.classList.add('hidden'), 200);
}

photoCloseBtn.addEventListener('click', closePhotoOverlay);
photoOverlay.addEventListener('click', (e) => {
    if (e.target === photoOverlay) {
        closePhotoOverlay();
    }
});

// ==================== TULIP CLICK STARS ====================
const permanentStarPosition = { top: '16%', left: '20%' };
const secondClickPosition = { top: '14%', left: '68%' };

function tulipClickHandler() {
    tulipClickCount++;

    if (tulipClickCount === 1) {
        addStar(permanentStarPosition, true);
        addStar({ top: '10%', left: '40%' }, false, true);
        addStar({ top: '22%', left: '55%' }, false, true);
        return;
    }

    if (tulipClickCount === 2) {
        addStar(secondClickPosition, false, true);
        return;
    }

    const randomTop = Math.floor(Math.random() * 40) + 10;
    const randomLeft = Math.floor(Math.random() * 70) + 10;
    addStar({ top: `${randomTop}%`, left: `${randomLeft}%` }, false, true);
}

function addStar(pos, isPermanent = false, autoRemove = false) {
    const star = document.createElement('div');
    star.className = 'glow-spark tulip-star';
    star.style.top = pos.top;
    star.style.left = pos.left;
    
    if (isPermanent) {
        star.classList.add('permanent');
    }

    tulipStarsLayer.appendChild(star);

    if (autoRemove) {
        setTimeout(() => {
            star.classList.add('fade-out-spark');
            const handleTransitionEnd = () => {
                star.remove();
                star.removeEventListener('transitionend', handleTransitionEnd);
            };
            star.addEventListener('transitionend', handleTransitionEnd);
        }, 1600);
    }
}

// ==================== TULIP EVENT LISTENERS ====================
tulipsAll.forEach(tulip => {
    tulip.addEventListener('click', tulipClickHandler);
});