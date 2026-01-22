import React, { useState, useEffect } from 'react';

interface IntroProps {
  onEnter: () => void;
  lang: 'en' | 'de';
}

export const Intro: React.FC<IntroProps> = ({ onEnter, lang }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Fallback: If video doesn't load within 3 seconds, show content anyway
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoaded = () => {
    setIsReady(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoaded}
        style={{ opacity: isReady ? 0.4 : 0 }}
        className="absolute inset-0 w-full h-full object-cover object-left md:object-center transition-opacity duration-1000"
      >
        <source src="assets/Nonna_Hintergrund.mp4" type="video/mp4" />
      </video>

      {/* Yellow Overlay */}
      <div className="absolute inset-0 bg-[#F8C300] opacity-80 mix-blend-multiply" />
      
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-20 md:gap-24 h-full py-20 w-full">
        <div className="flex flex-col justify-center items-center w-full px-8">
            {/* Title Image */}
            <img 
                src="assets/NONNA_Logo_V2.png" 
                alt="NONNA - un film di Vincent Graf" 
                style={{ 
                    opacity: isReady ? 1 : 0, 
                    transform: isReady ? 'translateY(0)' : 'translateY(2rem)' 
                }}
                className="w-full max-w-[85vw] md:max-w-[60vw] lg:max-w-[50vw] h-auto object-contain transition-all duration-[1500ms] ease-out"
            />
        </div>

        {/* Enter Button */}
        <div 
            style={{ 
                opacity: isReady ? 1 : 0, 
                transform: isReady ? 'translateY(0)' : 'translateY(1rem)',
                pointerEvents: isReady ? 'auto' : 'none'
            }}
            className="transition-all duration-1000 ease-out delay-[2000ms]"
        >
            <button
              onClick={onEnter}
              className="group relative px-8 py-3 text-white border border-white/50 overflow-hidden hover:bg-white hover:text-black transition-all duration-500 rounded-full"
            >
              <span className="relative z-10 text-lg uppercase tracking-widest font-light">
                {lang === 'en' ? 'Enter' : 'Weiter'}
              </span>
            </button>
        </div>
      </div>
    </div>
  );
};