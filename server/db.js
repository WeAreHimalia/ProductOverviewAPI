// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/sdc";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define schemas and models
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  product_id: Number,
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
      feature_id: Number,
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
      ],
      skus: {
        sku_id: {
          quantity: Number,
          size: String
        }
      }
    }
  ],
  related: []
})

const Product = mongoose.model("Products", ProductsSchema);

const CartSchema = new Schema({
  id: Number,
  user_session: Number,
  product_id: Number,
  active: Boolean
})

const CartItem = mongoose.model('Cart', CartSchema, 'cart');

module.exports = {
  Product,
  CartItem
};