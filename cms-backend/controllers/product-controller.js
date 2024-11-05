const { sequelize } = require('../connection');
const { Sequelize } = require('sequelize');

async function addProduct(product) {
    const existingProductQuery = "SELECT id FROM product WHERE name = $1 AND categoryId = $2";
    const existingProduct = await sequelize.query(existingProductQuery, {
        bind: [product.name, product.categoryId],
        type: Sequelize.QueryTypes.SELECT
    });

    if (existingProduct.length) {
        return { message: "Product already exists" };
    }

    const query = "INSERT INTO product (name, categoryId, description, price, status) VALUES ($1, $2, $3, $4, true)";
    await sequelize.query(query, {
        bind: [product.name, product.categoryId, product.description, product.price],
        type: Sequelize.QueryTypes.INSERT
    });
    return { message: "Product added successfully" };
}

async function getProducts() {
    const query = `
        SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryId, c.name AS categoryName 
        FROM product AS p 
        INNER JOIN category AS c ON p.categoryId = c.id
    `;
    const results = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
    return results;
}


async function getProductsByCategoryId(id) {
    const query = "SELECT id, name FROM product WHERE categoryId = $1 AND status = true";
    const results = await sequelize.query(query, {
        bind: [id],
        type: Sequelize.QueryTypes.SELECT
    });
    return results;
}

async function getProductById(id) {
    const query = "SELECT id, name, description, price FROM product WHERE id = $1";
    const results = await sequelize.query(query, {
        bind: [id],
        type: Sequelize.QueryTypes.SELECT
    });
    return results.length ? results[0] : null;
}

async function updateProduct(product) {
    const query = "UPDATE product SET name = $1, categoryId = $2, description = $3, price = $4 WHERE id = $5";
    const results = await sequelize.query(query, {
        bind: [product.name, product.categoryId, product.description, product.price, product.id],
        type: Sequelize.QueryTypes.UPDATE
    });
    return results;
}

async function deleteProduct(id) {
    const query = "DELETE FROM product WHERE id = $1";
    const results = await sequelize.query(query, {
        bind: [id],
        type: Sequelize.QueryTypes.DELETE
    });
    return results;
}

async function updateProductStatus(product) {
    console.log("Product object:", product);
    const query = "UPDATE product SET status = $1 WHERE id = $2";


    const result = await sequelize.query(query, {
        bind: [product.status, product.id],
        type: Sequelize.QueryTypes.UPDATE
    });
    if (result[1] == 0) {
        return { success: false, message: `Could not find product with id: ${product.id}` };
    }
    return { success: true, message: "Product status updated successfully" };
}
module.exports = { addProduct, getProducts, getProductsByCategoryId, getProductById, updateProduct, deleteProduct, updateProductStatus }