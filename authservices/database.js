const mongoose = require('mongoose');

// Connect to AuthDB (separate or shared DB)
mongoose.connect('mongodb://127.0.0.1:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB (authDB) connected successfully'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));

// Define Auth User Schema
const AuthUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Export the model
const AuthUser = mongoose.model('AuthUser', AuthUserSchema);
module.exports = AuthUser;
