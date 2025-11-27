import React from 'react';
import { ArrowRight } from 'lucide-react';
import FadeIn from './FadeIn';

const AboutSection: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto border-t border-dashed border-black/10">
      <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-[80vh]">
        
        {/* Left Content Column */}
        <div className="col-span-1 md:col-span-4 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-r border-dashed border-black/10 relative order-2 md:order-1">
          <div className="md:sticky md:top-32">
            <FadeIn delay={100} variant="text">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 md:mb-8">
                Your Event, Your Vibe
              </h2>
            </FadeIn>
            
            <FadeIn delay={300} variant="text">
              <p className="font-sans text-sm md:text-base leading-relaxed text-gray-700 mb-8 max-w-md">
                I get it—you want music that actually hits. No awkward silences, no outdated playlists, just the songs you and your friends actually want to hear. Whether it's a school dance, party, or any event in Southern Utah, I'll bring the energy and keep everyone on the dance floor all night.
              </p>
            </FadeIn>

            <button 
              onClick={scrollToContact}
              className="group bg-black text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="col-span-1 md:col-span-8 relative h-[50vh] md:h-auto overflow-hidden order-1 md:order-2 bg-gray-200">
          <img 
            src="/me.png" 
            alt="DJ Ozzy" 
            className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-700 ease-in-out"
          />
          {/* Overlay gradient for style */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-50"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;