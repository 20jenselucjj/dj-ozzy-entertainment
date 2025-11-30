interface Env {
  ADMIN_PASSWORD: string;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { password } = await request.json() as { password: string };
    
    // Check password against environment variable
    const isValid = password === env.ADMIN_PASSWORD;
    
    if (isValid) {
      // Generate a simple session token (in production, use JWT or similar)
      const token = btoa(`${Date.now()}-${Math.random()}`);
      
      return new Response(JSON.stringify({ success: true, token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
