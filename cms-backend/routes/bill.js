// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { authenticateToken } = require("../middleware/auth.middleware");
const { generateBillRecord, getBillRecord, getBills, deleteBill } = require('../controllers/bill-controller');
const { sequelize } = require('../connection');

router.post('/generateReport', authenticateToken, async (req, res) => {
    try {
        let order = req.body;
        let createdBy = res.locals.email;
        const result = await generateBillRecord(order, createdBy);
        if (result.success) {
            return res.status(200).json({ uuid: result.uuid });
        } else {
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error in generating bill", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/getPdf', authenticateToken, async (req, res) => {
    try {
        console.log("hi i was caleld");
        let order = req.body;
        let createdBy = res.locals.email;
        const result = await getBillRecord(order, createdBy);
        console.log("getBillRecord result:", result);
        if (result.success) {
            if (result.pdfPath) {
                // If the PDF exists, stream the PDF to the response
                res.contentType("application/pdf");
                fs.createReadStream(result.pdfPath).pipe(res);
            } else {
                // If the PDF was just created, respond with the UUID
                return res.status(200).json({ uuid: result.uuid });
            }
        } else {
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error in retrieving bill", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/getBills', authenticateToken, getBills)

router.delete('/delete/:id', authenticateToken, deleteBill);

module.exports = router;
