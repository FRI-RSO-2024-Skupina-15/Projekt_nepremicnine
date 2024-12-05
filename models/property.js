var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String, // e.g., 'House', 'Apartment'
      required: true,
    },
    location: {
      city: {
        type: String, // e.g., 'Ljubljana'
        required: true,
      },
      country: {
        type: String, // optional or can be added based on requirements
      },
    },
    size: {
      type: Number, // in square meters, e.g., 100
      required: true,
    },
    plotSize: {
      type: Number, // in square meters, e.g., 781
    },
    floors: {
      type: Number, // number of floors, e.g., 3
    },
    bedrooms: {
      type: Number, // number of bedrooms
    },
    bathrooms: {
      type: Number, // number of bathrooms
    },
    toilets: {
        type: Number, // number of toilets
    },
    constructionYear: {
      type: Number, // year of construction
      required: true,
    },
    renovationYear: {
      type: Number, // year of last renovation
    },
    energyRating: {
      type: String, // e.g., 'C'
    },
    parkingSpaces: {
      type: Number, // number of parking spaces
    },
    amenities: {
      type: [String], // e.g., ['Internet', 'Radiators', 'Air conditioning']
    },
    contact: {
      name: {
        type: String, // e.g., 'Ana Novak'
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