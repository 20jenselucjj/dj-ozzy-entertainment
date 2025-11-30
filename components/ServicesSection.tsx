import React from 'react';
import { Music, Speaker, Mic2 } from 'lucide-react';
import FadeIn from './FadeIn';

const ServicesSection: React.FC = () => {
  const [content, setContent] = React.useState({
    servicesTitle: 'What I Bring',
    servicesSubtitle: 'Everything you need for an epic night without the hassle or crazy prices.',
    service1Title: 'Your Music, Your Way',
    service1Subtitle: 'Custom Playlists',
    service1Description: "Tell me what you want to hear and I'll make it happen. Whether you're into the latest hits, throwbacks, or a mix of everything, I'll put together a playlist that keeps everyone vibing all night long.",
    service2Title: 'Quality Sound & Lights',
    service2Subtitle: 'Professional Setup',
    service2Description: "I bring legit equipment that sounds amazing and looks even better. Clear audio, awesome lighting effects—everything you need to turn your venue into the place to be.",
    service3Title: 'Reading the Room',
    service3Subtitle: 'Keeping It Live',
    service3Description: "I know when to turn it up and when to bring it down. I'll watch the crowd and adjust on the fly to make sure everyone's having a good time, not just standing around."
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setContent({
            servicesTitle: data.settings.servicesTitle,
            servicesSubtitle: data.settings.servicesSubtitle,
            service1Title: data.settings.service1Title,
            service1Subtitle: data.settings.service1Subtitle,
            service1Description: data.settings.service1Description,
            service2Title: data.settings.service2Title,
            service2Subtitle: data.settings.service2Subtitle,
            service2Description: data.settings.service2Description,
            service3Title: data.settings.service3Title,
            service3Subtitle: data.settings.service3Subtitle,
            service3Description: data.settings.service3Description
          });
        }
      })
      .catch(() => {});
  }, []);

  const services = [
    {
      title: content.service1Title,
      subtitle: content.service1Subtitle,
      description: content.service1Description,
      icon: <Music size={28} />
    },
    {
      title: content.service2Title,
      subtitle: content.service2Subtitle,
      description: content.service2Description,
      icon: <Speaker size={28} />
    },
    {
      title: content.service3Title,
      subtitle: content.service3Subtitle,
      description: content.service3Description,
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
                <h2 className="font-serif text-4xl md:text-6xl text-brand-dark leading-tight">{content.servicesTitle}</h2>
              </FadeIn>
          </div>
          <FadeIn delay={200} variant="text">
            <p className="max-w-xs text-sm text-gray-600 md:text-right">
              {content.servicesSubtitle}
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