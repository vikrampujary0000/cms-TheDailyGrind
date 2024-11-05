const express = require('express');
const router = express.Router();
const { signupLogic, loginLogic } = require('../controllers/auth-controller');

router.post('/signup', async (req, res) => {
    try {
        let user = req.body;
        const result = await signupLogic(user);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const result = await loginLogic(user);
        if (result.success) {
            return res.status(200).json({ token: result.token });
        } else {
            return res.status(401).json({ message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
});

module.exports = router;