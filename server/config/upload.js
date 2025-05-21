const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dosyaların saklanacağı klasörü oluştur
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  // Kabul edilen dosya tipleri: PDF, PNG, JPG
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya türü! Sadece PDF, PNG ve JPG dosyaları yükleyebilirsiniz.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = {
  upload,
  uploadsDir
}; 