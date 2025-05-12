export const isAuthenticated = (req, res, next) => {
  // TEMPORARY: Always allow authentication for debugging
  console.log('⚠️ TEMPORARY AUTHENTICATION BYPASS ENABLED');
  return next();
  
  // Original authentication logic below (currently bypassed)
  /*
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
  */
};

export const isAdmin = (req, res, next) => {
  // TEMPORARY: Always allow admin access for debugging
  return next();
  
  // Original admin check logic (currently bypassed)
  /*
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
  */
}; 