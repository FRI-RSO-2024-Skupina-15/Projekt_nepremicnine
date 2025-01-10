const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    },
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    thumbnailUrl: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Image', imageSchema);