// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/sdc";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  id: Number,
  campus: String,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  created_at: Date,
  updated_at: Date,
  features: [
    {
      feature: String,
      value: String
    }
  ],
  results: [
    {
      style_id: Number,
      name: String,
      original_price: String,
      sale_price: String,
      default: Boolean,
      photos: [
        {
          thumbnail_url: String,
          url: String,
        }
      ]
    }
  ],
  related: []
})

// Compile model from schema
const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;