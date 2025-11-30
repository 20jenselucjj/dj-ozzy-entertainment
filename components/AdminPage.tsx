import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  rating?: number;
}

interface FormEvent extends Event {
  imageFile?: File;
}

interface SiteSettings {
  aboutImage: string;
  partyImage: string;
  meImage: string;
}

const AdminPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FormEvent | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'events' | 'settings'>('events');
  const [settings, setSettings] = useState<SiteSettings>({
    aboutImage: '/About.png',
    partyImage: '/Party.png',
    meImage: '/me.png'
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

  const handleSave = async () => {
    if (!editingEvent) return;
    
    setLoading(true);
    try {
      let imageUrl = editingEvent.image;
      
      // Upload image if a new file was selected
      if (editingEvent.imageFile) {
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
      
      const eventToSave = {
        id: editingEvent.id || Date.now().toString(),
        title: editingEvent.title,
        date: editingEvent.date,
        location: editingEvent.location,
        image: imageUrl,
        rating: editingEvent.rating || 0
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
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-medium tracking-wide transition-colors ${
              activeTab === 'settings'
                ? 'border-b-2 border-brand-dark text-brand-dark'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
          >
            Site Settings
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
                  setEditingEvent({ id: '', title: '', date: '', location: '', image: '', rating: 0 });
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
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide text-gray-600">Event Image</label>
                  
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
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
          <div className="space-y-8">
            <h2 className="font-serif text-2xl text-brand-dark mb-6">About Page Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">About Page Hero</h3>
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
              </div>

              {/* Party Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">Party Atmosphere</h3>
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
              </div>

              {/* Me Image */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium mb-4 uppercase tracking-wide text-sm">Homepage About Section</h3>
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
              </div>
            </div>

            {Object.keys(settingsPreview).length > 0 && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSettingsPreview({})}
                  className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="px-6 py-3 bg-brand-dark text-white rounded hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
