import React from 'react';
import { Flame, Music, DollarSign } from 'lucide-react';
import FadeIn from './FadeIn';

const ServicesSection: React.FC = () => {
  const [content, setContent] = React.useState({
    servicesTitle: 'What I Bring',
    servicesSubtitle: 'Everything you need for an epic night without the hassle or crazy prices.',
    service1Title: 'Energy you can feel',
    service1Subtitle: 'CUSTOM PLAYLISTS',
    service1Description: [
      "High energy MC that gets crowd hyped",
      "A DJ who actually KNOWS what the students want",
      "Real connection with guests",
      "A DJ who has planed over 10 dances and understands dances from YOUR side"
    ],
    service2Title: 'Music Made for the Moment',
    service2Subtitle: 'PROFESSIONAL SETUP',
    service2Description: [
      "Clean, school appropriate music only",
      "Live mashups & Transitions (no dead air)",
      "Tailored playlists for each event",
      "Fresh, updated music - No outdated dance tracks",
      "Highly crowd interactive playing"
    ],
    service3Title: 'Honest, Simple, Affordable',
    service3Subtitle: 'KEEPING IT LIVE',
    service3Description: [
      "Pricing designed specifically for the event",
      "Flexible packages for budgets big and small",
      "On time dependable DJ",
      "Transparent upfront rate - No surprise fees",
      "Professional contract + payment"
    ]
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
            service1Description: Array.isArray(data.settings.service1Description) 
              ? data.settings.service1Description 
              : data.settings.service1Description.split(/\.\s+/).filter((s: string) => s.trim()),
            service2Title: data.settings.service2Title,
            service2Subtitle: data.settings.service2Subtitle,
            service2Description: Array.isArray(data.settings.service2Description)
              ? data.settings.service2Description
              : data.settings.service2Description.split(/\.\s+/).filter((s: string) => s.trim()),
            service3Title: data.settings.service3Title,
            service3Subtitle: data.settings.service3Subtitle,
            service3Description: Array.isArray(data.settings.service3Description)
              ? data.settings.service3Description
              : data.settings.service3Description.split(/\.\s+/).filter((s: string) => s.trim())
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
      icon: <Flame size={28} />
    },
    {
      title: content.service2Title,
      subtitle: content.service2Subtitle,
      description: content.service2Description,
      icon: <Music size={28} />
    },
    {
      title: content.service3Title,
      subtitle: content.service3Subtitle,
      description: content.service3Description,
      icon: <DollarSign size={28} />
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
                       <ul className="text-sm md:text-base leading-relaxed text-gray-700 space-y-1 list-disc list-inside marker:text-gray-700">
                          {(Array.isArray(service.description) ? service.description : [service.description]).map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                       </ul>
                    </FadeIn>
                </div>
             </div>
          ))}
       </div>
    </section>
  );
};

export default ServicesSection;