import { createClient } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: config.redis.url,
  password: config.redis.password,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect to Redis
await redisClient.connect();

// Cache middleware
export const cache = (duration = 300) => async (req, res, next) => {
  if (!config.features.caching) {
    return next();
  }

  const key = `cache:${req.originalUrl}`;
  
  try {
    const cachedResponse = await redisClient.get(key);
    
    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json
    res.json = function (data) {
      redisClient.setEx(key, duration, JSON.stringify(data));
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache Error:', error);
    next();
  }
};

// Rate limiting middleware
export const rateLimit = () => async (req, res, next) => {
  if (!config.features.rateLimiting) {
    return next();
  }

  const key = `ratelimit:${req.ip}`;
  const { window, maxRequests } = config.security.rateLimit;

  try {
    const requests = await redisClient.incr(key);
    
    if (requests === 1) {
      await redisClient.expire(key, window);
    }

    if (requests > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: window,
      });
    }

    next();
  } catch (error) {
    console.error('Rate Limit Error:', error);
    next();
  }
};

// Cache helper functions
export const cacheHelper = {
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache Get Error:', error);
      return null;
    }
  },

  async set(key, value, duration = 300) {
    try {
      await redisClient.setEx(key, duration, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache Set Error:', error);
      return false;
    }
  },

  async del(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache Delete Error:', error);
      return false;
    }
  },

  async clear(pattern = '*') {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache Clear Error:', error);
      return false;
    }
  },
};

export default redisClient; 