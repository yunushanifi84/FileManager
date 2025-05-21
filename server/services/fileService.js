const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const { uploadsDir } = require('../config/upload');

// Dosya kaydetme
const saveFile = (fileData, userId) => {
  const { filename, originalname, mimetype, size } = fileData;
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO files (filename, originalname, mimetype, size, user_id) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, mimetype, size, userId],
      function (err) {
        if (err) {
          return reject(new Error('Dosya kaydedilirken bir hata oluştu'));
        }
        
        const fileId = this.lastID;
        resolve({
          id: fileId,
          filename,
          originalname,
          mimetype,
          size,
          url: `/uploads/${filename}`
        });
      }
    );
  });
};

// Kullanıcının dosyalarını listeleme
const getFilesByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, files) => {
        if (err) {
          return reject(new Error('Dosyalar listelenirken bir hata oluştu'));
        }
        
        // Dosya URL'lerini ekle
        const filesWithUrls = files.map(file => ({
          ...file,
          url: `/uploads/${file.filename}`
        }));
        
        resolve(filesWithUrls);
      }
    );
  });
};

// Dosya bilgilerini getirme
const getFileById = (fileId, userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, userId],
      (err, file) => {
        if (err) {
          return reject(new Error('Dosya bilgileri alınırken bir hata oluştu'));
        }
        
        if (!file) {
          return reject(new Error('Dosya bulunamadı'));
        }
        
        // Dosya URL'sini ekle
        file.url = `/uploads/${file.filename}`;
        resolve(file);
      }
    );
  });
};

// Dosya silme
const deleteFile = (fileId, userId) => {
  return new Promise((resolve, reject) => {
    // Önce dosyayı veritabanından bul
    getFileById(fileId, userId)
      .then(file => {
        // Dosyayı veritabanından sil
        db.run(
          'DELETE FROM files WHERE id = ? AND user_id = ?',
          [fileId, userId],
          (err) => {
            if (err) {
              return reject(new Error('Dosya silinirken bir hata oluştu'));
            }
            
            // Dosyayı disk'ten sil
            const filePath = path.join(uploadsDir, file.filename);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Dosya diskten silinirken hata:', err);
                // Veritabanından silindi ama diskten silinemedi - loglayalım ama hatayı dönmeyelim
              }
              
              resolve({ message: 'Dosya başarıyla silindi' });
            });
          }
        );
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  saveFile,
  getFilesByUserId,
  getFileById,
  deleteFile
}; 