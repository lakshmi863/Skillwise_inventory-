const db = require('../db/database');

exports.getProductHistory = (req, res) => {
    const { id } = req.params;
    db.all("SELECT * FROM inventory_logs WHERE product_id = ? ORDER BY change_date DESC", 
        [id], 
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};