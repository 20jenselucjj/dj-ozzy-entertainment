import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Update meta tags dynamically
const updateMetaTags = async () => {
  try {
    const response = await fetch('/api/settings');
    const data = await response.json();
    
    if (data.settings) {
      document.title = data.settings.siteTitle || 'DJ Ozzy Entertainment';
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', data.settings.siteDescription);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', data.settings.siteTitle);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', data.settings.siteDescription);
      }
      
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', data.settings.siteTitle);
      }
      
      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', data.settings.siteDescription);
      }
    }
  } catch (error) {
    console.error('Failed to load site settings:', error);
  }
};

// Update meta tags on load
updateMetaTags();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
