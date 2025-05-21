const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../config/auth');

// Kullanıcı oluşturma
const createUser = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Kullanıcıyı veritabanına ekle
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return reject(new Error('Bu kullanıcı adı zaten kullanılıyor'));
            }
            return reject(new Error('Kayıt sırasında bir hata oluştu'));
          }
          
          const user = {
            id: this.lastID,
            username
          };
          
          // Token oluştur
          const token = generateToken(user);
          resolve({ user, token });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

// Kullanıcı giriş
const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        return reject(new Error('Giriş sırasında bir hata oluştu'));
      }
      
      if (!user) {
        return reject(new Error('Kullanıcı adı veya şifre yanlış'));
      }
      
      // Şifre kontrolü
      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return reject(new Error('Kullanıcı adı veya şifre yanlış'));
        }
        
        // Gizli bilgileri filtreleme
        const filteredUser = {
          id: user.id,
          username: user.username
        };
        
        // Token oluştur
        const token = generateToken(filteredUser);
        resolve({ user: filteredUser, token });
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Kullanıcı bilgilerini getirme
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, created_at FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return reject(new Error('Kullanıcı bilgileri alınırken bir hata oluştu'));
      }
      
      if (!user) {
        return reject(new Error('Kullanıcı bulunamadı'));
      }
      
      resolve(user);
    });
  });
};

module.exports = {
  createUser,
  loginUser,
  getUserById
}; 