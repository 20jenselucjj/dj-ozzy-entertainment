import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20 md:py-32 flex flex-col justify-center items-center text-center min-h-[60vh] md:min-h-[80vh]">
      <div className="w-full relative z-10">
        {/* Massive typographic layout */}
        {/* Adjusted sizes to ensure no clipping occurs on mobile or full screen */}
        <h1 className="font-serif leading-[1.1] tracking-tight uppercase flex flex-col items-center w-full overflow-visible">
            {/* Staggered layout with Shimmer and Slow Reveal Effects */}
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-left pl-2 md:pl-8 py-3 md:py-4 opacity-0 animate-text-reveal delay-100 overflow-visible">
              <span className="shimmer-text animate-shimmer">Party</span>
            </span>
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-center -mt-3 md:-mt-4 py-2 opacity-0 animate-text-reveal delay-300 overflow-visible">
              <span className="shimmer-text animate-shimmer">With</span>
            </span>
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-right pr-2 md:pr-8 -mt-3 md:-mt-4 py-3 md:py-4 opacity-0 animate-text-reveal delay-500 overflow-visible">
              <span className="shimmer-text animate-shimmer">DJ Ozzy</span>
            </span>
        </h1>
        
        {/* Horizontal dividing line matching the grid aesthetic */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full border-t border-dashed border-black/10 -z-10 transform -translate-y-1/2 opacity-0 animate-fade-in delay-700"></div>
      </div>
      
      <div className="mt-12 md:mt-20 text-center max-w-lg mx-auto opacity-0 animate-text-reveal delay-1000">
        <p className="text-sm md:text-base text-gray-600 uppercase tracking-widest">
            Fresh Music. Good Vibes. Unforgettable Nights.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;