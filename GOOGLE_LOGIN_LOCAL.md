# Google login for the local clone

The Google `400: origin_mismatch` screen means the current browser origin is not authorized for the selected OAuth client. Google checks this before a credential reaches CodeTrack's backend. Changing CORS or JWT verification cannot fix this provider-side restriction.

Use a separate development OAuth client to preserve production settings:

1. In a development Google Cloud project, create or select an OAuth client of type **Web application** in **Google Auth Platform → Clients**.
2. Under **Authorized JavaScript origins**, add `http://localhost` and `http://localhost:5180`. Include the exact scheme, hostname and port; no path or trailing slash. If you use `127.0.0.1`, authorize that origin separately.
3. Save the client. If the consent screen is in testing and requires test users, add the account you will use to the development project's test users.
4. Put that same public client ID into both local files:

   - `CodeTrack/.env.local`: `VITE_GOOGLE_CLIENT_ID=YOUR_DEV_CLIENT_ID.apps.googleusercontent.com`
   - `CodeTrack/server/.env.local`: `GOOGLE_CLIENT_ID=YOUR_DEV_CLIENT_ID.apps.googleusercontent.com`

5. Restart Vite and the local backend, then reload `http://localhost:5180/login` and retry Google sign-in. The backend verifies the Google ID token against the configured client ID.

The current flow uses a Google Identity Services credential popup, so this origin error is resolved using **Authorized JavaScript origins**, not by inventing a backend OAuth redirect URL. Google may take time to apply saved OAuth configuration.

Email/password login remains available while the development OAuth client is configured. No production OAuth client, database, or deployment was changed.

Official setup reference: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
