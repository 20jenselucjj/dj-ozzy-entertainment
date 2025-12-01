import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

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

interface FormEvent extends Event {
  imageFile?: File;
}

interface Review {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  text: string;
  date: string;
}

interface SiteSettings {
  // Images
  aboutImage: string;
  partyImage: string;
  meImage: string;
  
  // Image Media Types
  aboutImageType?: 'image' | 'video';
  partyImageType?: 'image' | 'video';
  meImageType?: 'image' | 'video';
  
  // Video URLs
  aboutVideoUrl?: string;
  partyVideoUrl?: string;
  meVideoUrl?: string;
  
  // Video Settings
  aboutVideoAutoplay?: boolean;
  aboutVideoMuted?: boolean;
  aboutVideoLoop?: boolean;
  aboutVideoControls?: boolean;
  partyVideoAutoplay?: boolean;
  partyVideoMuted?: boolean;
  partyVideoLoop?: boolean;
  partyVideoControls?: boolean;
  meVideoAutoplay?: boolean;
  meVideoMuted?: boolean;
  meVideoLoop?: boolean;
  meVideoControls?: boolean;
  
  // Hero Section
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroTagline: string;
  
  // About Section (Homepage)
  aboutTitle: string;
  aboutDescription: string;
  
  // About Page
  aboutPageTitle: string;
  aboutPageParagraph1: string;
  aboutPageParagraph2: string;
  aboutPageParagraph3: string;
  
  // Services
  servicesTitle: string;
  servicesSubtitle: string;
  service1Title: string;
  service1Subtitle: string;
  service1Description: string | string[];
  service2Title: string;
  service2Subtitle: string;
  service2Description: string | string[];
  service3Title: string;
  service3Subtitle: string;
  service3Description: string | string[];
  
  // SEO
  siteTitle: string;
  siteDescription: string;
  
  // Social Media
  instagramUrl: string;
  
  // Reviews
  reviews?: Review[];
  showReviews?: boolean;
}

const AdminPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FormEvent | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'events' | 'settings' | 'reviews'>('settings');
  const [settings, setSettings] = useState<SiteSettings>({
    // Images
    aboutImage: '/About.png',
    partyImage: '/Party.png',
    meImage: '/me.png',
    
    // Hero
    heroLine1: 'Party',
    heroLine2: 'With',
    heroLine3: 'DJ Ozzy',
    heroTagline: 'FOR THE YOUTH BY THE YOUTH',
    
    // About Section
    aboutTitle: 'Your Event, Your Vibe',
    aboutDescription: "I get it—you want music that actually hits. No awkward silences, no outdated playlists, just the songs you and your friends actually want to hear. Whether it's a school dance, party, or any event in Southern Utah, I'll bring the energy and keep everyone on the dance floor all night.",
    
    // About Page
    aboutPageTitle: 'My Story',
    aboutPageParagraph1: 'Growing up I had the privilege to be class president for three years and Student Body President at Snow Canyon High School in St. George. One of the best parts of the job was putting together dances. The chance to after a long day to connect with all my friends and dance to music we loved was the best.',
    aboutPageParagraph2: "However there was always one problem: As a student council we couldn't find any DJ that understood what we wanted to hear, brought the right energy, and someone we could afford and trust.",
    aboutPageParagraph3: "My senior year when my frustration peaked I finally decided why not me? I have the energy, know what people want to hear, have the background, and could fit in anyone's budget. My goal is to give everyone in Southern Utah an opportunity to make priceless memories with the people they love, with fresh updated music, and to be someone that can be trusted and relied on.",
    
    // Services
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
    ],
    

    
    // SEO
    siteTitle: 'DJ Ozzy | DJ Ozzy Entertainment - Southern Utah DJ Services',
    siteDescription: 'DJ Ozzy - Professional DJ services in Southern Utah for weddings, school dances, corporate events, and parties. Book DJ Ozzy Entertainment for unforgettable entertainment experiences.',
    
    // Social Media
    instagramUrl: 'https://instagram.com/djozzy',
    
    // Reviews
    reviews: [],
    showReviews: true
  });
  const [settingsPreview, setSettingsPreview] = useState<Partial<SiteSettings>>({});

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'settings') {
      fetchSettings();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSettingsImageChange = async (field: keyof SiteSettings, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json();
        setSettingsPreview({ ...settingsPreview, [field]: url });
      }
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const updatedSettings = { ...settings, ...settingsPreview };
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: updatedSettings })
      });
      
      if (response.ok) {
        setSettings(updatedSettings);
        setSettingsPreview({});
        alert('Settings saved! Refresh the page to see changes.');
      }
    } catch (error) {
      alert('Failed to save settings');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingEvent) {
      setEditingEvent({ ...editingEvent, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSave = async () => {
    if (!editingEvent) return;
    
    setLoading(true);
    try {
      let imageUrl = editingEvent.image;
      
      // Upload image if a new file was selected (only for image type)
      if (editingEvent.mediaType !== 'video' && editingEvent.imageFile) {
        const formData = new FormData();
        formData.append('image', editingEvent.imageFile);
        
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          imageUrl = url;
        } else {
          alert('Failed to upload image');
          setLoading(false);
          return;
        }
      }
      
      const eventToSave: Event = {
        id: editingEvent.id || Date.now().toString(),
        title: editingEvent.title,
        date: editingEvent.date,
        location: editingEvent.location,
        image: imageUrl,
        ...(editingEvent.rating && editingEvent.rating > 0 ? { rating: editingEvent.rating } : {}),
        mediaType: editingEvent.mediaType || 'image',
        videoUrl: editingEvent.videoUrl || ''
      };
      
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          events: editingEvent.id ? 
            events.map(e => e.id === editingEvent.id ? eventToSave : e) :
            [...events, eventToSave]
        })
      });
      
      if (response.ok) {
        await fetchEvents();
        setIsEditing(false);
        setEditingEvent(null);
        setImagePreview('');
      }
    } catch (error) {
      alert('Failed to save event');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ events: events.filter(e => e.id !== id) })
      });
      await fetchEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-96 border border-black/10">
          <h1 className="font-serif text-3xl mb-6 text-brand-dark">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-black/20 rounded mb-4 focus:outline-none focus:border-brand-dark transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-white py-3 rounded hover:bg-black transition-colors font-medium tracking-wide disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Admin Panel</span>
            <h1 className="font-serif text-4xl md:text-5xl text-brand-dark">Dashboard</h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('adminToken');
              setIsAuthenticated(false);
            }}
            className="text-sm text-gray-600 hover:text-brand-dark"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-black/10">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-medium tracking-wide transition-colors ${
              activeTab === 'settings'
                ? 'border-b-2 border-brand-dark text-brand-dark'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
          >
            Site Settings
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 font-medium tracking-wide transition-colors ${
              activeTab === 'events'
                ? 'border-b-2 border-brand-dark text-brand-dark'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 font-medium tracking-wide transition-colors ${
              activeTab === 'reviews'
                ? 'border-b-2 border-brand-dark text-brand-dark'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl text-brand-dark">Manage Events</h2>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditingEvent({ id: '', title: '', date: '', location: '', image: '' });
                  setImagePreview('');
                }}
                className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded hover:bg-black transition-colors font-medium tracking-wide"
              >
                <Plus size={20} /> Add Event
              </button>
            </div>

        {isEditing && editingEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-3xl text-brand-dark">{editingEvent.id ? 'Edit' : 'Add'} Event</h2>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Event Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark transition-colors"
                    placeholder="Summer Solstice Festival"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Date</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark transition-colors"
                    placeholder="June 21, 2023"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Location</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark transition-colors"
                    placeholder="Miami Beach, FL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Rating (Optional)</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingEvent({ ...editingEvent, rating: star })}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        {star === 0 ? (
                          <span className="text-gray-400">✕</span>
                        ) : (
                          <span className={editingEvent.rating && editingEvent.rating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click ✕ for no rating, or select 1-5 stars</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Media Type</label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mediaType"
                        value="image"
                        checked={editingEvent.mediaType !== 'video'}
                        onChange={() => setEditingEvent({ ...editingEvent, mediaType: 'image', videoUrl: '' })}
                        className="w-4 h-4"
                      />
                      <span>Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mediaType"
                        value="video"
                        checked={editingEvent.mediaType === 'video'}
                        onChange={() => setEditingEvent({ ...editingEvent, mediaType: 'video' })}
                        className="w-4 h-4"
                      />
                      <span>Video</span>
                    </label>
                  </div>

                  {editingEvent.mediaType === 'video' ? (
                    <div>
                      {/* Video Preview */}
                      {(imagePreview || editingEvent.image) && (imagePreview.startsWith('data:video') || editingEvent.image.startsWith('data:video')) && (
                        <div className="mb-4 relative aspect-[3/4] w-48 mx-auto overflow-hidden rounded-lg border border-black/10 shadow-md">
                          <video 
                            src={imagePreview || editingEvent.image} 
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                          />
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-brand-dark hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-600 font-medium">Click to upload video</p>
                          <p className="text-xs text-gray-500 mt-1">MP4, WebM under 25MB (5-10 sec)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="video/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      {/* Image Preview */}
                      {(imagePreview || editingEvent.image) && (
                        <div className="mb-4 relative aspect-[3/4] w-48 mx-auto overflow-hidden rounded-lg border border-black/10 shadow-md">
                          <img 
                            src={imagePreview || editingEvent.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-brand-dark hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={loading || !editingEvent.title || !editingEvent.date || !editingEvent.location || (!editingEvent.image && !editingEvent.imageFile)}
                  className="w-full bg-brand-dark text-white py-4 rounded hover:bg-black transition-colors flex items-center justify-center gap-2 font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} /> {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-black/10 group hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-shadow">
              <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                {event.mediaType === 'video' && event.videoUrl ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(event.videoUrl)}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-3 text-brand-dark">{event.title}</h3>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{event.date}</p>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{event.location}</p>
                {event.rating && event.rating > 0 && (
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= event.rating! ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setImagePreview(event.image);
                      setIsEditing(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-beige py-3 rounded hover:bg-brand-dark hover:text-white transition-colors font-medium text-sm tracking-wide"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded hover:bg-red-600 hover:text-white transition-colors font-medium text-sm tracking-wide"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-12">
            {/* SEO & Social Settings */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">SEO & Social Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.instagramUrl}
                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                  <p className="text-xs text-gray-500 mt-1">Full Instagram profile URL</p>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Line 1</label>
                  <input
                    type="text"
                    value={settings.heroLine1}
                    onChange={(e) => setSettings({ ...settings, heroLine1: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Line 2</label>
                  <input
                    type="text"
                    value={settings.heroLine2}
                    onChange={(e) => setSettings({ ...settings, heroLine2: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Line 3</label>
                  <input
                    type="text"
                    value={settings.heroLine3}
                    onChange={(e) => setSettings({ ...settings, heroLine3: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Tagline</label>
                  <input
                    type="text"
                    value={settings.heroTagline}
                    onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* About Section (Homepage) */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">About Section (Homepage)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Title</label>
                  <input
                    type="text"
                    value={settings.aboutTitle}
                    onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Description</label>
                  <textarea
                    value={settings.aboutDescription}
                    onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    placeholder="Enter description..."
                  />
                </div>
              </div>
            </div>

            {/* About Page Content */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">About Page Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Page Title</label>
                  <input
                    type="text"
                    value={settings.aboutPageTitle}
                    onChange={(e) => setSettings({ ...settings, aboutPageTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Paragraph 1</label>
                  <textarea
                    value={settings.aboutPageParagraph1}
                    onChange={(e) => setSettings({ ...settings, aboutPageParagraph1: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Paragraph 2</label>
                  <textarea
                    value={settings.aboutPageParagraph2}
                    onChange={(e) => setSettings({ ...settings, aboutPageParagraph2: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Paragraph 3</label>
                  <textarea
                    value={settings.aboutPageParagraph3}
                    onChange={(e) => setSettings({ ...settings, aboutPageParagraph3: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">Services Section</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Section Title</label>
                    <input
                      type="text"
                      value={settings.servicesTitle}
                      onChange={(e) => setSettings({ ...settings, servicesTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Section Subtitle</label>
                    <input
                      type="text"
                      value={settings.servicesSubtitle}
                      onChange={(e) => setSettings({ ...settings, servicesSubtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Service 1</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={settings.service1Title}
                      onChange={(e) => setSettings({ ...settings, service1Title: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={settings.service1Subtitle}
                      onChange={(e) => setSettings({ ...settings, service1Subtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Bullet Points</label>
                      {(Array.isArray(settings.service1Description) ? settings.service1Description : [settings.service1Description]).map((bullet, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const newDesc = Array.isArray(settings.service1Description) ? [...settings.service1Description] : [settings.service1Description];
                              newDesc[index] = e.target.value;
                              setSettings({ ...settings, service1Description: newDesc });
                            }}
                            placeholder={`Bullet point ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                          />
                          <button
                            onClick={() => {
                              const newDesc = Array.isArray(settings.service1Description) ? [...settings.service1Description] : [settings.service1Description];
                              newDesc.splice(index, 1);
                              setSettings({ ...settings, service1Description: newDesc });
                            }}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newDesc = Array.isArray(settings.service1Description) ? [...settings.service1Description, ''] : [settings.service1Description, ''];
                          setSettings({ ...settings, service1Description: newDesc });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-beige rounded hover:bg-brand-dark hover:text-white transition-colors text-sm"
                      >
                        <Plus size={16} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Service 2</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={settings.service2Title}
                      onChange={(e) => setSettings({ ...settings, service2Title: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={settings.service2Subtitle}
                      onChange={(e) => setSettings({ ...settings, service2Subtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Bullet Points</label>
                      {(Array.isArray(settings.service2Description) ? settings.service2Description : [settings.service2Description]).map((bullet, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const newDesc = Array.isArray(settings.service2Description) ? [...settings.service2Description] : [settings.service2Description];
                              newDesc[index] = e.target.value;
                              setSettings({ ...settings, service2Description: newDesc });
                            }}
                            placeholder={`Bullet point ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                          />
                          <button
                            onClick={() => {
                              const newDesc = Array.isArray(settings.service2Description) ? [...settings.service2Description] : [settings.service2Description];
                              newDesc.splice(index, 1);
                              setSettings({ ...settings, service2Description: newDesc });
                            }}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newDesc = Array.isArray(settings.service2Description) ? [...settings.service2Description, ''] : [settings.service2Description, ''];
                          setSettings({ ...settings, service2Description: newDesc });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-beige rounded hover:bg-brand-dark hover:text-white transition-colors text-sm"
                      >
                        <Plus size={16} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Service 3</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={settings.service3Title}
                      onChange={(e) => setSettings({ ...settings, service3Title: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      value={settings.service3Subtitle}
                      onChange={(e) => setSettings({ ...settings, service3Subtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Bullet Points</label>
                      {(Array.isArray(settings.service3Description) ? settings.service3Description : [settings.service3Description]).map((bullet, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const newDesc = Array.isArray(settings.service3Description) ? [...settings.service3Description] : [settings.service3Description];
                              newDesc[index] = e.target.value;
                              setSettings({ ...settings, service3Description: newDesc });
                            }}
                            placeholder={`Bullet point ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                          />
                          <button
                            onClick={() => {
                              const newDesc = Array.isArray(settings.service3Description) ? [...settings.service3Description] : [settings.service3Description];
                              newDesc.splice(index, 1);
                              setSettings({ ...settings, service3Description: newDesc });
                            }}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newDesc = Array.isArray(settings.service3Description) ? [...settings.service3Description, ''] : [settings.service3Description, ''];
                          setSettings({ ...settings, service3Description: newDesc });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-beige rounded hover:bg-brand-dark hover:text-white transition-colors text-sm"
                      >
                        <Plus size={16} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact/Booking Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">Contact/Booking Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Section Title</label>
                  <input
                    type="text"
                    value={settings.contactTitle}
                    onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    placeholder="Let's Make It Happen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Description</label>
                  <textarea
                    value={settings.contactDescription}
                    onChange={(e) => setSettings({ ...settings, contactDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                    placeholder="Got an event coming up? Hit me up..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Location</label>
                    <input
                      type="text"
                      value={settings.contactLocation}
                      onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                      placeholder="Southern Utah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                      placeholder="djozzyentertainment@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Phone</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                      placeholder="+1 (435) 862-4679"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="font-serif text-2xl text-brand-dark mb-6">Site Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">About Page Hero</h3>
                
                {/* Media Type Selection */}
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aboutImageType"
                      value="image"
                      checked={settings.aboutImageType !== 'video'}
                      onChange={() => setSettings({ ...settings, aboutImageType: 'image', aboutVideoUrl: '' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aboutImageType"
                      value="video"
                      checked={settings.aboutImageType === 'video'}
                      onChange={() => setSettings({ ...settings, aboutImageType: 'video' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Video</span>
                  </label>
                </div>

                {settings.aboutImageType === 'video' ? (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.aboutVideoAutoplay !== false}
                          onChange={(e) => setSettings({ ...settings, aboutVideoAutoplay: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Autoplay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.aboutVideoMuted !== false}
                          onChange={(e) => setSettings({ ...settings, aboutVideoMuted: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Muted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.aboutVideoLoop !== false}
                          onChange={(e) => setSettings({ ...settings, aboutVideoLoop: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Loop</span>
                      </label>
                    </div>
                    {(settingsPreview.aboutImage || settings.aboutImage) && settings.aboutImage.startsWith('data:video') ? (
                      <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                        <video 
                          src={settingsPreview.aboutImage || settings.aboutImage}
                          className="w-full h-full object-cover"
                          autoPlay={settings.aboutVideoAutoplay !== false}
                          muted={settings.aboutVideoMuted !== false}
                          loop={settings.aboutVideoLoop !== false}
                          controls={settings.aboutVideoControls || false}
                          playsInline
                        />
                      </div>
                    ) : null}
                    <label className="block">
                      <span className="sr-only">Choose video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('aboutImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">MP4, WebM under 25MB (5-10 sec recommended)</p>
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                      <img 
                        src={settingsPreview.aboutImage || settings.aboutImage} 
                        alt="About page hero" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block">
                      <span className="sr-only">Choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('aboutImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Party Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">Party Atmosphere</h3>
                
                {/* Media Type Selection */}
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="partyImageType"
                      value="image"
                      checked={settings.partyImageType !== 'video'}
                      onChange={() => setSettings({ ...settings, partyImageType: 'image', partyVideoUrl: '' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="partyImageType"
                      value="video"
                      checked={settings.partyImageType === 'video'}
                      onChange={() => setSettings({ ...settings, partyImageType: 'video' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Video</span>
                  </label>
                </div>

                {settings.partyImageType === 'video' ? (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.partyVideoAutoplay !== false}
                          onChange={(e) => setSettings({ ...settings, partyVideoAutoplay: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Autoplay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.partyVideoMuted !== false}
                          onChange={(e) => setSettings({ ...settings, partyVideoMuted: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Muted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.partyVideoLoop !== false}
                          onChange={(e) => setSettings({ ...settings, partyVideoLoop: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Loop</span>
                      </label>
                    </div>
                    {(settingsPreview.partyImage || settings.partyImage) && settings.partyImage.startsWith('data:video') ? (
                      <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                        <video 
                          src={settingsPreview.partyImage || settings.partyImage}
                          className="w-full h-full object-cover"
                          autoPlay={settings.partyVideoAutoplay !== false}
                          muted={settings.partyVideoMuted !== false}
                          loop={settings.partyVideoLoop !== false}
                          controls={settings.partyVideoControls || false}
                          playsInline
                        />
                      </div>
                    ) : null}
                    <label className="block">
                      <span className="sr-only">Choose video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('partyImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">MP4, WebM under 25MB (5-10 sec recommended)</p>
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                      <img 
                        src={settingsPreview.partyImage || settings.partyImage} 
                        alt="Party atmosphere" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block">
                      <span className="sr-only">Choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('partyImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Me Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">Homepage About Section</h3>
                
                {/* Media Type Selection */}
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="meImageType"
                      value="image"
                      checked={settings.meImageType !== 'video'}
                      onChange={() => setSettings({ ...settings, meImageType: 'image', meVideoUrl: '' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="meImageType"
                      value="video"
                      checked={settings.meImageType === 'video'}
                      onChange={() => setSettings({ ...settings, meImageType: 'video' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Video</span>
                  </label>
                </div>

                {settings.meImageType === 'video' ? (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.meVideoAutoplay !== false}
                          onChange={(e) => setSettings({ ...settings, meVideoAutoplay: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Autoplay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.meVideoMuted !== false}
                          onChange={(e) => setSettings({ ...settings, meVideoMuted: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Muted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.meVideoLoop !== false}
                          onChange={(e) => setSettings({ ...settings, meVideoLoop: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Loop</span>
                      </label>
                    </div>
                    {(settingsPreview.meImage || settings.meImage) && settings.meImage.startsWith('data:video') ? (
                      <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                        <video 
                          src={settingsPreview.meImage || settings.meImage}
                          className="w-full h-full object-cover"
                          autoPlay={settings.meVideoAutoplay !== false}
                          muted={settings.meVideoMuted !== false}
                          loop={settings.meVideoLoop !== false}
                          controls={settings.meVideoControls || false}
                          playsInline
                        />
                      </div>
                    ) : null}
                    <label className="block">
                      <span className="sr-only">Choose video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('meImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">MP4, WebM under 25MB (5-10 sec recommended)</p>
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded border border-black/10">
                      <img 
                        src={settingsPreview.meImage || settings.meImage} 
                        alt="DJ performing" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="block">
                      <span className="sr-only">Choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSettingsImageChange('meImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-beige file:text-brand-dark hover:file:bg-gray-200"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            </div>

            {/* Save Button - Always visible */}
            <div className="sticky bottom-8 flex justify-end gap-4 bg-brand-beige/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-black/10">
              <button
                onClick={() => {
                  if (confirm('Discard all changes?')) {
                    fetchSettings();
                    setSettingsPreview({});
                  }
                }}
                className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={saveSettings}
                disabled={loading}
                className="px-8 py-3 bg-brand-dark text-white rounded hover:bg-black transition-colors disabled:opacity-50 font-medium tracking-wide"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-brand-dark">Manage Reviews</h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showReviews !== false}
                      onChange={(e) => setSettings({ ...settings, showReviews: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Show Reviews Section</span>
                  </label>
                  <button
                    onClick={() => {
                      const newReview: Review = {
                        id: Date.now().toString(),
                        name: '',
                        profileImage: 'https://via.placeholder.com/100',
                        rating: 5,
                        text: '',
                        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      };
                      setSettings({ 
                        ...settings, 
                        reviews: [...(settings.reviews || []), newReview] 
                      });
                    }}
                    className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded hover:bg-black transition-colors font-medium tracking-wide"
                  >
                    <Plus size={20} /> Add Review
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {(settings.reviews || []).map((review, index) => (
                  <div key={review.id} className="border border-black/10 rounded-lg p-6 bg-brand-beige">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">Review {index + 1}</h3>
                      <button
                        onClick={() => {
                          if (confirm('Delete this review?')) {
                            setSettings({
                              ...settings,
                              reviews: (settings.reviews || []).filter((_, i) => i !== index)
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Reviewer Name</label>
                        <input
                          type="text"
                          value={review.name}
                          onChange={(e) => {
                            const newReviews = [...(settings.reviews || [])];
                            newReviews[index] = { ...newReviews[index], name: e.target.value };
                            setSettings({ ...settings, reviews: newReviews });
                          }}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Profile Image</label>
                        <div className="flex gap-3 items-start">
                          {review.profileImage && (
                            <img 
                              src={review.profileImage} 
                              alt={review.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-brand-dark"
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="url"
                              value={review.profileImage}
                              onChange={(e) => {
                                const newReviews = [...(settings.reviews || [])];
                                newReviews[index] = { ...newReviews[index], profileImage: e.target.value };
                                setSettings({ ...settings, reviews: newReviews });
                              }}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full px-4 py-2 border border-black/20 rounded focus:outline-none focus:border-brand-dark mb-2"
                            />
                            <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-black/20 rounded cursor-pointer hover:border-brand-dark hover:bg-gray-50 transition-colors">
                              <Upload size={16} />
                              <span className="text-sm">Upload Image</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    
                                    try {
                                      const uploadResponse = await fetch('/api/upload-image', {
                                        method: 'POST',
                                        body: formData
                                      });
                                      
                                      if (uploadResponse.ok) {
                                        const { url } = await uploadResponse.json();
                                        const newReviews = [...(settings.reviews || [])];
                                        newReviews[index] = { ...newReviews[index], profileImage: url };
                                        setSettings({ ...settings, reviews: newReviews });
                                      } else {
                                        alert('Failed to upload image');
                                      }
                                    } catch (error) {
                                      alert('Failed to upload image');
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                const newReviews = [...(settings.reviews || [])];
                                newReviews[index] = { ...newReviews[index], rating: star };
                                setSettings({ ...settings, reviews: newReviews });
                              }}
                              className="text-2xl hover:scale-110 transition-transform"
                            >
                              <span className={review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Date</label>
                        <input
                          type="text"
                          value={review.date}
                          onChange={(e) => {
                            const newReviews = [...(settings.reviews || [])];
                            newReviews[index] = { ...newReviews[index], date: e.target.value };
                            setSettings({ ...settings, reviews: newReviews });
                          }}
                          placeholder="January 2024"
                          className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Review Text</label>
                        <textarea
                          value={review.text}
                          onChange={(e) => {
                            const newReviews = [...(settings.reviews || [])];
                            newReviews[index] = { ...newReviews[index], text: e.target.value };
                            setSettings({ ...settings, reviews: newReviews });
                          }}
                          rows={4}
                          placeholder="DJ Ozzy was amazing! The music was perfect and everyone had a great time..."
                          className="w-full px-4 py-3 border border-black/20 rounded focus:outline-none focus:border-brand-dark"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!settings.reviews || settings.reviews.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No reviews yet. Click "Add Review" to create your first review.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  if (confirm('Discard all changes?')) {
                    fetchSettings();
                  }
                }}
                className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={saveSettings}
                disabled={loading}
                className="px-8 py-3 bg-brand-dark text-white rounded hover:bg-black transition-colors disabled:opacity-50 font-medium tracking-wide"
              >
                {loading ? 'Saving...' : 'Save Reviews'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
