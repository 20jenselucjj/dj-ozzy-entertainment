import React from 'react';

const HeroSection: React.FC = () => {
  const [content, setContent] = React.useState({
    heroLine1: 'Party',
    heroLine2: 'With',
    heroLine3: 'DJ Ozzy',
    heroTagline: 'FOR THE YOUTH BY THE YOUTH'
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setContent({
            heroLine1: data.settings.heroLine1,
            heroLine2: data.settings.heroLine2,
            heroLine3: data.settings.heroLine3,
            heroTagline: data.settings.heroTagline
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20 md:py-32 flex flex-col justify-center items-center text-center min-h-[60vh] md:min-h-[80vh]">
      <div className="w-full relative z-10">
        {/* Massive typographic layout */}
        {/* Adjusted sizes to ensure no clipping occurs on mobile or full screen */}
        <h1 className="font-serif leading-[1.1] tracking-tight uppercase flex flex-col items-center w-full overflow-visible">
            {/* Staggered layout with Shimmer and Slow Reveal Effects */}
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-left pl-2 md:pl-8 py-3 md:py-4 opacity-0 animate-text-reveal delay-100 overflow-visible">
              <span className="shimmer-text animate-shimmer">{content.heroLine1}</span>
            </span>
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-center -mt-3 md:-mt-4 py-2 opacity-0 animate-text-reveal delay-300 overflow-visible">
              <span className="shimmer-text animate-shimmer">{content.heroLine2}</span>
            </span>
            <span className="text-[10vw] md:text-[8vw] lg:text-[7vw] block w-full text-right pr-2 md:pr-8 -mt-3 md:-mt-4 py-3 md:py-4 opacity-0 animate-text-reveal delay-500 overflow-visible">
              <span className="shimmer-text animate-shimmer">{content.heroLine3}</span>
            </span>
        </h1>
        

      </div>
      
      <div className="mt-12 md:mt-20 text-center max-w-4xl mx-auto opacity-0 animate-text-reveal delay-1000">
        <p className="text-2xl md:text-2xl lg:text-2xl text-gray-600 uppercase tracking-wider font-serif">
            {content.heroTagline}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;