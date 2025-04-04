const express = require('express');
const Order = require('./database');
const app = express();

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//getting all order
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

//adding order
app.post('/orders/add', async (req, res) => {
  try {
    const { productName, quantity, price, customerName } = req.body;

    if (!productName || !quantity || !price || !customerName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create and save new order (orderValue is auto-calculated)
    const newOrder = new Order({ productName, quantity, price, customerName });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//updating
app.put("/orders/update", async (req, res) => {
  try {
    const { productName, quantity, price, customerName } = req.body;

    // Validate request body
    if (!productName) {
      return res.status(400).json({ error: "Product name is required for update" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { productName }, // Find order by productName
      { quantity, price, customerName },
      { new: true, runValidators: true } // Return updated document & validate fields
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found with this product name" });
    }

    res.json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});


//deleting

// orders service route
app.delete("/orders/delete", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ error: "Order ID required" });

    const deleted = await Order.findByIdAndDelete(_id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: "Failed to delete order" });
  }
});




app.listen(port, () => {
  console.log(`Orderservices is running on port http://localhost:${port}`)
});
