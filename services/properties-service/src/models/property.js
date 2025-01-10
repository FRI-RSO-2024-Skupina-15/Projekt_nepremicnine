var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String, 
      required: true,
    },
    location: {
      city: {
        type: String, 
        required: true,
      },
      country: {
        type: String, 
      },
    },
    size: {
      type: Number, 
      required: true,
    },
    plotSize: {
      type: Number, 
    },
    floors: {
      type: Number, 
    },
    bedrooms: {
      type: Number, 
    },
    bathrooms: {
      type: Number, 
    },
    toilets: {
        type: Number, 
    },
    constructionYear: {
      type: Number, 
      required: true,
    },
    renovationYear: {
      type: Number, 
    },
    energyRating: {
      type: String, 
    },
    parkingSpaces: {
      type: Number, 
    },
    amenities: {
      type: [String], 
    },
    contact: {
      name: {
        type: String, 
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },
    listingDate: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Property', PropertySchema);