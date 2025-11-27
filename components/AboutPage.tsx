import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto border-t border-dashed border-black/10 min-h-screen">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
        
        {/* Left Content Column */}
        <div className="order-2 lg:order-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center lg:border-r border-dashed border-black/10 bg-brand-beige">
          <div className="max-w-xl mx-auto lg:mx-0">
            <FadeIn delay={100} variant="text">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 md:mb-8 lg:mb-10">
                My Story
              </h2>
            </FadeIn>
            
            <FadeIn delay={300} variant="text">
              <div className="space-y-4 md:space-y-6">
                <p className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  Growing up I had the privilege to be class president for three years and Student Body President at Snow Canyon High School in St. George. One of the best parts of the job was putting together dances. The chance to after a long day to connect with all my friends and dance to music we loved was the best.
                </p>
                <p className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  However there was always one problem: As a student council we couldn't find any DJ that understood what we wanted to hear, brought the right energy, and someone we could afford and trust.
                </p>
                <p className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  My senior year when my frustration peaked I finally decided why not me? I have the energy, know what people want to hear, have the background, and could fit in anyone's budget. My goal is to give everyone in Southern Utah an opportunity to make priceless memories with the people they love, with fresh updated music, and to be someone that can be trusted and relied on.
                </p>
              </div>
            </FadeIn>

            <button 
              onClick={scrollToContact}
              className="mt-8 md:mt-10 group bg-black text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Right Image Column - Split into two images */}
        <div className="order-1 lg:order-2 relative flex flex-col">
          {/* About Image - Top */}
          <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-1/2 overflow-hidden">
            <img 
              src="/About.png" 
              alt="DJ Ozzy" 
              className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-700 ease-in-out"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Tan Dividing Line */}
          <div className="h-2 md:h-3 bg-brand-beige"></div>
          
          {/* Party Image - Bottom */}
          <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-1/2 overflow-hidden">
            <img 
              src="/Party.png" 
              alt="Party atmosphere" 
              className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-700 ease-in-out"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
