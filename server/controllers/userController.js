const userService = require('../services/userService');

// Kullanıcı kaydı
const register = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir' });
  }

  try {
    const { user, token } = await userService.createUser(username, password);
    res.status(201).json({ 
      message: 'Kayıt başarılı', 
      user, 
      token 
    });
  } catch (error) {
    if (error.message.includes('zaten kullanılıyor')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// Kullanıcı girişi
const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir' });
  }

  try {
    const { user, token } = await userService.loginUser(username, password);
    res.json({ 
      message: 'Giriş başarılı', 
      user, 
      token 
    });
  } catch (error) {
    if (error.message.includes('Kullanıcı adı veya şifre yanlış')) {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

// Kullanıcı profili
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    if (error.message.includes('Kullanıcı bulunamadı')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
}; 