const express = require('express');
const router = express.Router();
const { addCategory, getCategories, updateCategory } = require('../controllers/category-controller');
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");

router.post('/add', authenticateToken, isAdmin, async (req, res) => {
    try {
        const category = req.body;
        const result = await addCategory(category);
        if (result.message === "Category already exists") {
            return res.status(409).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while adding the category." });
    }
});

router.get('/get', authenticateToken, async (req, res) => {
    try {
        const results = await getCategories();
        return res.status(200).json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching categories." });
    }
});

router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
    try {
        const category = req.body;
        const result = await updateCategory(category);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the category." });
    }
});

module.exports = router;
