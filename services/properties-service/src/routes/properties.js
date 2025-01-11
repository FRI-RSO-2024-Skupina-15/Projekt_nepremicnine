const express = require('express');
const router = express.Router();
const Property = require('../models/property');

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - location
 *         - price
 *         - size
 *         - bedrooms
 *         - bathrooms
 *         - type
 *       properties:
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *         price:
 *           type: number
 *         size:
 *           type: number
 *         bedrooms:
 *           type: number
 *         bathrooms:
 *           type: number
 *         type:
 *           type: string
 *           enum: [apartment, house, commercial]
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties with optional filters
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name filter
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: minArea
 *         schema:
 *           type: number
 *         description: Minimum area in square meters
 *       - in: query
 *         name: maxArea
 *         schema:
 *           type: number
 *         description: Maximum area in square meters
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: number
 *         description: Number of bedrooms
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: number
 *         description: Number of bathrooms
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [apartment, house, commercial]
 *         description: Property type
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
    const { city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, type } = req.query;

    const filter = {};
    if (city) filter['location.city'] = city;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (minArea) filter.size = { $gte: minArea };
    if (maxArea) filter.size = { ...filter.size, $lte: maxArea };
    if (bedrooms) filter.bedrooms = bedrooms;
    if (bathrooms) filter.bathrooms = bathrooms;
    if (type) filter.type = type;

    Property.find(filter)
    .then((properties) => {
      res.json(properties);
    })
    .catch((err) => {
      console.error('Error fetching properties:', err);
      res.status(500).send('Error retrieving properties');
    });
});

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Invalid request body
 */
router.post('/', async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;