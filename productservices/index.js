const express = require('express');
const Product = require('./database');
const app = express();
const port = 5002;
const fs = require('fs');

const multer = require('multer');
const path = require('path');
app.use('/uploads', express.static('uploads'));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ✅ create this folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ dest: 'uploads/' });

// GET all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// POST: Add a new product
app.post('/products/add', upload.single('image'), async (req, res) => {
    try {
        let { name, price, description, category, quantity } = req.body;
        const image = req.file?.filename || null;

        name = name?.trim();
        description = description?.trim();
        category = category?.trim();
        price = Number(price);
        quantity = Number(quantity);

        if (!name || !description || !category || isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ error: 'All fields are required and must be valid' });
        }

        const newProduct = new Product({ name, price, description, category, quantity, image });
        await newProduct.save();

        res.status(201).json({ message: '✅ Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('❌ Error adding product:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// PUT: Update a product by _id
app.put('/products/update', upload.single('image'), async (req, res) => {
    try {
        const { _id, name, price, description, category, quantity } = req.body;

        if (!_id) return res.status(400).json({ error: 'Product ID is required' });

        const existingProduct = await Product.findById(_id);
        if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

        const updateData = {
            name: name?.trim(),
            price: Number(price),
            description: description?.trim(),
            category: category?.trim(),
            quantity: Number(quantity),
        };

        if (!updateData.name || !updateData.description || !updateData.category ||
            isNaN(updateData.price) || isNaN(updateData.quantity)) {
            return res.status(400).json({ error: 'All fields must be valid' });
        }

        // Handle new image
        if (req.file) {
            // Delete old image if it exists
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, 'uploads', existingProduct.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old image:', err.message);
                });
            }
            updateData.image = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true,
        });

        res.json({ message: `✅ Product '${updatedProduct.name}' updated successfully`, product: updatedProduct });
    } catch (err) {
        console.error('❌ Error updating product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// DELETE: Delete a product by _id
app.delete('/products/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) return res.status(400).json({ error: 'Product ID is required' });

        const product = await Product.findByIdAndDelete(_id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Delete image
        if (product.image) {
            const imagePath = path.join(__dirname, 'uploads', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err.message);
            });
        }

        res.status(200).json({ message: `✅ Product '${product.name}' deleted successfully` });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`🚀 Product service running at http://localhost:${port}`);
});