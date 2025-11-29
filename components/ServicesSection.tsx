import React from 'react';
import { Music, Speaker, Mic2 } from 'lucide-react';
import FadeIn from './FadeIn';

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Your Music, Your Way",
      subtitle: "Custom Playlists",
      description: "Tell me what you want to hear and I'll make it happen. Whether you're into the latest hits, throwbacks, or a mix of everything, I'll put together a playlist that keeps everyone vibing all night long.",
      icon: <Music size={28} />
    },
    {
      title: "Quality Sound & Lights",
      subtitle: "Professional Setup",
      description: "I bring legit equipment that sounds amazing and looks even better. Clear audio, awesome lighting effects—everything you need to turn your venue into the place to be.",
      icon: <Speaker size={28} />
    },
    {
      title: "Reading the Room",
      subtitle: "Keeping It Live",
      description: "I know when to turn it up and when to bring it down. I'll watch the crowd and adjust on the fly to make sure everyone's having a good time, not just standing around.",
      icon: <Mic2 size={28} />
    }
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto py-20 md:py-32 px-4 md:px-8 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
       {/* Header */}
       <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
          <div className="max-w-2xl">
              <FadeIn variant="text">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3 block">Services</span>
              </FadeIn>
              <FadeIn delay={100} variant="text">
                <h2 className="font-serif text-4xl md:text-6xl text-brand-dark leading-tight">What I Bring</h2>
              </FadeIn>
          </div>
          <FadeIn delay={200} variant="text">
            <p className="max-w-xs text-sm text-gray-600 md:text-right">
              Everything you need for an epic night without the hassle or crazy prices.
            </p>
          </FadeIn>
       </div>

       {/* Services */}
       <div className="flex flex-col md:flex-row gap-12 md:gap-0">
          {services.map((service, index) => (
             <div key={index} className={`
                pt-8 md:pt-12 md:pb-12 md:flex-1
                ${index !== services.length - 1 ? 'md:pr-12' : ''}
                ${index !== 0 ? 'md:pl-12' : ''}
                relative group flex flex-col h-full justify-between
             `}>
                <FadeIn delay={200 + (index * 100)} variant="text">
                   <div className="mb-8 p-4 inline-block rounded-full text-brand-dark group-hover:bg-brand-dark group-hover:text-brand-beige transition-all duration-300">
                      {service.icon}
                   </div>
                </FadeIn>
                   
                <div>
                    <FadeIn delay={300 + (index * 100)} variant="text">
                       <h3 className="font-serif text-2xl md:text-3xl mb-3">{service.title}</h3>
                    </FadeIn>
                    <FadeIn delay={400 + (index * 100)} variant="text">
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">{service.subtitle}</p>
                    </FadeIn>
                    <FadeIn delay={500 + (index * 100)} variant="text">
                       <p className="text-sm md:text-base leading-relaxed text-gray-700">
                          {service.description}
                       </p>
                    </FadeIn>
                </div>
             </div>
          ))}
       </div>
    </section>
  );
};

export default ServicesSection;