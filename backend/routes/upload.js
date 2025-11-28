const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private/Admin
router.post('/image', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the file path that can be used to access the image
        const imagePath = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imagePath: imagePath,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// Handle multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size is too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ message: error.message });
    }
    next(error);
});

module.exports = router;
