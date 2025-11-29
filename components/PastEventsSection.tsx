import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import FadeIn from './FadeIn';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Summer Solstice Festival",
    date: "June 21, 2023",
    location: "Miami Beach, FL",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Neon Nights Warehouse",
    date: "August 15, 2023",
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Corporate Gala 2023",
    date: "November 10, 2023",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Underground Beats",
    date: "December 31, 2023",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"
  }
];

const PastEventsSection: React.FC = () => {
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

      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
        {events.map((event) => (
          <div key={event.id} className="group relative cursor-pointer overflow-hidden h-full md:flex-1 md:min-w-[200px]">
             {/* Card Content */}
             <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                <img 
                    src={event.image} 
                    alt={`${event.title} - DJ event at ${event.location} featuring live music and entertainment`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
                </div>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PastEventsSection;