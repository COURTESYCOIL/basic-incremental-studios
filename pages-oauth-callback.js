// pages/oauth-callback.js (for Next.js)
// Place this file in your Next.js project at pages/oauth-callback.js

export default function OAuthCallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Google OAuth Callback</title>
        <style>{`
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .container {
            text-align: center;
            color: white;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 {
            margin: 0;
            font-size: 24px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="spinner"></div>
          <h2>Completing sign-in...</h2>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          function getTokenFromUrl() {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get('access_token');
            
            if (token) {
              return token;
            }
            
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.get('access_token');
          }

          const token = getTokenFromUrl();

          if (token) {
            if (window.opener) {
              window.opener.postMessage({
                access_token: token,
                type: 'GOOGLE_AUTH_SUCCESS'
              }, '*');
              
              setTimeout(() => {
                window.close();
              }, 500);
            } else {
              document.querySelector('.container h2').textContent = 'Error: No parent window found';
            }
          } else {
            const errorParams = new URLSearchParams(window.location.search);
            const error = errorParams.get('error');
            const errorDescription = errorParams.get('error_description');
            
            if (error) {
              document.querySelector('.container h2').textContent = 'Error: ' + error;
              if (errorDescription) {
                document.body.innerHTML += '<p style="color: rgba(255,255,255,0.8); margin-top: 20px;">' + decodeURIComponent(errorDescription) + '</p>';
              }
            } else {
              document.querySelector('.container h2').textContent = 'Error: No token received';
            }
          }
        `}} />
      </body>
    </html>
  );
}
