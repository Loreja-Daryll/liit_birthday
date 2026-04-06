import React, { useState, useEffect, useRef } from 'react';
import { Home, Sparkles, X, Mail, BookText, Volume2, VolumeX } from 'lucide-react';

/**
 * TYPEWRITER COMPONENT
 * Ito ang gumagawa ng "typing effect" sa letter para hindi biglang lumitaw ang text.
 */
const Typewriter = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

const GardenPage = ({ onBack }) => {
  // --- STATES ---
  const [isBookOpen, setIsBookOpen] = useState(false); // Kung nakabukas o sarado ang photo album
  const [currentIndex, setCurrentIndex] = useState(0); // Kung anong page na ang tinitignan sa album
  const [isFlipping, setIsFlipping] = useState(false); // Para sa animation ng paglipat ng page
  const [flipDirection, setFlipDirection] = useState('next'); // Direction ng paglipat (forward/backward)
  const [showLetter, setShowLetter] = useState(false); // Controller para sa Glassmorphism Letter Modal
  const [stars, setStars] = useState([]); // Array para sa mga shooting stars sa background
  const [isPlaying, setIsPlaying] = useState(false); // Music player state

  // --- REFS ---
  const audioRef1 = useRef(null); // I-rename natin para malinis
  const audioRef2 = useRef(null); // Ito yung para sa pangalawang kanta

  // --- VOLUME ADJUSTMENT PART ---
  useEffect(() => {
    if (audioRef1.current) audioRef1.current.volume = 1.0; 
    if (audioRef2.current) audioRef2.current.volume = 0.7;
  }, []);

  // --- SPARKLE CURSOR (FAIRY DUST) LOGIC ---
  // Gumagawa ng maliliit na div na sumusunod sa mouse/touch movement
  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);

      if (!x || !y) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-dot';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      // Randomize size para magmukhang totoong magic dust
      const size = Math.random() * 8 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;

      document.body.appendChild(sparkle);
      // Burahin yung sparkle pagkatapos ng 1 second para hindi bumigat ang page
      setTimeout(() => sparkle.remove(), 1000);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // --- PHOTO SOURCES ---
  // Dito mo ilalagay lahat ng file names ng pictures niyo (ilagay sa 'public' folder)
  const PHOTO_SOURCES = [
    'bastasiyayun.jpg', 'pogi.jpg', 'pic1.jpg', 'bagonapic.jpg', 'kyutt.jpg',
    'nangaasar.jpg', 'ingkodan.jpg', 'pic4.jpg', 'pic2.jpg', '2bago.jpg', 'pic8.jpeg', 
     'pic3.jpg', 'pic6.jpg', 'pic7.jpg', 'pic5.jpg', 'oringon.jpg'
  ];

  // Pinapares ang photos (2 pictures per open spread ng book)
  const photoPairs = [];
  for (let i = 0; i < PHOTO_SOURCES.length; i += 2) {
    photoPairs.push([PHOTO_SOURCES[i], PHOTO_SOURCES[i + 1] || null]);
  }

  // Iba't ibang kulay ng borders para sa bawat page para hindi boring
  const frameStyles = [
    "border-[8px] border-pink-100 shadow-lg",
    "border-[8px] border-yellow-50 shadow-lg",
    "border-[8px] border-blue-50 shadow-lg",
    "border-[8px] border-red-50 shadow-lg",
    "border-[8px] border-purple-50 shadow-lg",
    "border-[8px] border-green-50 shadow-lg",
    "border-[8px] border-white shadow-lg"
  ];

  // --- SHOOTING STARS TIMER ---
  // Nag-ge-generate ng bagong star bawat 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = { id: Date.now(), top: Math.random() * 80 + '%', left: '100%' };
      setStars(prev => [...prev, newStar]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== newStar.id)), 5000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- FUNCTIONS ---

  // Toggle para sa Play/Pause ng music
  const toggleMusic = () => {
    if (isPlaying) {
      audioRef1.current.pause();
      audioRef2.current.pause();
    } else {
      audioRef1.current.play();
      audioRef2.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Function para buksan ang album
  const handleOpenBook = () => {
    if (isFlipping) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => { setIsBookOpen(true); }, 400);
    setTimeout(() => { setIsFlipping(false); }, 800);
  };

  // Next Page logic
  const handleNext = () => {
    if (isFlipping) return;
    if (currentIndex < photoPairs.length - 1) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => setCurrentIndex(c => c + 1), 400);
      setTimeout(() => setIsFlipping(false), 800);
    }
  };

  // Previous Page logic
  const handlePrev = () => {
    if (isFlipping) return;
    if (currentIndex > 0) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => setCurrentIndex(c => c - 1), 400);
      setTimeout(() => setIsFlipping(false), 800);
    } else {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => setIsBookOpen(false), 400);
      setTimeout(() => setIsFlipping(false), 800);
    }
  };

  // Nag-ge-generate ng random sprinkles para sa birthday cake
  const renderSprinkles = (count) => {
    const colors = ['#fde68a', '#93c5fd', '#f9a8d4', '#86efac', '#ffffff', '#fdba74'];
    return [...Array(count)].map((_, i) => (
      <div
        key={i}
        className="cake-sprinkle"
        style={{
          top: Math.random() * 80 + 5 + '%',
          left: Math.random() * 90 + 5 + '%',
          backgroundColor: colors[i % colors.length],
          transform: `rotate(${Math.random() * 360}deg)`
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen w-full bg-birthday-gradient text-white relative overflow-hidden font-sans flex flex-col">

      {/* BACKGROUND MUSIC 1 */}
      <audio ref={audioRef1} loop>
        <source src="Download (2).mp4" type="audio/mpeg" />
      </audio>

      {/* BACKGROUND MUSIC 2 (Dito mo i-add yung isa pa) */}
      <audio ref={audioRef2} loop>
        <source src="Download (3).mp4" type="audio/mpeg" />
      </audio>

      {/* 2. MUSIC TOGGLE BUTTON (Floating bottom right) */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={toggleMusic}
          className={`p-4 rounded-full transition-all duration-300 ${isPlaying ? 'bg-red-600 music-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-gray-600 opacity-70'} hover:scale-110 shadow-2xl focus:outline-none`}
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* 3. SHOOTING STARS RENDER */}
      {stars.map(star => (
        <div key={star.id} className="shooting-star" style={{ top: star.top }} />
      ))}

      {/* 4. HEADER SECTION */}
      <header className="p-4 flex justify-between items-center relative z-50">
        <h1 className="text-lg font-bold text-red-300 flex items-center gap-2 font-serif tracking-widest opacity-70">
          <Sparkles className="text-red-400" size={16} /> HAPPY NA B-DAY MO'PA
        </h1>
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-red-500/30 transition-all">
          <Home className="text-red-300" size={18} />
        </button>
      </header>

      {/* 5. MAIN CONTENT (PHOTO ALBUM / BOOK) */}
      <main className="flex-grow flex items-center justify-center p-2 relative z-30 perspective-2000">
        <div className="relative w-full max-w-6xl aspect-[1.4/1] flex justify-center transform-style-3d">
          <div className={`relative h-full transition-all duration-700 ease-in-out ${isBookOpen ? 'w-full' : 'w-1/2 translate-x-1/2'}`}>

            {/* BOOK COVER (Lumalabas lang pag sarado ang book) */}
            {!isBookOpen && (
              <div
                onClick={handleOpenBook}
                className={`absolute inset-0 z-[60] origin-left cursor-pointer transition-transform
                  ${isFlipping ? 'animate-flip-forward' : 'hover:rotate-y-[-15deg]'}
                  bg-[#fefce8] rounded-r-2xl rounded-l-sm border-l-[12px] border-red-300 shadow-2xl
                  flex flex-col items-center justify-center border-2 border-red-800/30 transform-style-3d`}
              >
                <div className="backface-hidden flex flex-col items-center">
                  <BookText size={80} className="text-red-800 mb-6" />
                  <h2 className="text-3xl font-serif font-bold text-red-950 tracking-[1px]">PICTURES</h2>
                  <p className="mt-8 text-red-900/90 text-sm animate-pulse tracking-[0.2em]">CLICK TO OPEN</p>
                </div>
              </div>
            )}

            {/* OPENED BOOK PAGES */}
            {isBookOpen && (
              <div className="w-full h-full flex transform-style-3d animate-fade-in relative">
                {/* LEFT PAGE */}
                <div className="flex-1 bg-[#fdf8f3] rounded-l-md border-r border-black/10 relative p-4 flex flex-col shadow-inner overflow-hidden">
                  <h6 className="text-center font-serif text-[12px] uppercase tracking-widest text-red-400/60 mb-2 font-bold">Happy Birthday ✨</h6>
                  <div className="flex-grow flex items-center justify-center overflow-hidden">
                    <div className={`relative p-1 bg-white ${frameStyles[currentIndex % frameStyles.length]} transition-all duration-500 max-h-full`}>
                      <img src={photoPairs[currentIndex][0]} className="max-w-full max-h-[75vh] object-contain rounded-sm shadow-md" alt="Left" />
                      <div className="absolute -top-3 -left-3 text-2xl">🎈</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 cursor-w-resize z-10" onClick={handlePrev} />
                </div>

                {/* FLIPPING PAGE ANIMATION */}
                {isFlipping && (
                  <div className={`absolute top-0 h-full w-1/2 z-40 ${flipDirection === 'next' ? 'right-0 origin-left animate-flip-forward' : 'left-0 origin-right animate-flip-backward'}`}>
                    <div className="w-full h-full bg-[#f4ece4] shadow-2xl border-x border-black/10" />
                  </div>
                )}

                {/* RIGHT PAGE */}
                <div className="flex-1 bg-[#fdf8f3] rounded-r-md relative p-4 flex flex-col shadow-inner overflow-hidden">
                  <h6 className="text-center font-serif text-[12px] uppercase tracking-widest text-red-400/60 mb-2 font-bold">Special Day ❤️</h6>
                  <div className="flex-grow flex items-center justify-center overflow-hidden">
                    {photoPairs[currentIndex][1] ? (
                      <div className={`relative p-1 bg-white ${frameStyles[(currentIndex + 1) % frameStyles.length]} transition-all duration-500 max-h-full`}>
                        <img src={photoPairs[currentIndex][1]} className="max-w-full max-h-[75vh] object-contain rounded-sm shadow-md" alt="Right" />
                        <div className="absolute -top-3 -right-3 text-2xl">🎉</div>
                      </div>
                    ) : (
                      <div className="text-red-200 font-serif italic text-center text-sm">To be continued... ❤️</div>
                    )}
                  </div>
                  <div className="absolute inset-0 cursor-e-resize z-10" onClick={handleNext} />
                </div>
                {/* Book Spine (Ang guhit sa gitna ng libro) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-red-950/20 z-50" />
              </div>
            )}
            {/* Shadow ng libro pag sarado */}
            <div className="absolute inset-0 w-full h-full bg-[#2d0707] rounded-r-2xl -z-10 shadow-xl" style={{ display: isBookOpen ? 'none' : 'block' }} />
          </div>
        </div>
      </main>

      {/* 6. FOOTER SECTION (BOUQUET, ENVELOPE, & CAKE) */}
      <footer className="relative z-40 w-full pb-6 flex flex-col items-center">

        {/* BOUQUET & MAIL BUTTON */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-2">
          <img src="bouquet1.png" alt="Bouquet" className="w-full h-full object-contain z-10" />

          <button
            onClick={() => setShowLetter(true)}
            className="absolute top-[63%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform hover:scale-110 active:scale-95 group focus:outline-none"
          >
            <div className="bg-[red] p-0.5 rounded-xl shadow-2xl border-t-1 border-red-200 transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Mail size={30} className="text-white" />
              <div className="absolute -top-1 -right-1 bg-white-400 w-4 h-4 rounded-full flex items-center justify-center text-[13px] text-white-900 font-bold border border-white animate-bounce">!</div>
            </div>
          </button>
        </div>

        {/* BIRTHDAY CAKE & SURROUNDINGS */}
        <div className="relative flex flex-col items-center scale-90 origin-bottom mt-20 z-30">
          
          {/* GIFT BOX (Left side of cake) */}
          <div className="absolute -left-2 bottom-4 w-16 h-16 bg-red-500 rounded-lg shadow-xl border-t-4 border-red-300 transform -rotate-12 flex items-center justify-center">
             <div className="absolute w-full h-4 bg-pink-400"></div>
             <div className="absolute h-full w-4 bg-pink-400"></div>
             <div className="absolute -top-3 text-xl">🎀</div>
          </div>

          {/* CHOCOLATE BAR (Right side of cake) */}
          <div className="absolute -right-0 top-29 bottom-2 w-20 h-10 bg-[#4b2c20] rounded shadow-lg border-2 border-[#361e15] transform rotate-6 overflow-hidden">
            <div className="grid grid-cols-4 h-full">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="border-r border-black/20 shadow-inner"></div>
               ))}
            </div>
          </div>

          {/* Candle & Age */}
          <div className="absolute -top-[90px] flex flex-col items-center z-10">
            <div className="candle-flame translate-y-[15px] mb-1"></div>
            <div className="text-[40px] font-bold text-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] leading-none italic font-serif">20</div>
            <div className="w-2.5 h-6 bg-gradient-to-b from-yellow-300 to-yellow-600"></div>
          </div>

          {/* Cake Tiers */}
          <div className="w-24 h-10 bg-red-300 rounded-t-2xl relative shadow-md border-b border-red-400/20 overflow-hidden">
            {renderSprinkles(20)}
          </div>
          <div className="w-36 h-12 bg-red-500 relative shadow-lg border-b border-red-600/20 overflow-hidden">
            {renderSprinkles(30)}
          </div>
          <div className="w-48 h-16 bg-red-700 rounded-b-3xl relative shadow-2xl overflow-hidden">
            {renderSprinkles(40)}
            {/* Chocolate Drip effect */}
            <div className="absolute top-0 left-0 w-full h-3 bg-[#3d0a0a] rounded-full blur-[1px]"></div>
          </div>

          {/* CAKE PLATE/STAND (Ang circle sa baba) */}
          <div className="w-64 h-6 bg-gray-200 rounded-[100%] mt-[-10px] shadow-2xl border-b-4 border-gray-400 z-[-1] flex items-center justify-center">
             <div className="w-[95%] h-[80%] border border-gray-300 rounded-[100%]"></div>
          </div>
        </div>
      </footer>

      {/* 7. GLASSMORPHISM LETTER MODAL (Ang "Surprise" letter mo) */}
      {showLetter && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setShowLetter(false)}
            className="absolute top-8 right-8 p-3 bg-white-600 rounded-full z-[110] hover:bg-red-700 transition-all hover:rotate-90 shadow-2xl"
          >
            <X size={28} className="text-white" />
          </button>

          {/* Letter Content Area */}
          <div className="glass-letter w-full max-w-lg h-[70vh] rounded-[30px] p-10 shadow-2xl relative overflow-y-auto border border-white/20">
            <h2 className="text-center font-serif text-3xl text-red-600 font-bold mb-8 border-b-2 border-red-200 pb-2">Happy 20th Birthday!</h2>

            <div className="italic text-xl leading-relaxed font-semibold space-y-6 text-[#2d0707]">
              {/* Dito mo i-edit ang text ng message mo, Mahal! */}
              <Typewriter
                text={"Hi Mahal, Happy 20th Birthday! ❤️\n\nMahal na mahal kita at sana nagustuhan mo itong munting garden, bouquet, at album na ginawa ko para sa'yo! ✨\n\nSana naging special ang araw mo dahil special ka sa akin. Palagi kitang susuportahan sa lahat ng pangarap mo. Happy birthday again, Mahal!"}
                speed={50}
              />

              <div className="pt-10 flex flex-col items-end">
                <p className="text-red-700 text-2xl font-black tracking-wider">— Your Love ❤️</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenPage;