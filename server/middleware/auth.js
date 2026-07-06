import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token found in Bearer schema, authorization denied' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_portfolio_key_for_admin_login_security_2026';
    const decoded = jwt.verify(token, secret);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired, authorization denied', error: err.message });
  }
}
