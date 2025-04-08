const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 5003;

// In-memory user store (replace with DB)
const users = [];

const JWT_SECRET = 'mysecretkey123';

app.use(cors());
app.use(express.json());

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.json({ message: 'User registered successfully' });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Auth Microservice running on http://localhost:${PORT}`);
});
