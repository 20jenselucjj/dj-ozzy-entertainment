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
            meImage: '/me.png'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const settingsData = await env.EVENTS_KV.get('site_settings');
      const settings = settingsData ? JSON.parse(settingsData) : {
        aboutImage: '/About.png',
        partyImage: '/Party.png',
        meImage: '/me.png'
      };
      
      return new Response(JSON.stringify({ settings }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Settings fetch error:', error);
      return new Response(JSON.stringify({ 
        settings: {
          aboutImage: '/About.png',
          partyImage: '/Party.png',
          meImage: '/me.png'
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
