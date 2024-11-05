require("dotenv").config();
const { Sequelize } = require("sequelize");

const db = {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
}

const sequelize = new Sequelize(db.name, db.user, db.pass, {
    host: db.host,
    dialect: db.dialect,
    port: db.port
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, connectDB }
