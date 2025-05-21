const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/upload');

// Tüm dosya route'ları korumalı
router.use(authenticateToken);

// Dosya yükleme
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Dosya listeleme
router.get('/files', fileController.getFiles);

// Dosya silme
router.delete('/files/:id', fileController.deleteFile);

module.exports = router; 