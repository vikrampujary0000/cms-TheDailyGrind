const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        res.locals.email = decoded.email;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send({
            error: "Access forbidden: Admins only"
        });
    }
}


module.exports = { authenticateToken, isAdmin }