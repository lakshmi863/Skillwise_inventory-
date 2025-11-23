const db = require('../db/database');

exports.getStats = (req, res) => {
    const stats = {
        totalProducts: 0,
        totalStock: 0,
        lowStock: 0,
        categories: 0,
        // New Data for Charts
        categoryDistribution: [],
        lowStockItems: []
    };

    db.serialize(() => {
        // 1. Basic Counts
        db.get("SELECT count(*) as count FROM products", (err, row) => { if(row) stats.totalProducts = row.count; });
        db.get("SELECT sum(stock) as totalStock FROM products", (err, row) => { if(row) stats.totalStock = row.totalStock || 0; });
        db.get("SELECT count(*) as count FROM products WHERE stock < 5", (err, row) => { if(row) stats.lowStock = row.count; });
        db.get("SELECT count(DISTINCT category) as count FROM products", (err, row) => { if(row) stats.categories = row.count; });

        // 2. Chart Data: Products per Category
        db.all("SELECT category, COUNT(*) as count FROM products GROUP BY category", (err, rows) => {
            if (rows) stats.categoryDistribution = rows;
        });

        // 3. Chart Data: Top 5 Lowest Stock Items (for Bar Chart)
        db.all("SELECT name, stock FROM products WHERE stock > 0 ORDER BY stock ASC LIMIT 5", (err, rows) => {
            if (rows) stats.lowStockItems = rows;
            
            // SEND RESPONSE (Finally)
            res.json(stats);
        });
    });
};