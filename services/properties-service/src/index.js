const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const swagger = require('./swagger');
require('dotenv').config();

const mongo_uri = process.env.MONGO_URI;

console.log("MONGO URI:", mongo_uri)

const propertiesRoutes = require('./routes/properties');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api-docs', swagger.serve, swagger.setup);

mongoose.connect(mongo_uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/properties', propertiesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Properties service running on port ${PORT}`));