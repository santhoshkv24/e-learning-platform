// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

// Configure multer for temporary file storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload file to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto', // Automatically detect file type (video, image, etc.)
    });

    // Return the Cloudinary URL
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;