import React from 'react';
import { ArrowRight } from 'lucide-react';
import FadeIn from './FadeIn';

const AboutSection: React.FC = () => {
  const [content, setContent] = React.useState({
    meImage: '/me.png',
    aboutTitle: 'Your Event, Your Vibe',
    aboutDescription: "I get it—you want music that actually hits. No awkward silences, no outdated playlists, just the songs you and your friends actually want to hear. Whether it's a school dance, party, or any event in Southern Utah, I'll bring the energy and keep everyone on the dance floor all night."
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setContent({
            meImage: data.settings.meImage || '/me.png',
            aboutTitle: data.settings.aboutTitle,
            aboutDescription: data.settings.aboutDescription
          });
        }
      })
      .catch(() => {});
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col md:flex-row md:min-h-[80vh]">
        
        {/* Left Content Column */}
        <div className="md:w-1/3 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative order-2 md:order-1">
          <div className="md:sticky md:top-32">
            <FadeIn delay={100} variant="text">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 md:mb-8">
                {content.aboutTitle}
              </h2>
            </FadeIn>
            
            <FadeIn delay={300} variant="text">
              <p className="font-sans text-sm md:text-base leading-relaxed text-gray-700 mb-8 max-w-md">
                {content.aboutDescription}
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
        <div className="md:w-2/3 relative h-[50vh] md:h-auto overflow-hidden order-1 md:order-2 bg-gray-200">
          <img 
            src={content.meImage} 
            alt="DJ Ozzy performing at an event with professional DJ equipment and lighting setup" 
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