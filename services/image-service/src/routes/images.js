const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/image');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - propertyId
 *         - filename
 *       properties:
 *         propertyId:
 *           type: string
 *           description: The ID of the property this image belongs to
 *         filename:
 *           type: string
 *           description: The name of the file in the storage system
 *         originalName:
 *           type: string
 *           description: Original filename as uploaded by the user
 *         mimetype:
 *           type: string
 *           description: MIME type of the image
 *         size:
 *           type: number
 *           description: Size of the image in bytes
 *         url:
 *           type: string
 *           description: URL to access the full-size image
 *         thumbnailUrl:
 *           type: string
 *           description: URL to access the image thumbnail
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the image was uploaded
 */

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

/**
 * @swagger
 * /api/images/property/{propertyId}:
 *   get:
 *     summary: Get all images for a specific property
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the property
 *     responses:
 *       200:
 *         description: List of images for the property
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *       500:
 *         description: Server error
 */
router.get('/property/:propertyId', async (req, res) => {
    try {
        const images = await Image.find({ propertyId: req.params.propertyId });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/images/upload/{propertyId}:
 *   post:
 *     summary: Upload multiple images for a property
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the property
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple image files (max 10)
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *       400:
 *         description: Invalid property ID or file format
 *       500:
 *         description: Server error
 */
router.post('/upload/:propertyId', upload.array('images', 10), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.propertyId)) {
            return res.status(400).json({ error: 'Invalid property ID' });
        }

        const uploadedImages = [];
        for (const file of req.files) {
            const image = new Image({
                propertyId: req.params.propertyId,
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `/uploads/${file.filename}`,
                thumbnailUrl: `/uploads/thumbnails/${file.filename}`
            });
            await image.save();
            uploadedImages.push(image);
        }
        
        res.status(201).json(uploadedImages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/images/{imageId}:
 *   delete:
 *     summary: Delete a specific image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.delete('/:imageId', async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.imageId);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        // You should also delete the actual file from storage here
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/health', async (req, res) => {
    try {
        // Check MongoDB connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        const health = {
            status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: dbStatus,
            },
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime()
        };

        res.status(health.status === 'healthy' ? 200 : 503).json(health);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

module.exports = router;