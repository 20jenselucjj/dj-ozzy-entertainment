import React, { useState } from 'react';
import { Check, MapPin, Mail, Phone } from 'lucide-react';
import FadeIn from './FadeIn';

const ContactSection: React.FC = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const [content, setContent] = React.useState({
        contactTitle: "Let's Make It Happen",
        contactDescription: "Got an event coming up? Whether it's a school dance, birthday party, or any celebration in Southern Utah, hit me up and let's talk about making it unforgettable. I'm flexible with dates and budgets.",
        contactLocation: 'Southern Utah',
        contactEmail: 'djozzyentertainment@gmail.com',
        contactPhone: '+1 (435) 862-4679'
    });

    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setContent({
                        contactTitle: data.settings.contactTitle,
                        contactDescription: data.settings.contactDescription,
                        contactLocation: data.settings.contactLocation,
                        contactEmail: data.settings.contactEmail,
                        contactPhone: data.settings.contactPhone
                    });
                }
            })
            .catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (response.ok) {
                // Reset form and trigger success animation
                setFormState({ name: '', email: '', message: '' });
                setIsSubmitted(true);

                // Reset the success state after 3 seconds to show the form again
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 3000);
            } else {
                alert('Failed to send message. Please try again or contact us directly.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again or contact us directly.');
        }
    };

    return (
        <section id="contact" className="w-full max-w-[1440px] mx-auto py-16 md:py-24 px-4 md:px-8 bg-brand-dark text-brand-beige shadow-[0_10px_50px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col md:flex-row gap-16">
                
                {/* Contact Info */}
                <div className="flex flex-col justify-between md:flex-1">
                    <div>
                        <FadeIn delay={0} variant="text">
                            <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">Bookings</span>
                        </FadeIn>
                        <FadeIn delay={100} variant="text">
                            <h2 className="font-serif text-5xl md:text-7xl mb-8">{content.contactTitle || "Let's Make It Happen"}</h2>
                        </FadeIn>
                        <FadeIn delay={200} variant="text">
                            <p className="text-gray-400 max-w-md leading-relaxed mb-12">
                                {content.contactDescription || "Got an event coming up? Hit me up and let's talk about making it unforgettable."}
                            </p>
                        </FadeIn>
                    </div>

                    <div className="space-y-6">
                        <FadeIn delay={300} variant="text">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="mt-1 text-brand-beige/70" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500 mb-1">Location</p>
                                    <p className="text-xl font-serif">{content.contactLocation || 'Southern Utah'}</p>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={350} variant="text">
                            <div className="flex items-start gap-3">
                                <Mail size={20} className="mt-1 text-brand-beige/70" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500 mb-1">Email</p>
                                    <a href={`mailto:${content.contactEmail || ''}`} className="text-xl font-serif relative group inline-block">
                                        <span className="relative z-10 transition-colors group-hover:text-white">{content.contactEmail || 'djozzyentertainment@gmail.com'}</span>
                                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-beige origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                    </a>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={400} variant="text">
                            <div className="flex items-start gap-3">
                                <Phone size={20} className="mt-1 text-brand-beige/70" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500 mb-1">Phone</p>
                                    <a href={`tel:${content.contactPhone?.replace(/[^0-9+]/g, '') || ''}`} className="text-xl font-serif relative group inline-block">
                                        <span className="relative z-10 transition-colors group-hover:text-white">{content.contactPhone || ''}</span>
                                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-beige origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                    </a>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/5 p-8 md:p-12 rounded-sm border border-white/10 relative overflow-hidden">
                    {/* Success Message Overlay - Appears on top of form */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-[#151515]/95 backdrop-blur-sm z-20 transition-all duration-500 ease-out ${isSubmitted ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                        <div className={`transform transition-all duration-700 delay-100 flex flex-col items-center ${isSubmitted ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'}`}>
                            <div className="w-16 h-16 rounded-full border border-brand-beige/30 flex items-center justify-center mb-4 text-brand-beige">
                                <Check size={32} />
                            </div>
                            <h3 className="font-serif text-3xl text-center text-white mb-2">Request Sent</h3>
                            <p className="text-gray-400 text-xs uppercase tracking-widest text-center">We'll be in touch soon</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={`space-y-8 transition-opacity duration-500 ${isSubmitted ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-gray-400">Name</label>
                            <input 
                                type="text" 
                                required
                                value={formState.name}
                                onChange={(e) => setFormState({...formState, name: e.target.value})}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-xl font-serif focus:outline-none focus:border-white transition-colors placeholder-gray-700"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-gray-400">Email</label>
                            <input 
                                type="email" 
                                required
                                value={formState.email}
                                onChange={(e) => setFormState({...formState, email: e.target.value})}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-xl font-serif focus:outline-none focus:border-white transition-colors placeholder-gray-700"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-gray-400">Message</label>
                            <textarea 
                                required
                                rows={4}
                                value={formState.message}
                                onChange={(e) => setFormState({...formState, message: e.target.value})}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-xl font-serif focus:outline-none focus:border-white transition-colors placeholder-gray-700 resize-none"
                                placeholder="Tell us about your event..."
                            />
                        </div>
                        
                        <div className="pt-4">
                            <button type="submit" className="bg-brand-beige text-brand-dark px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]">
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;