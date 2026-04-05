import React, { useState } from 'react';

export default function RoomPage({ onEnter }) {
  const [isLit, setIsLit] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handlePull = () => {
    setIsPulling(true);
    setTimeout(() => {
      setIsLit(!isLit);
      setIsPulling(false);
    }, 150);
  };

  // Mixed colors: Light Red (dominant), Pink, and White
  const COLORS = ['rgba(255,182,193,0.4)', 'rgba(255,100,100,0.5)', 'rgba(255,200,200,0.3)', 'rgba(255,255,255,0.4)'];
  const elements = [...Array(18)]; 

  return (
    <div className={`relative w-full h-screen flex flex-col items-center justify-center transition-all duration-1000 ${isLit ? 'bg-[#120505]' : 'bg-[#05050a]'} overflow-hidden`}>
      
      {/* FLOATING BUBBLES AND BALLOONS */}
      {isLit && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {elements.map((_, i) => {
            const randomColor = COLORS[i % COLORS.length];
            return (
              <React.Fragment key={i}>
                <div 
                  className="absolute rounded-full border border-white/20 animate-fall"
                  style={{ 
                    width: Math.random() * 20 + 10 + 'px',
                    height: Math.random() * 20 + 10 + 'px',
                    backgroundColor: randomColor,
                    left: Math.random() * 100 + '%', 
                    top: '-10%',
                    animationDelay: Math.random() * 8 + 's',
                    animationDuration: Math.random() * 4 + 5 + 's'
                  }}
                />
                <div 
                  className="absolute flex flex-col items-center animate-rise"
                  style={{ 
                    left: Math.random() * 100 + '%', 
                    bottom: '-20%',
                    animationDelay: Math.random() * 10 + 's',
                    animationDuration: Math.random() * 6 + 7 + 's'
                  }}
                >
                  <div 
                    className="w-12 h-14 rounded-full shadow-lg border border-white/10 relative"
                    style={{ backgroundColor: randomColor }}
                  >
                    <div className="absolute top-2 left-3 w-3 h-5 bg-white/20 rounded-full blur-[1px]"></div>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10"></div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* HAPPY BIRTHDAY PROJECTION (Above the lamp) */}
      <div className={`absolute top-[15%] md:top-[20%] transition-all duration-1000 transform z-40 ${isLit ? 'opacity-100 scale-110 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
        <h1 className="text-4xl md:text-6xl font-black text-red-100 tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] font-serif italic text-center">
          Happy <br className="md:hidden" /> Birthday
        </h1>
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent mt-4 animate-pulse"></div>
      </div>

      {/* HEXAGON LAMP SETUP */}
      <div className="relative flex flex-col items-center z-30 scale-110 md:scale-125">
        
        {/* HEXAGON LAMPSHADE */}
        <div className="relative">
          <div 
            className={`w-36 h-24 transition-all duration-700 relative overflow-hidden ${isLit ? 'bg-red-100/40 shadow-[0_-15px_120px_rgba(255,100,100,0.4)] border-b-4 border-red-200/20' : 'bg-gray-800'}`}
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}
          >
            {isLit && <div className="absolute inset-0 bg-gradient-to-t from-red-400/20 to-transparent animate-pulse"></div>}
          </div>
          
          {/* THE PULL CHAIN (Clickable Area) */}
          <div 
            className="absolute left-[60%] top-[95%] flex flex-col items-center cursor-pointer group pointer-events-auto"
            onClick={handlePull}
          >
            <div className={`w-[2px] transition-all duration-150 ${isPulling ? 'h-16' : 'h-10'} bg-gray-400 group-hover:bg-red-400`}></div>
            <div className={`w-3 h-3 rounded-full ${isLit ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-gray-600'} border border-gray-500`}></div>
          </div>
        </div>

        {/* LAMP BASE */}
        <div className={`w-3 h-20 transition-colors duration-700 ${isLit ? 'bg-red-900/50' : 'bg-gray-700'}`}></div>
        <div className="w-20 h-4 bg-gray-900 rounded-full shadow-xl"></div>
        
        {/* SUPER LIGHT RED GLOW */}
        {isLit && (
          <div className="absolute -inset-40 bg-red-500/5 blur-[150px] -z-10"></div>
        )}
      </div>

      {/* THE TABLE */}
      <div className="w-80 h-4 bg-[#1a0f0f] rounded-t-xl z-20 -mt-1 shadow-2xl"></div>

      {/* ACTION BUTTON (TARA NA) */}
      <div className={`mt-24 transition-all duration-1000 transform z-50 ${isLit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Iwasan ang conflict sa pull chain
            onEnter();
          }}
          className="px-12 py-3 bg-red-600/20 backdrop-blur-xl border border-red-500/40 rounded-full hover:bg-red-600/50 transition-all hover:scale-110 active:scale-95 text-red-100 text-lg tracking-[0.3em] font-medium shadow-[0_0_25px_rgba(239,68,68,0.3)] pointer-events-auto relative"
        >
          SULOD NA HEHE
        </button>
      </div>

      <div className={`absolute bottom-10 transition-opacity duration-700 ${isLit ? 'opacity-0' : 'opacity-100'} text-white/30 text-[10px] tracking-[0.4em] uppercase z-10`}>
        Bugnota ang tali, luway mabugto HAHAHA
      </div>

      <style jsx>{`
        @keyframes fall {
          to { transform: translateY(115vh) translateX(-20px) rotate(360deg); }
        }
        @keyframes rise {
          to { transform: translateY(-130vh) translateX(30px); }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-rise { animation: rise linear infinite; }
      `}</style>
    </div>
  );
}