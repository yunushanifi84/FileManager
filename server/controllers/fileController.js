const fileService = require('../services/fileService');

// Dosya yükleme
const uploadFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Lütfen bir dosya seçin' });
  }

  try {
    const file = await fileService.saveFile(req.file, req.user.id);
    res.status(201).json({
      message: 'Dosya başarıyla yüklendi',
      file
    });
  } catch (error) {
    next(error);
  }
};

// Dosya listeleme
const getFiles = async (req, res, next) => {
  try {
    const files = await fileService.getFilesByUserId(req.user.id);
    res.json(files);
  } catch (error) {
    next(error);
  }
};

// Dosya silme
const deleteFile = async (req, res, next) => {
  const fileId = req.params.id;
  
  try {
    const result = await fileService.deleteFile(fileId, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message.includes('Dosya bulunamadı')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile
}; 