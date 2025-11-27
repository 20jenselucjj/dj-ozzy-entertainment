import React, { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
  threshold?: number; // Intersection observer threshold
  variant?: 'text' | 'block'; // New prop to choose animation style
}

const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  className = '', 
  threshold = 0.15,
  variant = 'block' // Default to block (standard fade/slide) to be safe for boxes
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px' // Slightly offset to ensure it feels deliberate
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // variant='text' uses the slow left-to-right wipe (scroll-reveal)
  // variant='block' uses the slow slide-up fade (fade-in-up)
  const animationClass = variant === 'text' ? 'animate-scroll-reveal' : 'animate-fade-in-up';

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? `${animationClass} opacity-100` : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;