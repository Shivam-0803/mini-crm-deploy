# Google OAuth Configuration Instructions

To fix the authentication redirection issues, please follow these steps carefully:

## 1. Update Your Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID and click to edit it
3. Make sure you have these settings:

   **Authorized JavaScript Origins:**
   - https://mini-crm-frontend-yt2n.onrender.com
   - https://mini-crm-backend-1z1s.onrender.com
   - http://localhost:5174 (for local development)
   - http://localhost:3001 (for local development)

   **Authorized Redirect URIs:**
   - https://mini-crm-backend-1z1s.onrender.com/auth/google/callback
   - http://localhost:3001/auth/google/callback (for local development)

4. Save your changes

## 2. Update Your Backend Environment Variables

Go to your backend service on Render and update these environment variables:

```
NODE_ENV=production
FRONTEND_URL=https://mini-crm-frontend-yt2n.onrender.com
GOOGLE_CALLBACK_URL=https://mini-crm-backend-1z1s.onrender.com/auth/google/callback
```

## 3. Redeploy Your Backend

After updating the environment variables and Google Cloud settings:

1. Go to your backend service in the Render dashboard
2. Click "Manual Deploy" > "Deploy latest commit"
3. Wait for the deployment to complete

## Testing Authentication Flow

1. Go to your frontend URL: https://mini-crm-frontend-yt2n.onrender.com
2. Click "Login with Google"
3. Complete the Google sign-in process
4. You should be redirected back to your frontend application with a successful login

## Troubleshooting

If you still experience issues:

1. **Check the Environment Variables:** Make sure all environment variables are set correctly on Render.
2. **Check Google OAuth Settings:** Verify all URIs are correctly entered in Google Cloud Console.
3. **Clear Browser Cookies:** Clear cookies for your application domains.
4. **Check Browser Console:** Look for any error messages during the authentication process.
5. **Check Backend Logs:** On Render, check your backend logs for authentication-related errors.

The authentication flow should now properly redirect to your frontend application after successful login. 