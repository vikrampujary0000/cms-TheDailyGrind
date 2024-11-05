const { sequelize } = require('../connection');
const { Sequelize } = require('sequelize');

async function addCategory(category) {
    const existingCategory = await sequelize.query("SELECT * FROM category WHERE name = $1", {
        bind: [category.name],
        type: Sequelize.QueryTypes.SELECT
    });
    if (existingCategory.length > 0) {
        return { message: "Category already exists" };
    }
    const query = "INSERT INTO category (name) VALUES ($1)";
    await sequelize.query(query, {
        bind: [category.name],
        type: Sequelize.QueryTypes.INSERT
    });
    return { message: "Category added successfully" };
}

async function getCategories() {
    const query = "SELECT * FROM category ORDER BY name";
    const results = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return results;
}

async function updateCategory(category) {
    const query = "UPDATE category SET name = $1 WHERE id = $2";
    const result = await sequelize.query(query, {
        bind: [category.name, category.id],
        type: Sequelize.QueryTypes.UPDATE
    });

    if (result[1] === 0) {
        return { success: false, message: `Could not find category with id: ${category.id}` };
    }
    return { success: true, message: "Category updated successfully" };
}

module.exports = { addCategory, getCategories, updateCategory };
