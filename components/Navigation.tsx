import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Language } from '../types';

interface NavigationProps {
  lang: Language;
  setLang: (l: Language) => void;
  activeSection: string;
  onNavigate: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ lang, setLang, activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textHeight, setTextHeight] = useState<number | undefined>(undefined);
  const textRef = useRef<HTMLSpanElement>(null);
  const mobileTextRef = useRef<HTMLSpanElement>(null);
  const [mobileTextWidth, setMobileTextWidth] = useState<number | undefined>(undefined);

  // Refs for intelligent hover handling
  const navRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Responsive state for Navigation
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Updated Nav Items including the new 'Events' and 'Quotes' section
  const allNavItems = [
    { id: 'film', label: lang === 'en' ? 'The Film' : 'Der Film' },
    { id: 'events', label: lang === 'en' ? 'Events' : 'Termine' },
    { id: 'quotes', label: lang === 'en' ? 'Reviews' : 'Stimmen' },
    { id: 'stills', label: 'Stills' },
    { id: 'director', label: lang === 'en' ? 'Director' : 'Regie' },
    { id: 'credits', label: lang === 'en' ? 'Credits' : 'Credits' },
  ];

  // Filter out quotes if not mobile
  const navItems = isMobile ? allNavItems : allNavItems.filter(item => item.id !== 'quotes');

  const activeLabel = allNavItems.find(item => item.id === activeSection)?.label;
  
  // Logic for color inversion on the Yellow Quotes section
  const isYellowSection = activeSection === 'quotes';
  const isDarkSection = activeSection === 'stills';
  
  // Desktop: Vertical measuring
  const measureHeight = () => {
    if (textRef.current) {
        const height = textRef.current.scrollHeight;
        if (height > 0) setTextHeight(height);
    }
  };

  // Mobile: Horizontal measuring
  const measureWidth = () => {
      if (mobileTextRef.current) {
          const width = mobileTextRef.current.scrollWidth;
          if (width > 0) setMobileTextWidth(width);
      }
  }

  useLayoutEffect(() => {
    measureHeight();
    measureWidth();
  }, [activeLabel, lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
        measureHeight();
        measureWidth();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleMenu = () => setIsOpen(!isOpen);

  // --- STYLES ---
  // If we are on the Yellow section or Stills section (Dark), main elements should be White.
  const triggerTextColor = (isYellowSection || isDarkSection) ? 'text-white' : 'text-black';
  const triggerAccentColor = isYellowSection ? 'text-white' : 'text-[#F8C300]';
  const triggerLineColor = isYellowSection ? 'bg-white' : 'bg-[#F8C300]';

  return (
    <>
      {/* ================= MOBILE NAVIGATION (Top Horizontal) ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 z-40 flex items-center justify-between px-6 bg-transparent pointer-events-none">
          
          {/* Menu Trigger / Active Section Display */}
          <div 
            onClick={handleToggleMenu} 
            className="flex items-center gap-4 pointer-events-auto cursor-pointer"
          >
             <span className={`text-xs font-serif tracking-[0.2em] font-bold ${triggerTextColor} transition-colors duration-500`}>
                MENU
             </span>
             
             {/* Horizontal Line */}
             <span className={`h-[2px] w-8 ${triggerLineColor} opacity-80 transition-colors duration-500`}></span>

             {/* Smooth Width Wrapper for Active Label */}
             <div 
                style={{ width: mobileTextWidth !== undefined ? `${mobileTextWidth}px` : 'auto' }}
                className="transition-[width] duration-500 ease-in-out overflow-hidden h-6 flex items-center"
             >
                <span 
                    ref={mobileTextRef}
                    key={activeLabel}
                    className={`text-xl font-bold uppercase tracking-widest ${triggerAccentColor} whitespace-nowrap animate-[fadeOnly_0.8s_ease-out] block transition-colors duration-500`}
                >
                    {activeLabel}
                </span>
             </div>
          </div>

          {/* Language Toggle - Single Button - Shows TARGET language */}
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className={`font-serif text-lg font-bold pointer-events-auto transition-colors duration-500 ${triggerAccentColor} p-4 -mr-4`}
          >
            {lang === 'en' ? 'DE' : 'EN'}
          </button>
      </div>

      {/* ================= DESKTOP NAVIGATION (Right Vertical) ================= */}
      
      {/* 1. Language Switcher (Always visible, high z-index) */}
      <div 
        ref={langRef}
        onMouseLeave={(e) => {
            // When leaving the language buttons, check if we are entering the Nav menu.
            // If so, keep the menu open. If we leave to empty space, close it.
            if (isOpen && navRef.current && !navRef.current.contains(e.relatedTarget as Node)) {
                setIsOpen(false);
            }
        }}
        className="hidden md:flex fixed top-8 right-32 z-[60] items-center gap-4 pointer-events-auto"
      >
          <button
              onClick={() => setLang('en')}
              className={`font-serif text-lg hover:text-[#F8C300] transition-colors duration-500 p-2 -m-2 ${lang === 'en' ? 'font-bold underline decoration-[#F8C300] underline-offset-4 text-[#F8C300]' : (isYellowSection || isDarkSection ? 'text-white/60' : 'text-stone-400')}`}
          >
              EN
          </button>
          <span className={`transition-colors duration-500 ${isYellowSection || isDarkSection ? 'text-white/30' : 'text-stone-300'}`}>/</span>
          <button
              onClick={() => setLang('de')}
              className={`font-serif text-lg hover:text-[#F8C300] transition-colors duration-500 p-2 -m-2 ${lang === 'de' ? 'font-bold underline decoration-[#F8C300] underline-offset-4 text-[#F8C300]' : (isYellowSection || isDarkSection ? 'text-white/60' : 'text-stone-400')}`}
          >
              DE
          </button>
      </div>

      {/* 2. INVISIBLE HOVER ZONE (The "Trigger Area") */}
      {/* CHANGED: top-0 to top-32 to create a "safe zone" for language buttons */}
      <div 
        className="hidden md:block fixed top-32 right-0 bottom-0 w-32 z-40 bg-transparent"
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* 3. VISUAL TRIGGER (Text & Lines) */}
      {/* This is purely visual now and slides out when menu opens. It does NOT handle mouse events to prevent flickering. */}
      <div 
          className={`
          hidden md:flex fixed right-0 top-0 h-full items-center justify-end z-40 pointer-events-none pr-12
          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? 'translate-x-32 opacity-0' : 'translate-x-0 opacity-100'}
          `}
      >
          <div className="rotate-180 [writing-mode:vertical-rl] flex items-center gap-6">
              <span className={`text-base font-serif tracking-[0.2em] font-bold ${triggerTextColor} transition-colors duration-500`}>
                  MENU
              </span>
              
              <div 
                  style={{ height: textHeight !== undefined ? `${textHeight}px` : 'auto' }}
                  className="transition-[height] duration-500 ease-in-out overflow-hidden flex items-center justify-center"
              >
                  <span 
                      ref={textRef}
                      key={activeLabel}
                      className={`text-5xl font-bold uppercase tracking-widest ${triggerAccentColor} whitespace-nowrap animate-[fadeOnly_0.8s_ease-out] block transition-colors duration-500`}
                  >
                      {activeLabel}
                  </span>
              </div>

              <span className={`w-[2px] h-16 ${triggerLineColor} opacity-80 block mx-auto transition-colors duration-500`}></span>
          </div>
      </div>

      {/* ================= SHARED MENU OVERLAY ================= */}
      <nav 
        ref={navRef}
        className={`
          fixed top-0 right-0 h-full bg-white/95 backdrop-blur-md shadow-2xl z-50
          flex flex-col justify-center px-12 md:px-20 min-w-[100vw] md:min-w-[400px]
          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onMouseLeave={(e) => {
            // Only close when leaving the MENU area (which covers the trigger area)
            // But NOT if we are moving to the language buttons (which are technically outside this nav container)
            if (langRef.current && langRef.current.contains(e.relatedTarget as Node)) {
                return;
            }
            if (window.matchMedia('(min-width: 768px)').matches) setIsOpen(false);
        }}
      >
        <div className="flex flex-col gap-8 items-start">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`
                group text-3xl md:text-4xl font-serif text-left transition-colors duration-300
                ${activeSection === item.id ? 'text-black font-bold' : 'text-stone-400 hover:text-[#F8C300]'}
              `}
            >
              <span className="relative">
                {item.label}
                {activeSection === item.id && (
                    <span className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F8C300]" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Close Button (Mobile Only) */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-6 text-stone-900 p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
    </>
  );
};