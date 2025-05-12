const requiredEnvVars = [
  'VITE_API_URL',
  'VITE_AUTH_URL',
  'VITE_GOOGLE_CLIENT_ID',
];

const validateEnvVars = () => {
  const missingVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    authUrl: import.meta.env.VITE_AUTH_URL,
  },
  auth: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    },
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Mini CRM',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Modern CRM Platform',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  },
};

// Validate environment variables in development
if (import.meta.env.DEV) {
  validateEnvVars();
}

export default config; 