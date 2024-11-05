const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const { addProduct, getProducts, getProductsByCategoryId, getProductById, updateProduct, deleteProduct, updateProductStatus } = require("../controllers/product-controller")

router.post('/add', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = req.body;
        const result = await addProduct(product);
        if (result.message === "Product already exists") {
            return res.status(409).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while adding the product." });
    }
});

router.get('/get', authenticateToken, async (req, res) => {
    try {
        const results = await getProducts();
        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching products." });
    }
});

router.get('/getByCategory/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const results = await getProductsByCategoryId(id);
        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching product." });
    }
});


router.get('/getById/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await getProductById(id);
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching product." });
    }
});

router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = req.body;
        const result = await updateProduct(product);
        if (result[1] == 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the product." });
    }
});

router.delete("/delete/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log(`Received DELETE request for ID: ${req.params.id}`);
        const id = req.params.id;
        const result = await deleteProduct(id);

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while deleting the product." });
    }
});


router.patch('/updateStatus', authenticateToken, isAdmin, async (req, res) => {
    try {
        console.log("checking request", req.body)
        let product = req.body;
        let result = await updateProductStatus(product);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the product status." });
    }
})


module.exports = router;
