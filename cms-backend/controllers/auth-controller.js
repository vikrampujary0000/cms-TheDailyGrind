require("dotenv").config();
const bcrypt = require('bcrypt');
const { sequelize } = require('../connection');
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");


async function signupLogic(user) {
    let query = "SELECT password, role, status FROM users WHERE email = $1";
    const results = await sequelize.query(query, {
        bind: [user.email],
        type: Sequelize.QueryTypes.SELECT
    });

    if (results.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        query = "INSERT INTO users (name, contactNumber, email, password, status, role) VALUES ($1, $2, $3, $4, 'false', 'user')";
        await sequelize.query(query, {
            bind: [user.name, user.contactNumber, user.email, hashedPassword],
            type: Sequelize.QueryTypes.INSERT
        });

        return { success: true, message: "Successfully registered" };
    } else {
        return { success: false, message: "Email already exists" };
    }
};

async function loginLogic(user) {
    const query = "SELECT email, password, role, status FROM users WHERE email = $1";
    const results = await sequelize.query(query, {
        bind: [user.email],
        type: Sequelize.QueryTypes.SELECT
    });

    if (results.length <= 0) {
        return { success: false, message: "Incorrect Username or Password" };
    }

    const dbUser = results[0];
    const isPasswordValid = await bcrypt.compare(user.password, dbUser.password);

    if (!isPasswordValid) {
        return { success: false, message: "Incorrect Username or Password" };
    }

    if (dbUser.status === 'false') {
        return { success: false, message: "Wait for Admin approval" };
    }

    const response = { email: dbUser.email, role: dbUser.role };
    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
        expiresIn: '8h'
    });

    return { success: true, token: accessToken };
};

module.exports = {
    signupLogic,
    loginLogic
}