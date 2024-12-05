const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const properties = [
    { id: 1, name: "Cozy Apartment", location: "New York", price: 1200 },
    { id: 2, name: "Luxury Villa", location: "Los Angeles!!!!!", price: 4500 },
    { id: 3, name: "Beach House", location: "Miami!!!!", price: 2500 }
];

app.get('/properties', (req, res) => {
    res.json(properties);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});