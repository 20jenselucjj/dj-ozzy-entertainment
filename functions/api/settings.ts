interface Env {
  EVENTS_KV: any;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET - Fetch settings
  if (request.method === 'GET') {
    try {
      if (!env.EVENTS_KV) {
        return new Response(JSON.stringify({ 
          settings: {
            aboutImage: '/About.png',
            partyImage: '/Party.png',
            meImage: '/me.png',
            heroLine1: 'Party',
            heroLine2: 'With',
            heroLine3: 'DJ Ozzy',
            heroTagline: 'FOR THE YOUTH BY THE YOUTH',
            contactLocation: 'Southern Utah',
            contactEmail: 'djozzyentertainment@gmail.com',
            contactPhone: '+1 (435) 862-4679'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const settingsData = await env.EVENTS_KV.get('site_settings');
      const defaults = {
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
        service1Title: 'Your Music, Your Way',
        service1Subtitle: 'Custom Playlists',
        service1Description: "Tell me what you want to hear and I'll make it happen. Whether you're into the latest hits, throwbacks, or a mix of everything, I'll put together a playlist that keeps everyone vibing all night long.",
        service2Title: 'Quality Sound & Lights',
        service2Subtitle: 'Professional Setup',
        service2Description: "I bring legit equipment that sounds amazing and looks even better. Clear audio, awesome lighting effects—everything you need to turn your venue into the place to be.",
        service3Title: 'Reading the Room',
        service3Subtitle: 'Keeping It Live',
        service3Description: "I know when to turn it up and when to bring it down. I'll watch the crowd and adjust on the fly to make sure everyone's having a good time, not just standing around.",
        
        // Contact (NOT editable - hardcoded)
        contactTitle: "Let's Make It Happen",
        contactDescription: "Got an event coming up? Whether it's a school dance, birthday party, or any celebration in Southern Utah, hit me up and let's talk about making it unforgettable. I'm flexible with dates and budgets.",
        contactLocation: 'Southern Utah',
        contactEmail: 'djozzyentertainment@gmail.com',
        contactPhone: '+1 (435) 862-4679',
        
        // SEO
        siteTitle: 'DJ Ozzy | DJ Ozzy Entertainment - Southern Utah DJ Services',
        siteDescription: 'DJ Ozzy - Professional DJ services in Southern Utah for weddings, school dances, corporate events, and parties. Book DJ Ozzy Entertainment for unforgettable entertainment experiences.',
        
        // Social Media
        instagramUrl: 'https://instagram.com/djozzy'
      };
      
      const settings = settingsData ? { ...defaults, ...JSON.parse(settingsData) } : defaults;
      
      return new Response(JSON.stringify({ settings }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Settings fetch error:', error);
      return new Response(JSON.stringify({ 
        settings: {
          aboutImage: '/About.png',
          partyImage: '/Party.png',
          meImage: '/me.png',
          heroLine1: 'Party',
          heroLine2: 'With',
          heroLine3: 'DJ Ozzy',
          heroTagline: 'FOR THE YOUTH BY THE YOUTH',
          contactLocation: 'Southern Utah',
          contactEmail: 'djozzyentertainment@gmail.com',
          contactPhone: '+1 (435) 862-4679'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // POST - Save settings (requires authentication)
  if (request.method === 'POST') {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (!env.EVENTS_KV) {
        return new Response(JSON.stringify({ error: 'KV storage not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const { settings } = await request.json() as { settings: any };
      
      await env.EVENTS_KV.put('site_settings', JSON.stringify(settings));
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Settings save error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
};
