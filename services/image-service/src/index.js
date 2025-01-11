const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const swagger = require('./swagger');
const path = require('path');
require('dotenv').config();

const mongo_uri = process.env.MONGO_URI;

console.log("MONGO URI:", mongo_uri)

const propertiesRoutes = require('./routes/images');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/images/docs', swagger.serve, swagger.setup);

mongoose.connect(mongo_uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/images', propertiesRoutes);
app.use('/api/images/uploads', express.static('uploads'));

app.get('/api/images/health', (req, res) => {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
        res.status(200).json({ status: 'healthy', database: 'connected' });
    } else {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Properties service running on port ${PORT}`));