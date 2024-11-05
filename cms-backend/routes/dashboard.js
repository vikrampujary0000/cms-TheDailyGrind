const express = require('express');
const router = express.Router();
const { getDetails } = require("../controllers/dashboard-controller")
const { authenticateToken } = require("../middleware/auth.middleware");

router.get('/details', authenticateToken, async (req, res) => {
    try {
        const data = await getDetails();
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error retrieving details:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
