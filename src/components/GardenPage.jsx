import React, { useState, useEffect } from 'react';
import { Home, Sparkles, X, Mail } from 'lucide-react';

const Typewriter = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
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
  const [floatingPics, setFloatingPics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [stars, setStars] = useState([]);

  const PHOTO_SOURCES = [
    'pogi.jpg', '2bago.jpg', 'bagonapic.jpg', 'bastasiyayun.jpg', 'kyutt.jpg',
    'nangaasar.jpg', 'pic1.jpg', 'pic8.jpeg', 'pic2.jpg', 'pic3.jpg',
    'pic4.jpg', 'pic5.jpg', 'pic6.jpg', 'pic7.jpg'
  ];

  const addPhoto = (e) => {
    if (currentIndex >= PHOTO_SOURCES.length) return;

    // 1. Sparkle Burst Effect
    const newBurst = { id: Date.now(), top: e.clientY, left: e.clientX };
    setBursts(prev => [...prev, newBurst]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== newBurst.id)), 1000);

    // 2. TRIGGER MULTIPLE THICC STARS per click
    const currentBatchId = Date.now();
    const newStars = [
      { id: `star-${currentBatchId}-1`, top: '15%', delay: '0s' },
      { id: `star-${Date.now()}-2`, top: '40%', delay: '0.5s' }, // Added variety in ID for speed
      { id: `star-${Date.now()}-3`, top: '65%', delay: '1s' }
    ];
    
    setStars(prev => [...prev, ...newStars]);
    
    // Cleanup adapted for 6s animation + delay
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.some(ns => ns.id === s.id)));
    }, 8000);

    // 3. ADD PHOTO
    const nextSrc = PHOTO_SOURCES[currentIndex];
    const newPic = {
      id: Date.now() + 1,
      src: nextSrc,
      top: Math.random() * 35 + 5 + '%',
      left: Math.random() * 70 + 10 + '%',
    };
    setFloatingPics(prev => [...prev, newPic]);
    setCurrentIndex(prev => prev + 1);
  };

  const flowerHeights = [100, 140, 80, 160, 110, 130, 90, 150];

  // Helper function to render sprinkles
  const renderSprinkles = (count) => {
    const colors = ['bg-yellow-200', 'bg-blue-200', 'bg-pink-200', 'bg-green-200', 'bg-white'];
    return [...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className={`sprinkle ${colors[i % colors.length]}`} 
        style={{ 
          top: Math.random() * 80 + 10 + '%', 
          left: Math.random() * 80 + 10 + '%' 
        }} 
      />
    ));
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0d1a] text-white relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* SHOOTING STAR LAYER */}
      {stars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: star.top,
            animationDelay: star.delay
          }}
        />
      ))}

      {/* SPARKLE BURST */}
      {bursts.map(burst => (
        <div key={burst.id} className="pointer-events-none fixed z-[60]" style={{ top: burst.top, left: burst.left }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{ transform: `rotate(${i * 45}deg) translateY(-20px)`, boxShadow: '0 0 10px #facc15' }} />
          ))}
        </div>
      ))}

      {/* FLOATING PHOTOS */}
      {floatingPics.map(pic => (
        <div key={pic.id} style={{ top: pic.top, left: pic.left }} onClick={() => setSelectedImg(pic.src)}
          className="fixed w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white/40 overflow-hidden cursor-zoom-in animate-float z-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <img src={pic.src} className="w-full h-full object-cover" alt="Memory" />
        </div>
      ))}

      {/* IMAGE MODAL */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
          <button onClick={() => setSelectedImg(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full z-[110]"><X size={28} /></button>
          <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-full border-8 border-white/20 shadow-2xl object-contain animate-in zoom-in-95 duration-300" alt="View" />
        </div>
      )}

      {/* LETTER MODAL */}
      {showLetter && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <button onClick={() => setShowLetter(false)} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full z-[110]"><X size={28} /></button>
          <div className="bg-[#fff9f0] text-[#5d4037] w-full max-w-md h-[70vh] rounded-3xl p-8 shadow-2xl overflow-y-auto relative border-8 border-red-500/30">
            <h2 className="text-4xl font-bold mb-6 text-red-600 font-serif border-b-2 border-red-100 pb-2 text-center">20</h2>
            <div className="space-y-4 leading-relaxed text-lg italic font-medium">
              <Typewriter text="Hi Love, Happy 20th Birthday! ❤️\n\nMahal na mahal kita at sana nagustuhan mo itong munting garden na ginawa ko para sa'yo! ✨" speed={40} />
              <p className="font-bold text-red-600 text-xl mt-6 text-right">— Your Love ❤️</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center relative z-40">
        <h1 className="text-xl md:text-2xl font-bold text-red-300 drop-shadow-[0_0_10px_rgba(252,165,165,0.5)] flex items-center gap-2 font-serif uppercase tracking-tighter">
          <Sparkles className="text-red-400 animate-pulse" size={20} /> Birthday Garden
        </h1>
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-red-500/30 transition-all pointer-events-auto"><Home className="text-red-300" size={20} /></button>
      </header>

      {/* FLOWERS AREA (BOTTOM AREA part 1) */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-50 pointer-events-none">
        <div className="flex justify-center items-end gap-2 md:gap-6 h-[150px] pointer-events-auto">
          {flowerHeights.map((height, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer" onClick={addPhoto}>
              <div className="w-8 h-10 relative transition-all group-hover:scale-125 group-hover:-translate-y-3">
                <div className="absolute inset-0 bg-red-500/50 blur-[15px] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-red-700 rounded-t-full rounded-b-lg scale-90" style={{ clipPath: 'ellipse(45% 50% at 50% 50%)' }} />
                <div className="absolute top-0 left-[-4px] w-6 h-9 bg-gradient-to-br from-red-400 to-red-600 rotate-[-15deg] origin-bottom shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ clipPath: 'ellipse(45% 50% at 50% 50%)' }} />
                <div className="absolute top-0 right-[-4px] w-6 h-9 bg-gradient-to-bl from-red-400 to-red-600 rotate-[15deg] origin-bottom shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ clipPath: 'ellipse(45% 50% at 50% 50%)' }} />
                <div className="absolute top-1 left-0.5 w-6 h-9 bg-gradient-to-t from-red-500 to-red-400" style={{ clipPath: 'ellipse(45% 50% at 50% 50%)' }} />
              </div>
              <div style={{ height: `${height}px` }} className="w-1 bg-gradient-to-b from-green-400 to-green-900 relative">
                <div className="absolute top-2 -left-3 w-4 h-1.5 bg-green-400 rounded-full rotate-[40deg]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CAKE & ENVELOPE AREA (BOTTOM AREA part 2) */}
        <div className="bg-gradient-to-t from-[#050505] to-transparent w-full pt-10 pb-6 flex flex-col items-center pointer-events-auto">
          
          {/* CAKE WITH CANDLE */}
          <div className="flex flex-col items-center mb-4 scale-75 md:scale-90 origin-bottom relative">
            
            {/* GOLD NUMBER 20 CANDLE (Aesthetic) */}
            <div className="absolute -top-[70px] flex flex-col items-center z-10">
              {/* Realistic Flame */}
              <div className="candle-flame"></div>
              {/* Gold "20" Number */}
              <div className="text-[32px] font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] leading-none italic font-serif mt-1">20</div>
              {/* Candle Stick */}
              <div className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-yellow-700 shadow-md"></div>
            </div>

            {/* Cake Layers with Sprinkles */}
            {/* Top Layer */}
            <div className="w-16 h-6 bg-red-300 rounded-t-lg relative border-b border-red-400 overflow-hidden z-0">
              {renderSprinkles(8)}
            </div>
            {/* Middle Layer */}
            <div className="w-24 h-8 bg-red-500 border-b border-red-600 relative overflow-hidden z-0">
              {renderSprinkles(12)}
            </div>
            {/* Bottom Layer */}
            <div className="w-32 h-12 bg-red-700 rounded-b-lg shadow-[0_10px_40px_rgba(220,38,38,0.4)] relative overflow-hidden border-t border-red-800 z-0">
              {renderSprinkles(16)}
            </div>
          </div>

          {/* RED ENVELOPE */}
          <div onClick={() => setShowLetter(true)} className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110">
            <div className="bg-red-600 p-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white relative border-2 border-red-400">
              <Mail size={32} />
              <div className="absolute -right-2 -top-2 bg-yellow-500 w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-red-900 font-bold animate-bounce border border-white">1</div>
            </div>
            <span className="text-[11px] mt-2 uppercase tracking-[0.2em] text-red-300 font-bold">Open Letter</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GardenPage;