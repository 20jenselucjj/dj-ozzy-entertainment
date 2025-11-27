import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import PastEventsSection from './PastEventsSection';
import ContactSection from './ContactSection';

const HomePage: React.FC = () => {
  return (
    <>
      <div id="home">
        <HeroSection />
      </div>
      
      <div id="about">
        <AboutSection />
      </div>

      <div id="services">
        <ServicesSection />
      </div>

      <div id="events">
        <PastEventsSection />
      </div>

      <div id="contact">
        <ContactSection />
      </div>
    </>
  );
};

export default HomePage;
