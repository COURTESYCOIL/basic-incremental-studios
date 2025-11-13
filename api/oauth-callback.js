// api/oauth-callback.js
// Place this in your Vercel project at api/oauth-callback.js

export default function handler(req, res) {
  // Handle both GET and POST requests
  if (req.method === 'GET' || req.method === 'POST') {
    const body = req.body || {};
    const query = req.query || {};
    
    // Extract token from body or query
    let access_token = body.access_token || query.access_token;
    const error = body.error || query.error;
    
    // Note: The hash is not sent to the server by the browser, so we need to handle it client-side
    // Return HTML that will extract token from the URL hash and forward it to the opener
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Google OAuth Callback</title>
        <style>
          body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { text-align: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .spinner { border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { margin: 0; font-size: 24px; }
          p { color: rgba(255,255,255,0.8); margin-top: 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h2>Completing sign-in...</h2>
          <p id="debug"></p>
        </div>
        <script>
          function extractTokenFromHash() {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            return hashParams.get('access_token');
          }
          
          const token = extractTokenFromHash();
          const debug = document.getElementById('debug');
          
          if (token) {
            debug.textContent = 'Token found, sending...';
            if (window.opener) {
              try {
                window.opener.postMessage({
                  access_token: token,
                  type: 'GOOGLE_AUTH_SUCCESS'
                }, '*');
                debug.textContent = 'Token sent to parent window';
                setTimeout(() => { window.close(); }, 500);
              } catch (e) {
                debug.textContent = 'Error: ' + e.message;
              }
