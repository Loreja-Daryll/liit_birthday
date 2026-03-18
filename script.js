// ==================== LOGIN PAGE LOGIC ====================
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

const CORRECT_PASSWORD = '05202006';
let lampIsLit = false;

// Lamp chain interaction
lampChain.addEventListener('click', () => {
    if (!lampIsLit) {
        lightUpLamp();
    }
});

function lightUpLamp() {
    lampIsLit = true;
    lampShade.classList.add('lit');
    shadeInner.classList.add('lit');
    lampBulb.classList.add('lit');
    
    // Show password input with delay
    setTimeout(() => {
        passwordContainer.classList.remove('hidden');
        passwordField.focus();
    }, 300);
}

// Password submission
submitBtn.addEventListener('click', checkPassword);
passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    const enteredPassword = passwordField.value;

    if (enteredPassword === CORRECT_PASSWORD) {
        // Correct password - go to landing page
        transitionToPage(landingPage);
        startLandingPageAnimations();
    } else {
        // Wrong password - go to error page
        transitionToPage(wrongPasswordPage);
    }
}

// Back button on error page
backBtn.addEventListener('click', () => {
    passwordField.value = '';
    passwordContainer.classList.add('hidden');
    lampIsLit = false;
    lampShade.classList.remove('lit');
    shadeInner.classList.remove('lit');
    lampBulb.classList.remove('lit');
    transitionToPage(loginPage);
});

// ==================== PAGE TRANSITIONS ====================
function transitionToPage(targetPage) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    targetPage.classList.add('active');
}

// ==================== LANDING PAGE ANIMATIONS ====================
function startLandingPageAnimations() {
    // Step 1: Tulips grow and bloom (CSS handles this automatically)
    
    // Step 2: Add glow effect to tulips after they bloom
    setTimeout(() => {
        document.querySelectorAll('.tulip').forEach(tulip => {
            tulip.classList.add('glow-active');
        });
    }, 3500);

    // Step 3: Show bouquet
    setTimeout(() => {
        const bouquetWrapper = document.querySelector('.bouquet-wrapper');
        bouquetWrapper.classList.remove('hidden');
    }, 3700);

    // Step 4: Envelope appears (handled by CSS animation with delay)
    setTimeout(() => {
        const envelopeSection = document.querySelector('.envelope-section');
        envelopeSection.classList.remove('hidden');
    }, 3500);
}

// ==================== ENVELOPE INTERACTION ====================
const envelope = document.getElementById('envelope');
const letterModal = document.getElementById('letterModal');
const closeLetterBtn = document.querySelector('.close-letter');
let envelopeOpened = false;
let pictureEnlarged = null;
let tulipMagicShown = false;

function openLetterModal(fromElement) {
    if (fromElement) {
        fromElement.classList.add('enlarged');
        pictureEnlarged = fromElement;
    }
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

// Bouquet image modal logic
const imageSlots = document.querySelectorAll('.image-slot');
const photoOverlay = document.getElementById('photoOverlay');
const photoOverlayImg = document.getElementById('photoOverlayImg');
const photoCloseBtn = document.getElementById('photoClose');

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

// Tulip click glow stars with permanent and temporary behavior
const tulipStarsLayer = document.createElement('div');
tulipStarsLayer.className = 'tulip-stars-layer';
document.body.appendChild(tulipStarsLayer);

let tulipClickCount = 0;
let permanentStarAdded = false;

const permanentStarPosition = { top: '16%', left: '20%' };
const secondClickPosition = { top: '14%', left: '68%' };

const tulipClickHandler = () => {
    tulipClickCount += 1;

    if (tulipClickCount === 1) {
        // add permanent star and two temporary stars
        addStar(permanentStarPosition, true);
        addStar({ top: '10%', left: '40%' }, false);
        addStar({ top: '22%', left: '55%' }, false);
        permanentStarAdded = true;
        return;
    }

    if (tulipClickCount === 2) {
        addStar(secondClickPosition, false, true);
        return;
    }

    // For further clicks, new temporary star in random non-overlap positions
    const randomTop = Math.floor(Math.random() * 40) + 10;
    const randomLeft = Math.floor(Math.random() * 70) + 10;
    addStar({ top: `${randomTop}%`, left: `${randomLeft}%` }, false, true);
};

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
            star.addEventListener('transitionend', () => star.remove(), { once: true });
        }, 1600);
    }
}

const tulipsAll = document.querySelectorAll('.tulip');
tulipsAll.forEach(tulip => {
    tulip.addEventListener('click', tulipClickHandler);
});

// Close modal when clicking outside message card
letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        closeMessage();
    }
});

// ==================== PREVENT FORM SUBMISSION ==================== 
passwordField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkPassword();
    }
});

// Allow only numbers in password field
passwordField.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});