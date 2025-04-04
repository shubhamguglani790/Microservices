const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/productsDB";


mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));



const orderSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customerName: { type: String, required: true },
    orderValue: { type: Number } // This will be auto-calculated
});

orderSchema.pre("save", function (next) {
    this.orderValue = this.quantity * this.price;
    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;