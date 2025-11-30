interface Env {
  EVENTS_KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET - Fetch events
  if (request.method === 'GET') {
    try {
      // Check if KV is available
      if (!env.EVENTS_KV) {
        return new Response(JSON.stringify({ events: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const eventsData = await env.EVENTS_KV.get('events');
      const events = eventsData ? JSON.parse(eventsData) : [];
      
      return new Response(JSON.stringify({ events }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Events fetch error:', error);
      // Return empty events instead of error to prevent UI breaking
      return new Response(JSON.stringify({ events: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // POST - Save events
  if (request.method === 'POST') {
    try {
      // Check if KV is available
      if (!env.EVENTS_KV) {
        return new Response(JSON.stringify({ error: 'KV storage not configured. Please bind EVENTS_KV in Cloudflare Pages settings.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const { events } = await request.json() as { events: any[] };
      
      await env.EVENTS_KV.put('events', JSON.stringify(events));
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Events save error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save events' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
};
