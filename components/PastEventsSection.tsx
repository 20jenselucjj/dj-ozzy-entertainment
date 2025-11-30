import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star } from 'lucide-react';
import FadeIn from './FadeIn';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  rating?: number;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
}

const defaultEvents: Event[] = [];

const PastEventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      })
      .catch(() => {
        // Keep default events on error
      });
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (events.length <= 4) return; // Don't auto-scroll if 4 or fewer events

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = events.length - 4;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 6000); // Scroll every 6 seconds (gives time to see the slow animation)

    return () => clearInterval(interval);
  }, [events.length]);

  // Smooth scroll to current index with custom animation
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280;
      const isMobile = window.innerWidth < 768;
      const gap = isMobile ? 16 : 32;
      const targetPosition = currentIndex * (cardWidth + gap);
      const startPosition = container.scrollLeft;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 1.5 seconds for smooth transition
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        container.scrollLeft = startPosition + distance * ease;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }, [currentIndex]);

  return (
    <section className="w-full max-w-[1440px] mx-auto py-16 md:py-24 px-4 md:px-8 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left">
        <div>
           <FadeIn delay={0} variant="text">
             <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Our History</span>
           </FadeIn>
           <FadeIn delay={100} variant="text">
             <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Past Events</h2>
           </FadeIn>
        </div>
        <FadeIn delay={200} className="mt-4 md:mt-0" variant="text">
          <p className="max-w-xs text-sm text-gray-600 md:text-right">
              Some of the awesome events I've had the chance to DJ at.
          </p>
        </FadeIn>
      </div>

      <style>{`
        .smooth-scroll-carousel {
          scroll-behavior: smooth;
          transition: scroll-left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
      
      <div className="overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto hide-scrollbar mx-auto smooth-scroll-carousel"
          style={{ 
            maxWidth: 'min(100%, calc(280px * 4 + 32px * 3))',
            scrollBehavior: 'smooth'
          }}
          onMouseEnter={() => setCurrentIndex(currentIndex)} // Pause on hover
        >
          <div className="flex gap-4 md:gap-8 pb-4">
          {events.map((event) => (
            <div key={event.id} className="group relative cursor-pointer overflow-hidden flex-shrink-0 w-[280px] first:ml-4 md:first:ml-0">
               {/* Card Content */}
               <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                  {(event.mediaType === 'video' || event.image.startsWith('data:video')) ? (
                    <video
                      src={event.image}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  ) : (
                    <img 
                        src={event.image} 
                        alt={`${event.title} - DJ event at ${event.location} featuring live music and entertainment`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
               </div>
               
               {/* Overlay Text */}
               <div className="mt-4">
                  <h3 className="font-serif text-xl mb-1 group-hover:underline decoration-1 underline-offset-4">{event.title}</h3>
                  <div className="flex flex-col gap-1 text-xs uppercase tracking-wide text-gray-500">
                      <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                      </div>
                      {event.rating && event.rating > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= event.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                  </div>
               </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {events.length > 4 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: events.length - 3 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-brand-dark' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PastEventsSection;