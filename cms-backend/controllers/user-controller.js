const { sequelize } = require('../connection');
const { Sequelize } = require("sequelize");
require("dotenv").config();



async function getUsers() {
    const query = "SELECT id, name, email, contactNumber, status FROM users WHERE role='user'";
    const results = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return { success: true, data: results };
}

async function updateUser(user) {
    const query = "UPDATE users SET status = $1 WHERE id = $2";
    const values = [user.status, user.id];
    const [affectedRows] = await sequelize.query(query, { bind: values, type: Sequelize.QueryTypes.UPDATE });

    if (affectedRows === 0) {
        return { success: false, message: "User ID does not exist" };
    }
    return { success: true, message: "User status updated successfully" };
}

async function checkToken() {
    return { success: true, message: "true" };
}

module.exports = {
    getUsers,
    updateUser,
    checkToken
};
