const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');

router.use('/api', userRoutes);
router.use('/api', fileRoutes);

// Sağlık kontrolü
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sunucu çalışıyor' });
});

module.exports = router; 