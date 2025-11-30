import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = React.useState({
    aboutImage: '/About.png',
    partyImage: '/Party.png',
    aboutImageType: 'image' as 'image' | 'video',
    partyImageType: 'image' as 'image' | 'video',
    aboutVideoUrl: '',
    partyVideoUrl: '',
    aboutVideoAutoplay: true,
    aboutVideoMuted: true,
    aboutVideoLoop: true,
    aboutVideoControls: false,
    partyVideoAutoplay: true,
    partyVideoMuted: true,
    partyVideoLoop: true,
    partyVideoControls: false,
    aboutPageTitle: 'My Story',
    aboutPageParagraph1: 'Growing up I had the privilege to be class president for three years and Student Body President at Snow Canyon High School in St. George. One of the best parts of the job was putting together dances. The chance to after a long day to connect with all my friends and dance to music we loved was the best.',
    aboutPageParagraph2: "However there was always one problem: As a student council we couldn't find any DJ that understood what we wanted to hear, brought the right energy, and someone we could afford and trust.",
    aboutPageParagraph3: "My senior year when my frustration peaked I finally decided why not me? I have the energy, know what people want to hear, have the background, and could fit in anyone's budget. My goal is to give everyone in Southern Utah an opportunity to make priceless memories with the people they love, with fresh updated music, and to be someone that can be trusted and relied on."
  });

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setContent({
            aboutImage: data.settings.aboutImage || '/About.png',
            partyImage: data.settings.partyImage || '/Party.png',
            aboutImageType: data.settings.aboutImageType || 'image',
            partyImageType: data.settings.partyImageType || 'image',
            aboutVideoUrl: data.settings.aboutVideoUrl || '',
            partyVideoUrl: data.settings.partyVideoUrl || '',
            aboutVideoAutoplay: data.settings.aboutVideoAutoplay !== false,
            aboutVideoMuted: data.settings.aboutVideoMuted !== false,
            aboutVideoLoop: data.settings.aboutVideoLoop !== false,
            aboutVideoControls: data.settings.aboutVideoControls || false,
            partyVideoAutoplay: data.settings.partyVideoAutoplay !== false,
            partyVideoMuted: data.settings.partyVideoMuted !== false,
            partyVideoLoop: data.settings.partyVideoLoop !== false,
            partyVideoControls: data.settings.partyVideoControls || false,
            aboutPageTitle: data.settings.aboutPageTitle,
            aboutPageParagraph1: data.settings.aboutPageParagraph1,
            aboutPageParagraph2: data.settings.aboutPageParagraph2,
            aboutPageParagraph3: data.settings.aboutPageParagraph3
          });
        }
      })
      .catch(() => {});
  }, []);

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
    <section className="w-full max-w-[1440px] mx-auto min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Hero Image/Video */}
        <div className="relative overflow-hidden pt-4">
          {(content.aboutImageType === 'video' || content.aboutImage.startsWith('data:video')) ? (
            <div className="aspect-[3/4] w-full">
              <video
                src={content.aboutImage}
                className="w-full h-full object-cover"
                autoPlay={content.aboutVideoAutoplay}
                muted={content.aboutVideoMuted}
                loop={content.aboutVideoLoop}
                controls={content.aboutVideoControls}
                playsInline
              />
            </div>
          ) : (
            <img 
              src={content.aboutImage} 
              alt="DJ Ozzy - Professional DJ and former Student Body President at Snow Canyon High School" 
              className="w-full h-auto"
            />
          )}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-beige to-transparent"></div>
        </div>

        {/* Story Content */}
        <div className="px-6 py-12 bg-brand-beige">
          <FadeIn delay={100} variant="text">
            <h2 className="font-serif text-4xl leading-tight mb-6 text-center">
              {content.aboutPageTitle}
            </h2>
          </FadeIn>
          
          <FadeIn delay={300} variant="text">
            <div className="space-y-4 max-w-lg mx-auto">
              <p className="font-sans text-base leading-relaxed text-gray-700">{content.aboutPageParagraph1}</p>
              <p className="font-sans text-base leading-relaxed text-gray-700">{content.aboutPageParagraph2}</p>
              <p className="font-sans text-base leading-relaxed text-gray-700">{content.aboutPageParagraph3}</p>
            </div>
          </FadeIn>

          <div className="flex justify-center mt-8">
            <button 
              onClick={scrollToContact}
              className="group bg-black text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Party Image/Video */}
        <div className="relative h-[40vh] overflow-hidden">
          {(content.partyImageType === 'video' || content.partyImage.startsWith('data:video')) ? (
            <video
              src={content.partyImage}
              className="w-full h-full object-cover"
              autoPlay={content.partyVideoAutoplay}
              muted={content.partyVideoMuted}
              loop={content.partyVideoLoop}
              playsInline
            />
          ) : (
            <img 
              src={content.partyImage} 
              alt="Energetic party atmosphere with crowd dancing at DJ Ozzy event in Southern Utah" 
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-0">
        {/* Left Content Column */}
        <div className="p-12 lg:p-16 flex flex-col justify-center bg-brand-beige">
          <div className="max-w-xl">
            <FadeIn delay={100} variant="text">
              <h2 className="font-serif text-5xl lg:text-6xl leading-tight mb-10">
                {content.aboutPageTitle}
              </h2>
            </FadeIn>
            
            <FadeIn delay={300} variant="text">
              <div className="space-y-6">
                <p className="font-sans text-lg leading-relaxed text-gray-700">{content.aboutPageParagraph1}</p>
                <p className="font-sans text-lg leading-relaxed text-gray-700">{content.aboutPageParagraph2}</p>
                <p className="font-sans text-lg leading-relaxed text-gray-700">{content.aboutPageParagraph3}</p>
              </div>
            </FadeIn>

            <button 
              onClick={scrollToContact}
              className="mt-10 group bg-black text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Right Image/Video Column - Split into two sections */}
        <div className="relative flex flex-col">
          <div className="relative overflow-hidden">
            {content.aboutImageType === 'video' && content.aboutVideoUrl ? (
              <div className="aspect-[3/4] w-full">
                <video
                  src={content.aboutImage}
                  className="w-full h-full object-cover"
                  autoPlay={content.aboutVideoAutoplay}
                  muted={content.aboutVideoMuted}
                  loop={content.aboutVideoLoop}
                  playsInline
                />
              </div>
            ) : content.aboutImage.startsWith('data:video') ? (
              <div className="aspect-[3/4] w-full">
                <video
                  src={content.aboutImage}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            ) : (
              <img 
                src={content.aboutImage} 
                alt="DJ Ozzy - Professional DJ and former Student Body President at Snow Canyon High School" 
                className="w-full h-auto hover:scale-105 transition-all duration-700 ease-in-out"
              />
            )}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          
          <div className="h-3 bg-brand-beige"></div>
          
          <div className="relative h-1/2 overflow-hidden">
            {content.partyImageType === 'video' && content.partyVideoUrl ? (
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(content.partyVideoUrl)}?autoplay=${content.partyVideoAutoplay ? '1' : '0'}&mute=${content.partyVideoMuted ? '1' : '0'}&controls=${content.partyVideoControls ? '1' : '0'}&loop=${content.partyVideoLoop ? '1' : '0'}&playlist=${extractYouTubeId(content.partyVideoUrl)}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {!content.partyVideoControls && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-16 bg-transparent pointer-events-auto z-10" style={{ pointerEvents: 'none' }}></div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-transparent pointer-events-auto z-10" style={{ pointerEvents: 'none' }}></div>
                  </>
                )}
              </div>
            ) : (
              <img 
                src={content.partyImage} 
                alt="Energetic party atmosphere with crowd dancing at DJ Ozzy event in Southern Utah" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-700 ease-in-out"
              />
            )}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
