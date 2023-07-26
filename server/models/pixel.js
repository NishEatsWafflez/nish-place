const { Long, Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the Pixel schema
const PixelSchema = new Schema({
  id: {type: Number, required: true},
  color: { type: String, required: true }    
});


// Exports the PostSchema for use elsewhere.
module.exports = mongoose.model('Pixel', PixelSchema);