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

const tulipsAll = document.querySelectorAll('.tulip');
const floatingPicturesContainer = document.getElementById('floatingPicturesContainer');

const photoSources = [
    'kyutt.jpg',
    '2bago.jpg',
    'pogi.jpg',
    'bastasiyayun.jpg',
    'bagonapic.jpg'
];

let lampIsLit = false;
let envelopeOpened = false;
let clickCount = 0;
let displayedPhotos = [];

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

// ==================== TULIP CLICK - SHOW RANDOM PICTURE ====================
tulipsAll.forEach((tulip) => {
    tulip.addEventListener('click', () => {
        if (clickCount < 5) {
            showRandomFloatingPicture();
            clickCount++;
        }
    });
});

function showRandomFloatingPicture() {
    // Pick a random photo that hasn't been displayed yet
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * photoSources.length);
    } while (displayedPhotos.includes(randomIndex) && displayedPhotos.length < photoSources.length);
    
    displayedPhotos.push(randomIndex);
    const photoSrc = photoSources[randomIndex];
    
    // Create floating picture
    const floatingPic = document.createElement('div');
    floatingPic.className = 'floating-picture';
    floatingPic.innerHTML = `<img src="${photoSrc}" alt="Photo">`;
    
    // Get random position
    const randomTop = Math.random() * 60 + 10; // 10-70%
    const randomLeft = Math.random() * 70 + 15; // 15-85%
    
    floatingPic.style.top = randomTop + '%';
    floatingPic.style.left = randomLeft + '%';
    
    floatingPicturesContainer.appendChild(floatingPic);
    
    // Create fireworks
    createFireworks(randomLeft * window.innerWidth / 100, randomTop * window.innerHeight / 100);
    
    // Make clickable to view full size
    floatingPic.addEventListener('click', (e) => {
        e.stopPropagation();
        photoOverlayImg.src = photoSrc;
        photoOverlay.classList.remove('hidden');
        photoOverlay.classList.add('show');
    });
}

function createFireworks(x, y) {
    const colors = ['#ff69b4', '#ffdb58', '#ff1493', '#ffc300', '#ff6b9d', '#fff700'];
    
    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 5 + Math.random() * 5;
        const tx = Math.cos(angle) * velocity * 20;
        const ty = Math.sin(angle) * velocity * 20;
        
        spark.style.setProperty('--tx', tx + 'px');
        spark.style.setProperty('--ty', ty + 'px');
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];
        spark.style.boxShadow = `0 0 8px ${spark.style.background}`;
        
        floatingPicturesContainer.appendChild(spark);
        
        setTimeout(() => spark.remove(), 1000);
    }
}

// ==================== PHOTO OVERLAY ====================
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