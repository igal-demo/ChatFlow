const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  const status = await validateJwt(req);
  
  if(!status.errorMessage){
    return next();
  }

  res.status(401).json({ message: status.errorMessage});
};

const validateJwt = async(req) => {
  if (!req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')) {
      return {errorMessage: "Not authorized, missing token"};
  }
  
  try{
    // Extract token
    const token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');

    // Verfiy user exists
    const user = await User.findById(decoded.userId).select('-password');;
    if(!user){
      return {errorMessage: 'Not authorized, unknown user'};
    }

    // Attach user to request (excluding password)
     req.user = user;
    return {user};
  }catch (error) {
    console.error('Auth error:', error);
    return { errorMessage: 'Not authorized, token failed' };
  }
}

module.exports = { protect, validateJwt};
