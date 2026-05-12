const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    console.log('No auth header provided');
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1] || authHeader;

  if (!token) {
    console.log('No token in auth header');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
