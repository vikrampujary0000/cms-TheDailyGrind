// controllers/reportController.js
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../connection');
const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

async function generateBillRecord(orderDetails, createdByEmail) {
    console.log("orderdetails" + orderDetails);
    console.log("created by" + createdByEmail);
    const generateUuid = uuidv4();
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    // Ensure the output directory exists
    const pdfDir = path.join(__dirname, '../generated_pdf');
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
        // Insert bill record into the database
        const query = `
            INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        await sequelize.query(query, {
            bind: [
                orderDetails.name, generateUuid, orderDetails.email,
                orderDetails.contactNumber, orderDetails.paymentMethod,
                orderDetails.totalAmount, orderDetails.productDetails,
                createdByEmail
            ],
            type: Sequelize.QueryTypes.INSERT,
            transaction
        });

        // Commit the transaction after successful DB insertion
        await transaction.commit();

        // Generate PDF report data
        const reportData = {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        };

        const ejsFilePath = path.join(__dirname, '', '../report.ejs');
        const pdfPath = path.join(pdfDir, `${generateUuid}.pdf`);

        // Render HTML from EJS template and generate PDF
        const renderedHtml = await ejs.renderFile(ejsFilePath, reportData);

        await new Promise((resolve, reject) => {
            pdf.create(renderedHtml).toFile(pdfPath, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });

        return { success: true, uuid: generateUuid };

    } catch (err) {
        console.error("Error in generateBillRecord:", err);

        // Rollback the transaction if any error occurs
        if (transaction) await transaction.rollback();

        return { success: false, message: "Failed to generate bill record" };
    }
}

async function getBillRecord(orderDetails, createdByEmail) {
    console.log("getBillRecord called with:", orderDetails, createdByEmail);
    const pdfPath = path.join(__dirname, '../generated_pdf', `${orderDetails.uuid}.pdf`); // Use path.join for consistency

    try {
        console.log("Checking if PDF exists at:", pdfPath);
        if (fs.existsSync(pdfPath)) {
            // PDF exists, set the response to send the PDF file
            return { success: true, pdfPath }; // Return success and the PDF path for sending
        } else {
            const productDetailsReport = JSON.parse(orderDetails.productDetails);

            // Ensure the output directory exists
            const pdfDir = path.join(__dirname, '../generated_pdf');
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }

            // Generate PDF report data
            const reportData = {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            };

            const ejsFilePath = path.join(__dirname, '../report.ejs');
            const newPdfPath = path.join(pdfDir, `${orderDetails.uuid}.pdf`);

            // Render HTML from EJS template and generate PDF
            const renderedHtml = await ejs.renderFile(ejsFilePath, reportData);
            console.log("Rendered HTML:", renderedHtml);

            await new Promise((resolve, reject) => {
                pdf.create(renderedHtml).toFile(newPdfPath, (err, res) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    }
                    else {
                        console.log("PDF created successfully:", res);
                        resolve(res);
                    }
                });
            });
            return { success: true, uuid: orderDetails.uuid }; // Return success and uuid after generating
        }
    } catch (error) {
        console.error("Error in getBillRecord:", error);
        return { success: false, message: "Failed to retrieve or generate the bill record" }; // Consistent error response
    }
}

async function getBills(req, res) {
    try {
        const query = "SELECT * FROM bill ORDER BY id DESC";
        const [results] = await sequelize.query(query);
        return res.status(200).json(results);
    } catch (err) {
        console.error("Error retrieving bills:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deleteBill(req, res) {
    const id = req.params.id;

    try {
        const query = "DELETE FROM bill WHERE id = $1";
        const result = await sequelize.query(query, {
            bind: [id],
            type: Sequelize.QueryTypes.DELETE
        });

        return res.status(200).json({
            message: "Bill deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting bill:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { generateBillRecord, getBillRecord, getBills, deleteBill };


