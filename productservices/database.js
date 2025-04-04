const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/productsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true }  // ✅ Added quantity
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
