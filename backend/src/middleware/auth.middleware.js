export const isAuthenticated = (req, res, next) => {
  // Log authentication attempt for debugging
  console.log('Authentication check:', {
    isAuthenticated: req.isAuthenticated(),
    sessionID: req.sessionID,
    hasUser: !!req.user,
    userId: req.user?.id
  });
  
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Return more detailed error information
  res.status(401).json({ 
    message: 'Unauthorized', 
    details: 'User is not authenticated',
    sessionExists: !!req.session,
    sessionID: req.sessionID || 'no-session-id'
  });
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
}; 