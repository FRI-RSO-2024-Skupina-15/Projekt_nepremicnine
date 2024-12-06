const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Property = require('./models/property');
require('dotenv').config();

const mongo_uri = process.env.MONGO_URI;

console.log("MONGO URI:", mongo_uri)

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*mongoose.connect(mongo_uri).then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });*/

/*mongoose.connect(mongo_uri).then(() => {
    const newProperty = Property({
        price: 360000,
        type: "House",
        location: {
            city: 'Ljubljana',
            country: 'Slovenia',
        },
        size: 196,
        plotSize: 781,
        floors: 3,
        bedrooms: 5,
        bathrooms: 1,
        toilets: 1,
        constructionYear: 1960,
        renovationYear: 2022,
        energyRating: 'C',
        parkingSpaces: 3,
        amenities: ['Internet', 'Radiators', 'Heat Pump', 'Storage'],
        contact: {
            name: 'Ana Novak',
            email: 'ana.novak@email.com',
            phone: '0123456789',
        },
    })

    newProperty.save()
    .then(() => console.log('New property saved'))
    .catch((err) => console.log('Error saving property:', err));
}).catch((err) => {
  console.log('MongoDB connection error:', err);
});*/

/*app.get('/properties', (req, res) => {
    const { minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, type } = req.query;

    // Build the filter object based on provided parameters
    const filter = {};
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
});*/

const properties = [
    { id: 1, name: "Cozy Apartment!!!!", location: "New York", price: 1200 },
    { id: 2, name: "Luxury Villa!!!!!", location: "Los Angeles", price: 4500 },
    { id: 3, name: "Beach House!!!!!", location: "Miami", price: 2500 }
];

app.get('/properties', (req, res) => {
    res.json(properties);
});

/*
app.post('/property', async (req, res) => {
    try {
        const {
            price,
            type,
            location,
            size,
            plotSize,
            floors,
            bedrooms,
            bathrooms,
            toilets,
            constructionYear,
            renovationYear,
            energyRating,
            parkingSpaces,
            amenities,
            contact
        } = req.body;

        // Validate required fields
        if (!price || !type || !location || !size || !bedrooms || !contact) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate nested fields
        if (!location.city || !location.country) {
            return res.status(400).json({ message: 'Location must include city and country' });
        }
        if (!contact.name || !contact.email || !contact.phone) {
            return res.status(400).json({ message: 'Contact must include name, email, and phone' });
        }

        // Create a new property instance
        const newProperty = new Property({
            price,
            type,
            location,
            size,
            plotSize,
            floors,
            bedrooms,
            bathrooms,
            toilets,
            constructionYear,
            renovationYear,
            energyRating,
            parkingSpaces,
            amenities,
            contact
        });

        // Save to the database
        await newProperty.save();
        console.log('New property saved');
        res.status(201).json({ message: 'Property created successfully', property: newProperty });
    } catch (err) {
        console.error('Error saving property:', err);
        res.status(500).json({ message: 'Error creating property', error: err.message });
    }
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});