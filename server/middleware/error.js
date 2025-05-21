// Hata yakalama middleware'i
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Multer hataları
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Dosya boyutu 10MB\'ı geçemez' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  // Genel hata
  res.status(500).json({ error: 'Sunucu hatası' });
};

// 404 - Sayfa bulunamadı
const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Sayfa bulunamadı' });
};

module.exports = {
  errorHandler,
  notFound
}; 