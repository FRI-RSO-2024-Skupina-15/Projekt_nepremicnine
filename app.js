const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Property = require('./models/property');

const mongo_uri = 'mongodb+srv://kristofzupan00:yN25gGAVnEP8FuIc@projekt-nepremicnine.sy8ia.mongodb.net';

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongo_uri).then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

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

const properties = [
    { id: 1, name: "Cozy Apartment", location: "New York", price: 1200 },
    { id: 2, name: "Luxury Villa", location: "Los Angeles!!!!!", price: 4500 },
    { id: 3, name: "Beach House", location: "Miami!!!!", price: 2500 }
];

app.get('/properties', (req, res) => {
    Property.find({})
    .then((properties) => {
      res.json(properties); // Send the retrieved properties as JSON response
    })
    .catch((err) => {
      console.error('Error fetching properties:', err);
      res.status(500).send('Error retrieving properties'); // Handle errors
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});