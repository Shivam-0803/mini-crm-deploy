# CORS Error Fix Instructions

To fix the CORS error you're encountering between your frontend and backend on Render, please follow these steps:

## 1. Update Your Backend Environment Variables (on Render)

Go to your backend service on Render dashboard and update these environment variables:

```
NODE_ENV=production
CORS_ORIGIN=https://mini-crm-frontend-yt2n.onrender.com
```

## 2. Update Your Frontend Environment Variables (on Render)

Go to your frontend service on Render dashboard and ensure these variables are set correctly:

```
VITE_API_URL=https://mini-crm-backend-1z1s.onrender.com
VITE_AUTH_URL=https://mini-crm-backend-1z1s.onrender.com/auth
```

## 3. Redeploy Both Services

After updating the environment variables:

1. Go to each service in the Render dashboard
2. Click "Manual Deploy" > "Deploy latest commit"
3. Wait for both deployments to complete

## If the Error Persists

If the CORS error still appears after redeployment, try the following:

1. Clear your browser cache and cookies
2. Make sure your browser isn't blocking third-party cookies
3. Check the "Network" tab in browser dev tools to ensure requests include credentials
4. Verify that your frontend is making requests to the exact backend URL specified in the environment variables

## Testing the Backend Directly

To verify if your backend CORS configuration is working:

1. Visit https://mini-crm-backend-1z1s.onrender.com/auth/me in your browser
2. You should get a JSON response (could be a 401 Unauthorized, but not a CORS error)

The code changes to improve CORS configuration have been committed and pushed. Redeploying your services should apply these fixes. 