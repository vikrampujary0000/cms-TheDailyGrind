const express = require('express');
const router = express.Router();
const { getUsers, updateUser, checkToken } = require('../controllers/user-controller');
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");


router.get('/get', authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await getUsers();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return res.status(500).json({ message: result.error });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching users." });
    }
});


router.patch('/update', authenticateToken, isAdmin, async (req, res) => {
    try {
        const user = req.body;
        const result = await updateUser(user);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the user." });
    }
});


router.get("/checkToken", authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await checkToken();
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(500).json({ message: "Token validation failed." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while validating the token." });
    }
});

module.exports = router;
