const express = require('express');
const router = express.Router();
const Property = require('../models/property');

router.get('/properties', (req, res) => {
    const { city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, type } = req.query;

    // Build the filter object based on provided parameters
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
      res.json(properties); // Send the retrieved properties as JSON response
    })
    .catch((err) => {
      console.error('Error fetching properties:', err);
      res.status(500).send('Error retrieving properties'); // Handle errors
    });
});

router.post('/properties', async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        
        // Trigger notification service
        /*await fetch(process.env.NOTIFICATION_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: property._id })
        });*/
        
        res.status(201).json(property);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;