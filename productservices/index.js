const express = require('express');
const Product = require('./database');
const app = express();
const port = 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST: Add a new product
app.post('/products/add', async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.body;

        if (!name || !price || !description || !category || quantity === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newProduct = new Product({ name, price, description, category, quantity });
        await newProduct.save();

        console.log("✅ Product added:", newProduct);
        res.status(201).json({ message: "Product saved successfully!", product: newProduct });
    } catch (error) {
        console.error("❌ Error adding product:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Validation Error", details: error.errors });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT: Update a product by _id
app.put('/products/update', async (req, res) => {
    try {
        const { _id, name, price, description, category, quantity } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { name, price, description, category, quantity },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: `Product '${updatedProduct.name}' updated successfully`, product: updatedProduct });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE: Delete a product by _id
app.delete('/products/delete', async (req, res) => {
    console.log('🟡 DELETE request body:', req.body); // Good for debugging

    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const deletedProduct = await Product.findByIdAndDelete(_id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log('🗑️ Deleted product:', deletedProduct); // ✅ You can log this too

        res.status(200).json({ message: `Product '${deletedProduct.name}' deleted successfully` });
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.listen(port, () => {
    console.log(`🚀 Product service running at http://localhost:${port}`);
});
