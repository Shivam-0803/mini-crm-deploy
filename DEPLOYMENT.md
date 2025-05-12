# Deployment Guide for Mini CRM

This guide provides step-by-step instructions for deploying the Mini CRM application on Render.com.

## Prerequisites

Before you begin, ensure you have:

1. A [Render.com](https://render.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/atlas/database) account for database hosting
3. An [OpenAI API key](https://platform.openai.com/api-keys) for AI features
4. [Google OAuth credentials](https://console.cloud.google.com/apis/credentials) for authentication

## Step 1: Set Up the MongoDB Database

1. Create a new MongoDB Atlas cluster (or use an existing one)
2. Set up a database user with password authentication
3. Whitelist all IPs (`0.0.0.0/0`) or specific Render.com IPs
4. Note your MongoDB connection string: `mongodb+srv://<username>:<password>@<cluster>/<database>`

## Step 2: Configure Environment Variables

Before deploying, prepare the following environment variables:

### Backend Environment Variables
- `PORT`: 3001
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `JWT_EXPIRES_IN`: 24h
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: https://mini-crm-backend.onrender.com/auth/google/callback
- `OPENAI_API_KEY`: Your OpenAI API key
- `CORS_ORIGIN`: https://mini-crm-frontend.onrender.com

### Frontend Environment Variables
- `VITE_API_URL`: https://mini-crm-backend.onrender.com
- `VITE_AUTH_URL`: https://mini-crm-backend.onrender.com/auth
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

## Step 3: Deploy on Render.com

### Using the Deploy to Render Button

The easiest way to deploy is using the "Deploy to Render" button in the project README.

1. Click the button to be redirected to Render
2. Connect your GitHub repository
3. Render will automatically create two services based on the `render.yaml` file
4. Enter the required environment variables when prompted
5. Wait for the deployment to complete

### Manual Deployment

#### Backend Deployment

1. Log in to your Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: mini-crm-backend
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add all the backend environment variables listed above

#### Frontend Deployment

1. Create another Web Service in Render
2. Connect to the same GitHub repository
3. Configure the service:
   - Name: mini-crm-frontend
   - Environment: Node
   - Build Command: `cd crm-frontend && npm install && npm run build`
   - Start Command: `cd crm-frontend && npx serve -s dist`
   - Add the frontend environment variables listed above

## Step 4: Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add the following Authorized redirect URIs:
   - `https://mini-crm-backend.onrender.com/auth/google/callback`
   - `http://localhost:3001/auth/google/callback` (for local development)
5. Save the changes

## Step 5: Verify Deployment

1. Wait for both services to complete their initial deployment
2. Visit your frontend URL (e.g., https://mini-crm-frontend.onrender.com)
3. Test the authentication flow by signing in with Google
4. Test creating segments, campaigns, and other core features

## Troubleshooting

- **CORS Issues**: Ensure the CORS_ORIGIN in the backend matches your frontend URL
- **Authentication Errors**: Verify Google OAuth credentials and callback URLs
- **Database Connection**: Check MongoDB connection string and network access settings
- **API Problems**: Verify the OpenAI API key is correct and has sufficient credits

## Local Development After Deployment

To continue developing locally:

1. Create `.env` files in both the backend and frontend directories
2. Use the same environment variables but with local URLs
3. Run the application with `npm run dev` in each directory 