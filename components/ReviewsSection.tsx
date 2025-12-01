import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import FadeIn from './FadeIn';

interface Review {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  text: string;
  date: string;
}

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviews, setShowReviews] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setReviews(data.settings.reviews || []);
          setShowReviews(data.settings.showReviews !== false);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (reviews.length <= 3) return; // Don't auto-scroll if 3 or fewer reviews

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = reviews.length - 3;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 6000); // Scroll every 6 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  // Smooth scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 350;
      const isMobile = window.innerWidth < 768;
      const gap = isMobile ? 16 : 32;
      const targetPosition = currentIndex * (cardWidth + gap);
      const startPosition = container.scrollLeft;
      const distance = targetPosition - startPosition;
      const duration = 1500;
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

  if (!showReviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[1440px] mx-auto py-16 md:py-24 px-4 md:px-8 bg-brand-beige">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left">
        <div>
          <FadeIn delay={0} variant="text">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Testimonials</span>
          </FadeIn>
          <FadeIn delay={100} variant="text">
            <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">What People Say</h2>
          </FadeIn>
        </div>
        <FadeIn delay={200} className="mt-4 md:mt-0" variant="text">
          <p className="max-w-xs text-sm text-gray-600 md:text-right">
            Real reviews from real events.
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
            maxWidth: 'min(100%, calc(350px * 3 + 32px * 2))',
            scrollBehavior: 'smooth'
          }}
          onMouseEnter={() => setCurrentIndex(currentIndex)}
        >
          <div className="flex gap-4 md:gap-8 pb-4">
            {reviews.map((review) => (
              <div key={review.id} className="group relative flex-shrink-0 w-[350px] first:ml-4 md:first:ml-0">
                <div className="bg-white p-6 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={review.profileImage} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-brand-beige"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-brand-dark">{review.name}</h3>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1">{review.text}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {reviews.length > 3 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: reviews.length - 2 }).map((_, index) => (
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

export default ReviewsSection;
