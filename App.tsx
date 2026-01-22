import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TEXT_CONTENT } from './constants';
import { Language } from './types';
import { Intro } from './components/Intro';
import { Navigation } from './components/Navigation';

// TODO: REPLACE THESE PATHS WITH YOUR REAL IMAGE FILES
// Suche nach "TODO_REPLACE" um alle Stellen zu finden.
const ASSETS = {
  poster: 'assets/NON_Poster_NoCredits.jpg', // TODO_REPLACE_WITH_POSTER_IMAGE
  vincent: 'assets/Vincent-Graf.jpg',        // TODO_REPLACE_WITH_DIRECTOR_IMAGE
  stills: [
    'assets/Nonna_Still_(c)_Vincent_Graf-1.jpg', // TODO_REPLACE_WITH_STILL_1
    'assets/Nonna_Still_(c)_Vincent_Graf-2.jpg', // TODO_REPLACE_WITH_STILL_2
    'assets/Nonna_Still_(c)_Vincent_Graf-3.jpg', // TODO_REPLACE_WITH_STILL_3
    'assets/Nonna_Still_(c)_Vincent_Graf-4.jpg', // TODO_REPLACE_WITH_STILL_4
    'assets/Nonna_Still_(c)_Vincent_Graf-5.jpg'  // TODO_REPLACE_WITH_STILL_5
  ]
};

// Mapping for Technical Specs Translations
const SPEC_LABELS: Record<Language, Record<string, string>> = {
  en: {
    duration: "Duration",
    resolution: "Resolution",
    framerate: "Framerate",
    aspectRatio: "Aspect Ratio",
    sound: "Sound",
    language: "Language",
    subtitles: "Subtitles"
  },
  de: {
    duration: "Dauer",
    resolution: "Auflösung",
    framerate: "Framerate",
    aspectRatio: "Seitenverhältnis",
    sound: "Ton",
    language: "Sprache",
    subtitles: "Untertitel"
  }
};

// All possible sections
const ALL_SECTIONS = ['film', 'quotes', 'stills', 'director', 'credits'];

// --- REUSABLE COMPONENTS ---

const FullScreenModal = ({ isOpen, onClose, title, children }: React.PropsWithChildren<{ isOpen: boolean; onClose: () => void; title: string }>) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] bg-[#f5f5f4] text-stone-900 flex flex-col animate-[fadeOnly_0.3s_ease-out]">
        <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white shrink-0">
            <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:text-[#F8C300] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="overflow-y-auto p-6 grow">
            {children}
        </div>
    </div>
  );
};

const ModalButton = ({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left py-4 border-b border-stone-300 hover:border-[#F8C300] group transition-colors ${className}`}
    >
        <div className="flex justify-between items-center">
            <span className="font-serif text-2xl text-stone-800 group-hover:text-[#F8C300] transition-colors">{label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-[#F8C300]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
        </div>
    </button>
);

const MobileInfiniteCarousel = ({ 
    children, 
    className = "", 
    indicatorColor = "bg-black", 
    landscapeOverlayDots = true 
}: { 
    children?: React.ReactNode, 
    className?: string, 
    indicatorColor?: string, 
    landscapeOverlayDots?: boolean 
}) => {
    const items = React.Children.toArray(children);
    const length = items.length;
    // Items layout: [LastClone, ...Originals, FirstClone]
    const extendedItems = [items[length - 1], ...items, items[0]];
    
    const [activeInternalIndex, setActiveInternalIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Handle the infinite jump logic after transition completes
    useEffect(() => {
        if (!isTransitioning) return;

        const transitionDuration = 300;
        const timer = setTimeout(() => {
            setIsTransitioning(false);
            if (activeInternalIndex === extendedItems.length - 1) {
                // We are at the cloned first item (end of list), jump to real first item
                setActiveInternalIndex(1); 
            } else if (activeInternalIndex === 0) {
                // We are at the cloned last item (start of list), jump to real last item
                setActiveInternalIndex(extendedItems.length - 2); 
            }
        }, transitionDuration);

        return () => clearTimeout(timer);
    }, [activeInternalIndex, isTransitioning, extendedItems.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            next();
        } else if (distance < -minSwipeDistance) {
            prev();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const next = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveInternalIndex(prev => prev + 1);
    };

    const prev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveInternalIndex(prev => prev - 1);
    };

    // Calculate real index for dots
    let realIndex = activeInternalIndex - 1;
    if (activeInternalIndex === 0) realIndex = length - 1;
    if (activeInternalIndex === extendedItems.length - 1) realIndex = 0;

    // Logic for dots position in landscape: Absolute overlay (default) or Block (to shrink image)
    const dotsClasses = landscapeOverlayDots 
        ? "landscape:mb-2 landscape:absolute landscape:bottom-0 landscape:w-full"
        : "landscape:mb-2 landscape:w-full landscape:shrink-0";

    return (
        <div 
            className={`overflow-hidden relative w-full h-full flex flex-col ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-1 relative overflow-hidden">
                <div 
                    className="flex h-full w-full"
                    style={{
                        transform: `translateX(-${activeInternalIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 300ms ease-out' : 'none'
                    }}
                >
                    {extendedItems.map((child, index) => (
                        <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center p-4">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Indicators */}
            <div className={`h-8 flex items-center justify-center gap-2 shrink-0 mb-4 z-10 ${dotsClasses}`}>
                 {items.map((_, idx) => (
                     <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${realIndex === idx ? `${indicatorColor} opacity-100 scale-125` : `${indicatorColor} opacity-30`}`} 
                     />
                 ))}
            </div>
        </div>
    );
};

// --- FullScreen Image Viewer ---
const FullScreenImageViewer = ({ 
    images, 
    initialIndex, 
    onClose 
}: { 
    images: string[], 
    initialIndex: number, 
    onClose: () => void 
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const lastTap = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (isZoomed) return; // Disable swipe when zoomed
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrev();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsZoomed(false); // Reset zoom on navigate
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsZoomed(false);
    };

    const toggleZoom = () => {
        setIsZoomed(prev => !prev);
    };

    // Custom double tap for mobile/touch
    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
            toggleZoom();
        }
        lastTap.current = now;
    };

    return (
        <div 
            className="fixed inset-0 z-[150] bg-black flex items-center justify-center animate-[fadeOnly_0.2s_ease-out]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 z-[160] text-white/70 hover:text-[#F8C300] p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                    src={images[currentIndex]} 
                    alt="Fullscreen"
                    onClick={handleDoubleTap}
                    onDoubleClick={toggleZoom}
                    className={`
                        transition-all duration-500 ease-in-out cursor-zoom-in
                        ${isZoomed ? 'w-full h-full object-cover cursor-zoom-out' : 'w-full h-full object-contain p-2 md:p-8'}
                    `}
                />
            </div>
            
            {/* Navigation Hints (Optional, simple arrows for desktop mostly) */}
            {!isZoomed && (
                <>
                    <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 hidden md:block transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                    <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 hidden md:block transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                </>
            )}
        </div>
    );
};


const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('de');
  const [introDismissed, setIntroDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Viewport State for responsive Logic
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to match mobile-first logic safely
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter sections based on viewport. Hide 'quotes' on desktop.
  const visibleSections = isMobile 
    ? ALL_SECTIONS 
    : ALL_SECTIONS.filter(s => s !== 'quotes');
  
  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Gallery specific state
  const [isHovering, setIsHovering] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  
  // Fullscreen Viewer State
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Marquee specific state
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLDivElement>(null);
  const marqueeState = useRef({
    pos: 0,
    speed: 0.6,
    targetSpeed: 0.6,
    isHovering: false,
    isDragging: false,
    startX: 0,
    dragStartPos: 0
  });

  // Contact Form state
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showTrailer, setShowTrailer] = useState(false);
  const touchStartY = useRef<number>(0);

  const content = TEXT_CONTENT[lang];

  // Helper to map index to section ID
  const getActiveSectionId = (idx: number) => {
    return visibleSections[idx] || 'film';
  };

  const activeSection = getActiveSectionId(activeIndex);

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= visibleSections.length) return;
    setIsScrolling(true);
    setActiveIndex(index);
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const updateGalleryVisuals = useCallback(() => {
    if (!galleryRef.current) return;
    const container = galleryRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = -1;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const img = element.querySelector('img');
      if (!img) return;

      const elementCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(containerCenter - elementCenter);
      
      // Calculate closest index
      if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
      }

      const semiContainerWidth = container.clientWidth / 2;
      let brightness = 1 - (distance / semiContainerWidth) * 1.2;
      brightness = Math.max(0.3, Math.min(1, brightness));
      
      img.style.filter = `brightness(${brightness})`;
      img.style.transition = 'filter 0.3s ease-out';
    });
    
    // Update active index state if changed
    if (closestIndex !== -1) {
        setActiveGalleryIndex(prev => (prev !== closestIndex ? closestIndex : prev));
    }
  }, []);

  useEffect(() => {
    const container = galleryRef.current;
    if (!container) return;
    const onScroll = () => updateGalleryVisuals();
    container.addEventListener('scroll', onScroll);
    updateGalleryVisuals();
    return () => container.removeEventListener('scroll', onScroll);
  }, [updateGalleryVisuals]);

  useEffect(() => {
     if (activeSection === 'stills') {
         setTimeout(updateGalleryVisuals, 100);
     }
  }, [activeSection, updateGalleryVisuals]);

  const scrollGallery = (direction: 'left' | 'right') => {
      if (galleryRef.current) {
          const firstItem = galleryRef.current.firstElementChild;
          if (firstItem) {
              const itemWidth = firstItem.getBoundingClientRect().width;
              const gap = window.innerWidth >= 768 ? 32 : 16;
              const scrollAmount = itemWidth + gap;
              
              if (direction === 'left') {
                   galleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              } else {
                   galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
          }
      }
  };

  // --- SCROLL / TOUCH HANDLERS ---
  useEffect(() => {
    if (!introDismissed || showTrailer || activeModal || fullscreenIndex !== null) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      // Scroll trap logic
      let target = e.target as HTMLElement;
      let isTrapped = false;
      while (target && target !== document.body) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        if (isScrollable && target.scrollHeight > target.clientHeight) {
            const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 2;
            const isAtTop = target.scrollTop <= 0;
            if (e.deltaY > 0 && !isAtBottom) { isTrapped = true; break; }
            if (e.deltaY < 0 && !isAtTop) { isTrapped = true; break; }
        }
        target = target.parentElement as HTMLElement;
      }
      if (isTrapped) return;

      if (Math.abs(e.deltaY) > 15) {
        if (e.deltaY > 0) scrollToIndex(activeIndex + 1);
        else scrollToIndex(activeIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [introDismissed, activeIndex, isScrolling, showTrailer, activeModal, fullscreenIndex, visibleSections.length]);

  useEffect(() => {
    if (!introDismissed || showTrailer || activeModal || fullscreenIndex !== null) return;
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      // Only process vertical scroll gestures if we are NOT swiping horizontally in a carousel.
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      if (Math.abs(deltaY) > 40) {
        if (deltaY > 0) scrollToIndex(activeIndex + 1);
        else scrollToIndex(activeIndex - 1);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [introDismissed, activeIndex, isScrolling, showTrailer, activeModal, fullscreenIndex, visibleSections.length]);

  // --- MARQUEE ANIMATION (Desktop Only mainly) ---
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (!marqueeContainerRef.current || !marqueeContentRef.current) return;
      const state = marqueeState.current;
      const contentWidth = marqueeContentRef.current.offsetWidth / 2; 

      if (state.isDragging) {
         state.speed = 0; 
      } else {
          state.targetSpeed = state.isHovering ? 0 : 0.6;
          state.speed += (state.targetSpeed - state.speed) * 0.05;
          if (Math.abs(state.speed) < 0.01) state.speed = 0;
          state.pos -= state.speed;
      }
      if (state.pos <= -contentWidth) {
        state.pos += contentWidth;
        if(state.isDragging) state.dragStartPos += contentWidth;
      }
      if (state.pos > 0) {
        state.pos -= contentWidth;
        if(state.isDragging) state.dragStartPos -= contentWidth;
      }
      marqueeContainerRef.current.style.transform = `translate3d(${state.pos}px, 0, 0)`;
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMarqueeMouseDown = (e: React.MouseEvent) => {
      marqueeState.current.isDragging = true;
      marqueeState.current.startX = e.clientX;
      marqueeState.current.dragStartPos = marqueeState.current.pos;
      document.body.style.cursor = 'grabbing';
  };
  const handleMarqueeMouseMove = (e: React.MouseEvent) => {
      if (!marqueeState.current.isDragging) return;
      e.preventDefault();
      const delta = e.clientX - marqueeState.current.startX;
      marqueeState.current.pos = marqueeState.current.dragStartPos + delta;
  };
  const handleMarqueeMouseUp = () => {
      marqueeState.current.isDragging = false;
      document.body.style.cursor = '';
  };
  const handleMarqueeMouseLeave = () => {
      marqueeState.current.isDragging = false;
      marqueeState.current.isHovering = false; 
      document.body.style.cursor = '';
  };
  
  const handleNavClick = (id: string) => {
    const idx = visibleSections.indexOf(id);
    if (idx !== -1) scrollToIndex(idx);
  };

  const handleEnter = () => {
    const curtain = document.getElementById('curtain');
    if (curtain) {
      curtain.style.transform = 'translateY(-100%)';
      setTimeout(() => setIntroDismissed(true), 800);
    } else {
        setIntroDismissed(true);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('sending');
      
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
          // MOCK SIMULATION
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log("Mock Email Sent:", data);
          setFormStatus('sent');
      } catch (error) {
          console.error("Error sending email:", error);
          setFormStatus('error');
          setTimeout(() => setFormStatus('idle'), 3000); 
      }
  };

  const FestivalList = ({ className }: { className?: string }) => (
    <div className={`space-y-4 ${className}`}>
        {content.festivals.map((fest, i) => {
            const parts = fest.split('\n');
            const name = parts[0];
            const details = parts.slice(1).join('\n');
            return (
                <div key={i} className="border-l-4 border-[#F8C300] pl-4 py-1 leading-tight">
                    <span className="block font-serif text-xl font-bold text-stone-900">{name}</span>
                    {details && <span className="block text-sm uppercase tracking-widest text-stone-500 mt-1 font-sans">{details}</span>}
                </div>
            );
        })}
    </div>
  );

  const trailerSrc = lang === 'en' 
    ? "https://player.vimeo.com/video/1128643339?badge=0&autopause=0&player_id=0&app_id=58479"
    : "https://player.vimeo.com/video/1128643201?badge=0&autopause=0&player_id=0&app_id=58479";
    
  const trailerTitle = lang === 'en' ? "Nonna TRAILER (english)" : "Nonna TRAILER (deutsch)";

  // Prepare Stills Chunks for Mobile Portrait (Groups of 2)
  const portraitStillsChunks = [];
  for (let i = 0; i < ASSETS.stills.length; i += 2) {
    portraitStillsChunks.push(ASSETS.stills.slice(i, i + 2));
  }

  return (
    <div className="bg-[#f5f5f4] h-screen w-screen text-[#1c1917] overflow-hidden relative">

      {/* Intro & Modals */}
      <div id="curtain" className="fixed inset-0 z-[100] transition-transform duration-1000 ease-in-out will-change-transform pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
            {!introDismissed && <Intro onEnter={handleEnter} lang={lang} />}
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
           <div className="relative w-full max-w-5xl bg-black shadow-2xl border border-stone-800" onClick={(e) => e.stopPropagation()}>
               <button onClick={() => setShowTrailer(false)} className="absolute -top-12 right-0 text-white/70 hover:text-[#F8C300] flex items-center gap-2 uppercase text-xs tracking-widest font-bold">
                   Close <span className="text-xl leading-none">&times;</span>
               </button>
               <div style={{padding:'54.05% 0 0 0', position:'relative'}}>
                   <iframe src={trailerSrc} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerPolicy="strict-origin-when-cross-origin" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} title={trailerTitle}></iframe>
               </div>
           </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenIndex !== null && (
          <FullScreenImageViewer 
            images={ASSETS.stills}
            initialIndex={fullscreenIndex}
            onClose={() => setFullscreenIndex(null)}
          />
      )}

      {/* FULLSCREEN MODALS for Mobile Content */}
      <FullScreenModal isOpen={activeModal === 'synopsis'} onClose={() => setActiveModal(null)} title="Synopsis">
          <div className="prose prose-stone prose-lg leading-loose">{content.synopsis}</div>
      </FullScreenModal>
      
      <FullScreenModal isOpen={activeModal === 'festivals'} onClose={() => setActiveModal(null)} title="Festivals">
          <FestivalList />
      </FullScreenModal>

      <FullScreenModal isOpen={activeModal === 'statement'} onClose={() => setActiveModal(null)} title="Director's Statement">
          <p className="text-lg leading-relaxed text-stone-600">{content.directorStatement}</p>
      </FullScreenModal>

      <FullScreenModal isOpen={activeModal === 'bio'} onClose={() => setActiveModal(null)} title={lang === 'en' ? "Biography" : "Biografie"}>
          <p className="text-stone-600 leading-relaxed">{content.bio}</p>
      </FullScreenModal>

      <FullScreenModal isOpen={activeModal === 'filmography'} onClose={() => setActiveModal(null)} title={lang === 'en' ? "Filmography" : "Filmografie"}>
         <ul className="space-y-4 text-stone-600 font-mono">
             {content.filmography.map((film, i) => <li key={i}>{film}</li>)}
         </ul>
      </FullScreenModal>

      <FullScreenModal isOpen={activeModal === 'specs'} onClose={() => setActiveModal(null)} title={lang === 'en' ? "Technical Specifications" : "Technische Daten"}>
          <div className="grid grid-cols-1 gap-y-4 font-mono text-stone-600">
             {Object.entries(content.specs).map(([key, val]) => (
                 <div key={key} className="border-b border-stone-200 pb-2">
                     <span className="block text-xs uppercase text-stone-400 mb-1">{SPEC_LABELS[lang][key] || key}</span>
                     <span className="text-stone-900">{val}</span>
                 </div>
             ))}
          </div>
      </FullScreenModal>
      
      <FullScreenModal isOpen={activeModal === 'credits'} onClose={() => setActiveModal(null)} title="Credits">
         <div className="space-y-6">
             <div><span className="block text-xs uppercase text-stone-400">Buch, Regie, Kamera, Montage, Produktion</span><span className="block font-medium text-stone-900">Vincent Graf</span></div>
             <div><span className="block text-xs uppercase text-stone-400">Color Grading</span><span className="block font-medium text-stone-900">Fabiana Cardalda</span></div>
             <div><span className="block text-xs uppercase text-stone-400">Sound Design</span><span className="block font-medium text-stone-900">Luisa Kremer</span></div>
             <div><span className="block text-xs uppercase text-stone-400">Mischung</span><span className="block font-medium text-stone-900">Ralf Schipke</span></div>
             <div className="pt-4 border-t border-stone-300">
                 <span className="block text-xs uppercase text-stone-400 mb-2">Produktion</span>
                 <p>Academy of Media Arts Cologne (KHM)<br/>Ute Dilger<br/>Heumarkt 14, 50667 Köln</p>
             </div>
         </div>
      </FullScreenModal>

      {/* Contact Form Modal */}
      <FullScreenModal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title={lang === 'en' ? 'Get in Touch' : 'Kontakt'}>
         <div className="p-4 bg-white shadow-none md:shadow-lg mt-4 max-w-2xl mx-auto">
             {formStatus === 'sent' ? (
                 <div className="text-center italic font-serif py-12 text-xl text-[#F8C300] bg-stone-50">
                    {lang === 'en' ? 'Thank you. Your message has been sent.' : 'Danke. Ihre Nachricht wurde versendet.'}
                 </div>
             ) : (
                 <form onSubmit={handleContactSubmit} className="space-y-6">
                     <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">{lang === 'en' ? 'Your Email' : 'Deine Email'}</label>
                        <input name="email" type="email" required className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#F8C300] transition-colors bg-transparent" />
                     </div>
                     <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">{lang === 'en' ? 'Subject' : 'Betreff'}</label>
                        <input name="subject" type="text" required className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#F8C300] transition-colors bg-transparent" />
                     </div>
                     <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">{lang === 'en' ? 'Message' : 'Nachricht'}</label>
                        <textarea name="message" rows={5} required className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-[#F8C300] transition-colors resize-none bg-transparent"></textarea>
                     </div>
                     <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-stone-900 text-white py-4 uppercase text-xs font-bold hover:bg-[#F8C300] hover:text-black transition-colors disabled:opacity-50">
                         {formStatus === 'sending' ? (lang === 'en' ? 'Sending...' : 'Senden...') : (lang === 'en' ? 'Send Message' : 'Absenden')}
                     </button>
                     {formStatus === 'error' && (
                         <p className="text-red-500 text-xs text-center uppercase tracking-widest mt-2">
                             {lang === 'en' ? 'Something went wrong. Please try again.' : 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'}
                         </p>
                     )}
                 </form>
             )}
         </div>
      </FullScreenModal>

      <Navigation lang={lang} setLang={setLang} activeSection={activeSection} onNavigate={handleNavClick} />

      {/* FAB */}
      <button
          onClick={() => setActiveModal('contact')}
          className={`
            fixed right-6 bottom-6 z-[60] bg-[#F8C300] text-stone-900 
            w-12 h-12 rounded-full flex items-center justify-center shadow-xl
            hover:bg-stone-900 hover:text-[#F8C300] transition-all duration-1000 ease-in-out
            ${activeSection === 'quotes' ? 'bg-white' : ''}
            ${activeSection === 'credits' ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}
          `}
      >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
      </button>

      {/* Main Slider */}
      <div 
        className="h-full w-full transition-transform duration-1000 ease-in-out will-change-transform"
        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
      >
        
        {/* SECTION 0: FILM */}
        <section className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#f5f5f4]">
          <div className="md:hidden w-full h-full flex flex-col landscape:flex-row relative pt-16">
             <div className="flex-1 w-full landscape:w-1/2 landscape:h-full relative flex items-center justify-center bg-[#f5f5f4]">
                 <img src={ASSETS.poster} alt="Poster" className="w-full h-full object-cover object-top landscape:object-contain landscape:max-h-[90vh]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f4] via-transparent to-transparent landscape:hidden"></div>
             </div>
             <div className="w-full landscape:w-1/2 px-6 pb-24 z-10 landscape:pb-0 landscape:pr-20 landscape:h-full landscape:overflow-hidden landscape:flex landscape:flex-col">
                 <div className="landscape:flex-1 landscape:flex landscape:items-center">
                    <h2 className="text-xl font-serif italic text-stone-900 leading-snug mb-6 landscape:mb-0 border-l-4 border-[#F8C300] pl-4">
                        {content.logline}
                    </h2>
                 </div>
                 <div className="grid grid-cols-2 gap-3 landscape:gap-y-4 landscape:gap-x-3 landscape:pb-6">
                     <button onClick={() => setShowTrailer(true)} className="col-span-2 bg-stone-900 text-white py-3 landscape:py-2 uppercase tracking-widest text-xs font-bold">Watch Trailer</button>
                     <button onClick={() => setActiveModal('synopsis')} className="border border-stone-300 py-3 landscape:py-2 uppercase tracking-widest text-xs hover:bg-[#F8C300] transition-colors">Synopsis</button>
                     <button onClick={() => setActiveModal('festivals')} className="border border-stone-300 py-3 landscape:py-2 uppercase tracking-widest text-xs hover:bg-[#F8C300] transition-colors">Festivals</button>
                 </div>
             </div>
          </div>
          
          <div className="hidden md:flex absolute top-0 left-0 right-0 bottom-48 items-center justify-center z-10 pointer-events-none">
             <div className="pointer-events-auto max-w-7xl mx-auto w-full grid grid-cols-12 gap-12 items-start px-20 max-h-full py-10">
                <div className="col-span-4">
                  <div className="relative shadow-2xl transition-transform duration-700 hover:scale-[1.02] inline-block">
                    <img src={ASSETS.poster} alt="Nonna Movie Poster" className="w-auto max-h-[55vh] object-contain rounded-sm" />
                  </div>
                  <div className="mt-8"><FestivalList /></div>
                </div>
                
                <div className="col-span-8 flex flex-col justify-start max-h-full overflow-hidden">
                  <div className="space-y-10 overflow-y-auto pr-4 max-h-full scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                      <div className="border-l-4 border-[#F8C300] pl-6 py-2 shrink-0">
                        <h2 className="text-2xl font-serif italic text-stone-700 leading-relaxed">{content.logline}</h2>
                      </div>
                      <div className="shrink-0">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-4">Synopsis</h3>
                        <div className="prose prose-lg max-w-none whitespace-pre-line leading-loose text-left text-stone-600">{content.synopsis}</div>
                      </div>
                      <div className="pt-4 pb-2 shrink-0">
                          <button onClick={() => setShowTrailer(true)} className="inline-flex items-center space-x-3 bg-stone-900 text-white px-8 py-4 rounded-sm hover:bg-[#F8C300] hover:text-stone-900 transition-colors duration-300">
                            <span className="uppercase tracking-widest text-sm">Watch Trailer</span>
                          </button>
                      </div>
                  </div>
                </div>
             </div>
          </div>

          <div 
             className="hidden md:flex absolute bottom-0 left-0 w-full h-48 bg-[#F8C300] items-center overflow-hidden z-20 cursor-grab active:cursor-grabbing"
             onMouseEnter={() => marqueeState.current.isHovering = true}
             onMouseDown={handleMarqueeMouseDown}
             onMouseMove={handleMarqueeMouseMove}
             onMouseUp={handleMarqueeMouseUp}
             onMouseLeave={handleMarqueeMouseLeave}
          >
             <div ref={marqueeContainerRef} className="flex items-center h-full will-change-transform select-none">
                 <div ref={marqueeContentRef} className="flex shrink-0">
                     {[...content.quotes, ...content.quotes].map((quote, i) => (
                         <div key={i} className="flex-none flex items-center mx-20 text-black w-[500px] h-full pointer-events-none">
                             <div className="flex flex-col justify-center">
                                <span className="text-lg italic font-serif leading-relaxed whitespace-normal line-clamp-3">{quote.text[0]}</span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70 mt-3">– {quote.author}{quote.source ? `, ${quote.source}` : ''}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
        </section>

        {/* SECTION 1: QUOTES (Mobile Only) */}
        {visibleSections.includes('quotes') && (
            <section className="h-screen w-full bg-[#F8C300] flex items-center justify-center px-6 md:px-20 relative overflow-hidden">
                <div className="md:hidden w-full h-full pt-16 pb-20 landscape:pb-4">
                    <MobileInfiniteCarousel indicatorColor="bg-black">
                        {content.quotes.map((quote, i) => {
                            const textLength = quote.text[0].length;
                            let landscapeTextClass = 'landscape:text-3xl landscape:leading-snug'; 
                            if (textLength > 350) landscapeTextClass = 'landscape:text-base landscape:leading-tight';
                            else if (textLength > 250) landscapeTextClass = 'landscape:text-lg landscape:leading-snug';
                            else if (textLength > 150) landscapeTextClass = 'landscape:text-xl landscape:leading-snug';
                            else if (textLength > 80) landscapeTextClass = 'landscape:text-2xl landscape:leading-relaxed';

                            return (
                                <div key={i} className="text-center px-4 h-full flex flex-col justify-center landscape:h-full landscape:overflow-hidden">
                                    <p className={`font-serif text-2xl italic text-black leading-relaxed mb-6 ${landscapeTextClass}`}>"{quote.text[0]}"</p>
                                    <div className="inline-block border-t border-black/20 pt-4 landscape:pt-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-black/80">– {quote.author}</p>
                                        {quote.source && <p className="text-[10px] uppercase tracking-wider text-black/50 mt-1">{quote.source}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </MobileInfiniteCarousel>
                </div>
            </section>
        )}

        {/* SECTION 2: STILLS */}
        <section className="h-screen w-full bg-stone-900 flex flex-col justify-center relative overflow-hidden">
            
            {/* MOBILE WRAPPER - Explicitly hidden on desktop (md) to prevent landscape overlap */}
            <div className="w-full h-full md:hidden relative z-30 bg-stone-900">
                
                {/* MOBILE PORTRAIT: Stacked Double Images */}
                <div className="landscape:hidden w-full h-full pt-16 pb-20">
                    <MobileInfiniteCarousel indicatorColor="bg-white" landscapeOverlayDots={false}>
                        {portraitStillsChunks.map((pair, idx) => (
                            <div key={idx} className="w-full h-full flex flex-col p-6 gap-6 justify-center">
                                {pair.map((src, pairIdx) => {
                                    const globalIndex = idx * 2 + pairIdx;
                                    return (
                                        <div key={pairIdx} className="flex-1 w-full relative">
                                            <img 
                                                src={src} 
                                                alt={`Still ${globalIndex + 1}`} 
                                                onClick={() => setFullscreenIndex(globalIndex)}
                                                className="w-full h-full object-contain" 
                                                onError={(e) => e.currentTarget.src = `https://picsum.photos/800/450?random=${globalIndex}`} 
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </MobileInfiniteCarousel>
                </div>

                {/* MOBILE LANDSCAPE: Single Image */}
                <div className="hidden landscape:block w-full h-full landscape:pt-16 landscape:pb-6">
                     <MobileInfiniteCarousel indicatorColor="bg-white" landscapeOverlayDots={false}>
                        {ASSETS.stills.map((src, idx) => (
                             <div key={idx} className="w-full h-full flex items-center justify-center relative">
                                <img 
                                    src={src} 
                                    alt={`Still ${idx + 1}`} 
                                    onClick={() => setFullscreenIndex(idx)}
                                    className="w-full h-full object-cover landscape:object-contain" 
                                    onError={(e) => e.currentTarget.src = `https://picsum.photos/800/450?random=${idx}`} 
                                />
                             </div>
                        ))}
                     </MobileInfiniteCarousel>
                </div>
            </div>

            {/* DESKTOP: Horizontal Scroll Gallery with Buttons (Hidden on Mobile) */}
            <div className="hidden md:block w-full h-full relative group">
                <button 
                    onClick={() => scrollGallery('left')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="absolute left-0 top-0 h-full w-[20%] z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gradient-to-r from-black/50 to-transparent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button 
                    onClick={() => scrollGallery('right')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="absolute right-0 top-0 h-full w-[20%] z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gradient-to-l from-black/50 to-transparent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-12 h-12 opacity-80 hover:opacity-100 transition-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                <div 
                    ref={galleryRef} 
                    onMouseEnter={() => setIsHovering(true)} 
                    onMouseLeave={() => setIsHovering(false)} 
                    className="flex gap-8 px-[20vw] items-center w-full h-full overflow-x-auto no-scrollbar snap-x"
                >
                    {ASSETS.stills.map((src, idx) => {
                        const isActive = idx === activeGalleryIndex;
                        return (
                            <div 
                                key={idx} 
                                className={`flex-none w-[60vw] aspect-video snap-center relative shadow-2xl transition-transform duration-500 ${isActive ? 'hover:scale-[1.01] cursor-pointer' : 'cursor-default'}`} 
                                onClick={() => { if(isActive) setFullscreenIndex(idx); }}
                            >
                                <img 
                                    src={src} 
                                    alt={`Still ${idx + 1}`} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => e.currentTarget.src = `https://picsum.photos/800/450?random=${idx}`} 
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* SECTION 3: DIRECTOR */}
        <section className="h-screen w-full bg-white flex items-center justify-center px-6 md:px-20 overflow-hidden">
            <div className="md:hidden w-full h-full flex flex-col landscape:flex-row justify-center landscape:items-center pt-16 pb-24 landscape:pb-0">
                <div className="relative mb-8 landscape:mb-0 mx-auto w-48 h-48 landscape:w-1/3 landscape:h-full landscape:mx-0 landscape:max-w-xs">
                    <img src={ASSETS.vincent} className="w-full h-full object-cover grayscale rounded-full landscape:rounded-none landscape:h-full" alt="Director"/>
                    <div className="absolute inset-0 border-2 border-[#F8C300] rounded-full translate-x-2 translate-y-2 -z-10 landscape:hidden"></div>
                </div>
                <div className="space-y-4 w-full landscape:w-2/3 landscape:pl-8 landscape:pr-20 landscape:pb-16 landscape:overflow-y-auto landscape:max-h-[80vh]">
                    <ModalButton label="Director's Statement" onClick={() => setActiveModal('statement')} />
                    <ModalButton label={lang === 'en' ? "Biography" : "Biografie"} onClick={() => setActiveModal('bio')} />
                    <ModalButton label={lang === 'en' ? "Filmography" : "Filmografie"} onClick={() => setActiveModal('filmography')} />
                </div>
            </div>
            <div className="hidden md:grid max-w-6xl mx-auto w-full grid-cols-2 gap-16 items-center max-h-[90vh]">
                <div className="order-2 md:order-1 relative">
                    <img src={ASSETS.vincent} alt="Vincent Graf" className="w-full h-auto grayscale contrast-125 max-h-[80vh] object-cover" />
                    <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-[#F8C300] pointer-events-none"></div>
                </div>
                <div className="order-1 md:order-2 space-y-8 overflow-y-auto max-h-full pr-2 pb-10">
                    <h2 className="text-5xl font-serif">Director's Statement</h2>
                    <p className="text-lg leading-relaxed text-stone-600">{content.directorStatement}</p>
                    <div className="pt-8">
                        <h3 className="text-xl font-serif mb-2">{lang === 'en' ? "Bio" : "Biografie"}</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">{content.bio}</p>
                    </div>
                    <div className="pt-4">
                         <h4 className="text-xs font-bold tracking-widest uppercase mb-3">{lang === 'en' ? "Filmography" : "Filmografie"}</h4>
                         <ul className="text-xs space-y-2 text-stone-500 font-mono">
                             {content.filmography.map((film, i) => <li key={i}>{film}</li>)}
                         </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 4: CREDITS & CONTACT */}
        <section className="h-screen w-full bg-[#f5f5f4] flex items-center justify-center px-6 md:px-20 overflow-hidden">
             <div className="max-w-7xl mx-auto w-full flex flex-col h-full max-h-[95vh] pt-20 md:pt-10">
                <div className="md:hidden flex-1 flex flex-col justify-center space-y-8 pb-20 landscape:justify-start landscape:pt-4">
                     <ModalButton label={lang === 'en' ? "Technical Specifications" : "Technische Daten"} onClick={() => setActiveModal('specs')} />
                     <ModalButton label="Credits" onClick={() => setActiveModal('credits')} />
                     <ModalButton label={lang === 'en' ? 'Get in Touch' : 'Kontakt aufnehmen'} onClick={() => setActiveModal('contact')} />
                </div>
                <div className="hidden md:block flex-1 overflow-y-auto pb-8 pr-2">
                    <div className="grid grid-cols-2 gap-12 text-sm text-stone-600 mb-12">
                        <div>
                             <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#F8C300] mb-6">{lang === 'en' ? "Technical Specifications" : "Technische Daten"}</h3>
                             <div className="grid grid-cols-2 gap-y-4 font-mono">
                                 <div>{SPEC_LABELS[lang].duration}</div><div className="text-stone-900">{content.specs.duration}</div>
                                 <div>{SPEC_LABELS[lang].resolution}</div><div className="text-stone-900">{content.specs.resolution}</div>
                                 <div>{SPEC_LABELS[lang].aspectRatio}</div><div className="text-stone-900">{content.specs.aspectRatio}</div>
                                 <div>{SPEC_LABELS[lang].sound}</div><div className="text-stone-900">{content.specs.sound}</div>
                                 <div>{SPEC_LABELS[lang].language}</div><div className="text-stone-900">{content.specs.language}</div>
                                 <div>{SPEC_LABELS[lang].subtitles}</div><div className="text-stone-900">{content.specs.subtitles}</div>
                             </div>
                        </div>
                        <div>
                             <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#F8C300] mb-6">Credits</h3>
                             <div className="space-y-4">
                                 <div><span className="block text-xs uppercase text-stone-400">Buch, Regie, Kamera, Montage, Produktion</span><span className="block font-medium text-stone-900">Vincent Graf</span></div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div><span className="block text-xs uppercase text-stone-400">Color Grading</span><span className="block font-medium text-stone-900">Fabiana Cardalda</span></div>
                                     <div><span className="block text-xs uppercase text-stone-400">Sound Design</span><span className="block font-medium text-stone-900">Luisa Kremer</span></div>
                                 </div>
                                 <div><span className="block text-xs uppercase text-stone-400">Mischung</span><span className="block font-medium text-stone-900">Ralf Schipke</span></div>
                                 <div className="pt-6 border-t border-stone-300">
                                     <span className="block text-xs uppercase text-stone-400 mb-2">Produktion</span>
                                     <a href="https://www.khm.de" className="block font-serif text-lg hover:text-[#F8C300] transition-colors">Academy of Media Arts Cologne (KHM)</a>
                                     <div className="mt-2 text-xs">Ute Dilger<br/>Heumarkt 14, 50667 Köln</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                    <div className="w-full max-w-3xl mx-auto bg-white p-12 shadow-xl mb-8 mt-24 relative">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8C300] text-black px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase">
                            {lang === 'en' ? 'Get in Touch' : 'Kontakt aufnehmen'}
                         </div>
                         {formStatus === 'sent' ? (
                             <div className="p-8 bg-[#F8C300]/20 border border-[#F8C300] text-stone-900 font-serif text-2xl text-center italic">
                                 {lang === 'en' ? 'Thank you. Your message has been sent.' : 'Danke. Ihre Nachricht wurde versendet.'}
                             </div>
                         ) : (
                             <form onSubmit={handleContactSubmit} className="space-y-8">
                                 <div className="grid grid-cols-2 gap-8">
                                     <div className="group">
                                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 group-focus-within:text-[#F8C300] transition-colors">Email</label>
                                        <input name="email" type="email" required className="w-full bg-stone-50 border-b-2 border-stone-200 py-3 px-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#F8C300] focus:bg-white transition-all"/>
                                     </div>
                                     <div className="group">
                                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 group-focus-within:text-[#F8C300] transition-colors">{lang === 'en' ? 'Subject' : 'Betreff'}</label>
                                        <input name="subject" type="text" className="w-full bg-stone-50 border-b-2 border-stone-200 py-3 px-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#F8C300] focus:bg-white transition-all"/>
                                     </div>
                                 </div>
                                 <div className="group">
                                     <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 group-focus-within:text-[#F8C300] transition-colors">{lang === 'en' ? 'Message' : 'Nachricht'}</label>
                                     <textarea name="message" required rows={3} className="w-full bg-stone-50 border-b-2 border-stone-200 py-3 px-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#F8C300] focus:bg-white transition-all resize-none"></textarea>
                                 </div>
                                 <div className="text-center">
                                    <button type="submit" disabled={formStatus === 'sending'} className="inline-block bg-stone-900 text-white px-10 py-3 uppercase tracking-widest text-xs font-bold hover:bg-[#F8C300] hover:text-black transition-all duration-300 disabled:opacity-50">
                                        {formStatus === 'sending' ? (lang === 'en' ? 'Sending...' : 'Senden...') : (lang === 'en' ? 'Send Message' : 'Absenden')}
                                    </button>
                                    {formStatus === 'error' && (
                                        <p className="text-red-500 text-xs text-center uppercase tracking-widest mt-2">
                                            {lang === 'en' ? 'Something went wrong. Please try again.' : 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'}
                                        </p>
                                    )}
                                 </div>
                             </form>
                         )}
                    </div>
                </div>
                <footer className="py-6 text-center text-stone-400 text-xs uppercase tracking-widest shrink-0 border-t border-stone-200">
                    © {new Date().getFullYear()} NONNA - A film by Vincent Graf
                </footer>
            </div>
        </section>

      </div>
    </div>
  );
};

export default App;