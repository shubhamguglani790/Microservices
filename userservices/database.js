const mongoose = require('mongoose');

// Connect to MongoDB (remove deprecated options)
mongoose.connect('mongodb://127.0.0.1:27017/productsDB')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection failed:', err.message));

// Define User Schema and Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', UserSchema);

module.exports = User; // Export only the User model
