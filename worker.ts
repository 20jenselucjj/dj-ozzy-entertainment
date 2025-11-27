interface Env {
  RESEND_API_KEY: string;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle contact form POST
    if (url.pathname === '/contact' && request.method === 'POST') {
      try {
        const formData = await request.json();

        if (!formData.name || !formData.email || !formData.message) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: ['djozzyentertainment@gmail.com'],
            reply_to: formData.email,
            subject: `New Booking Inquiry from ${formData.name}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F0EAD6; margin: 0; padding: 40px 20px; }
                  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                  .header { background: #0f0f0f; color: #F0EAD6; padding: 32px 40px; border-bottom: 3px solid #F0EAD6; }
                  .header h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; }
                  .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
                  .content { padding: 40px; }
                  .field { margin-bottom: 28px; }
                  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 8px; font-weight: 600; }
                  .value { font-size: 16px; color: #0f0f0f; line-height: 1.6; }
                  .message-box { background: #f8f8f8; padding: 20px; border-radius: 4px; border-left: 3px solid #0f0f0f; margin-top: 8px; }
                  .footer { background: #f8f8f8; padding: 24px 40px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0; }
                  a { color: #0f0f0f; text-decoration: none; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Booking Inquiry</h1>
                    <p>DJ Ozzy Entertainment</p>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Name</div>
                      <div class="value">${formData.name}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Message</div>
                      <div class="message-box">${formData.message.replace(/\n/g, '<br>')}</div>
                    </div>
                  </div>
                  <div class="footer">
                    Reply directly to this email to respond to ${formData.name}
                  </div>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (!resendResponse.ok) {
          console.error('Resend API error:', await resendResponse.text());
          return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const result = await resendResponse.json();
        return new Response(JSON.stringify({ success: true, id: result.id }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // For all other requests, try to serve the asset
    // If it's not found (404), serve index.html to support client-side routing
    const response = await env.ASSETS.fetch(request);
    
    // If the asset is not found and it's not a file request (no extension),
    // serve index.html to let React Router handle the route
    if (response.status === 404 && !url.pathname.includes('.')) {
      const indexRequest = new Request(new URL('/', request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }
    
    return response;
  },
};
