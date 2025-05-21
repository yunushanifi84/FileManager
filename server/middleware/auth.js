const { verifyToken } = require('../config/auth');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
  
  req.user = user;
  next();
};

module.exports = {
  authenticateToken
}; 