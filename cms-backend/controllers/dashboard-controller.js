const { sequelize } = require('../connection');
const { Sequelize } = require("sequelize");

async function getDetails() {
    try {
        // Count categories
        const categoryResult = await sequelize.query(
            "SELECT COUNT(id) as categoryCount FROM category",
            { type: Sequelize.QueryTypes.SELECT }
        );
        console.log("categoryResult", categoryResult);
        const categoryCount = categoryResult[0].categorycount;

        // Count products
        const productResult = await sequelize.query(
            "SELECT COUNT(id) as productCount FROM product",
            { type: Sequelize.QueryTypes.SELECT }
        );
        console.log("productResult", productResult);
        const productCount = productResult[0].productcount;

        // Count bills
        const billResult = await sequelize.query(
            "SELECT COUNT(id) as billCount FROM bill",
            { type: Sequelize.QueryTypes.SELECT }
        );
        console.log("billResult", billResult);
        const billCount = billResult[0].billcount;

        // Aggregate data into a response object
        return {
            category: categoryCount,
            product: productCount,
            bill: billCount
        };

    } catch (err) {
        console.error("Error in getDetails:", err);
        throw new Error("Failed to retrieve details");
    }
}

module.exports = { getDetails };
