const express = require("express");
require("dotenv").config();
const cors = require('cors');
const { connectDB } = require("./connection")

const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const billRoutes = require("./routes/bill")
const dashboardRoutes = require("./routes/dashboard")

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("server running");
});

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/bill", billRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes)

connectDB();

app.listen(port, () => { console.log("Server running on Port:" + port) });
