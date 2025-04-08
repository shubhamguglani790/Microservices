const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3003;

const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const ORDER_SERVICE_URL = "http://localhost:5000";
const upload = multer({ dest: 'temp/' }); // t
const AUTH_SERVICE_URL = "http://localhost:5003";
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.send('Welcome');
  res.end()
})

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

//all users
app.get('/users', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/users');
    res.json(response?.data)
  } catch (error) {
    console.log(error);
  }
})


//all orders

app.get("/orders", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/orders");
    res.json({ orders: response.data });
  } catch (error) {
    console.error("Error fetching orders:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



//all products
app.get('/products', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5002/products');
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


//Adding product

app.post('/products/add', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    for (const key in req.body) {
      form.append(key, req.body[key]);
    }
    if (req.file) {
      form.append('image', fs.createReadStream(req.file.path), req.file.originalname);
    }

    const response = await axios.post('http://localhost:5002/products/add', form, {
      headers: form.getHeaders(),
    });

    if (req.file) fs.unlinkSync(req.file.path); // Clean up temp file
    res.status(201).json(response.data);
  } catch (error) {
    console.error("❌ Error adding product:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to add product" });
  }
});

//deleting product

app.delete('/products/delete', async (req, res) => {
  try {
    const response = await axios.delete('http://localhost:5002/products/delete', {
      data: req.body, // { _id: '...' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error deleting product:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});



//updating product

app.put('/products/update', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    for (const key in req.body) {
      form.append(key, req.body[key]);
    }
    if (req.file) {
      form.append('image', fs.createReadStream(req.file.path), req.file.originalname);
    }

    const response = await axios.put('http://localhost:5002/products/update', form, {
      headers: form.getHeaders(),
    });

    if (req.file) fs.unlinkSync(req.file.path);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error updating product:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update product" });
  }
});


//adding order

app.post('/orders/add', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5000/orders/add', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error placing order:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to place order" });
  }
});

//deleting order

app.delete("/orders/delete", async (req, res) => {
  try {
    const response = await axios.delete("http://localhost:5000/orders/delete", { data: req.body });
    res.json(response.data);
  } catch (error) {
    console.error("Error deleting order:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

//updating order
app.put("/orders/update", async (req, res) => {
  try {
    const response = await axios.put("http://localhost:5000/orders/update", req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error updating order:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to update order" });
  }
});

//adding user
app.post('/users/add', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/users/add', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // Forward the exact error from the User Service
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle other errors (e.g., network issues)
      console.error('Error adding user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


//updating user
app.put("/users/update", async (req, res) => {
  try {
    const response = await axios.put("http://localhost:5001/users/update", req.body);
    res.json(response.data);
  } catch (error) {
    let status = 500;
    let errorMessage = "Failed to update User";
    let details = error.message;

    // If the error response exists, extract relevant details
    if (error.response) {
      status = error.response.status;
      errorMessage = error.response.data.error || "Failed to update User";
      details = error.response.data.details || error.message;
    }

    res.status(status).json({ error: errorMessage, details });
  }
});


//deleting user
app.delete("/users/delete", async (req, res) => {
  try {
    const response = await axios.delete("http://localhost:5001/users/delete", { data: req.body });
    res.json(response.data);
  } catch (error) {
    let status = 500;
    let errorMessage = "Failed to delete User";
    let details = error.message;

    // If the error response exists, extract relevant details
    if (error.response) {
      status = error.response.status;
      errorMessage = error.response.data.error || "Failed to delete User";
      details = error.response.data.details || error.message;
    }

    res.status(status).json({ error: errorMessage, details });
  }
});




// Forward POST request to /orders
app.post("/orders", async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE_URL}/orders/add`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding order:", error.message);
    res.status(500).json({ error: "Failed to forward order request" });
  }
});

// Register route
app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || "Registration failed",
    });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || "Login failed",
    });
  }
});


//server running

app.listen(PORT, () => {
  console.log(`Communicator running on http://localhost:${PORT}`);
})