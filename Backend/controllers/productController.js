// backend/controllers/productController.js
const db = require('../db/database');
const fs = require('fs');
const csv = require('csv-parser');

// 1. GET PRODUCTS (With Pagination & Search)
exports.getProducts = (req, res) => {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Start with a valid query
    let queryStr = "FROM products WHERE 1=1";
    let params = [];

    // Filter Logic
    if (search && search.trim() !== '') { 
        queryStr += " AND name LIKE ?"; 
        params.push(`%${search}%`); 
    }
    if (category && category !== 'All Categories' && category.trim() !== '') { 
        queryStr += " AND category = ?"; 
        params.push(category); 
    }

    // First: Count Total Items (For Pagination)
    db.get(`SELECT count(*) as total ${queryStr}`, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const totalItems = countResult.total;
        const totalPages = Math.ceil(totalItems / limit);

        // Second: Get Actual Data (Limit & Offset)
        db.all(`SELECT * ${queryStr} LIMIT ? OFFSET ?`, [...params, limit, offset], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            
            res.json({
                data: rows,
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalItems: totalItems
            });
        });
    });
};

// 2. IMPORT PRODUCTS (Mass Import Fixed)
exports.importProducts = (req, res) => {
    if(!req.file) return res.status(400).json({error: "No file uploaded"});

    const results = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            let added = 0;
            
            // Transaction for speed (Handling 800+ records)
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                
                const stmt = db.prepare(`INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`);

                for (const row of results) {
                    // Simple Validation
                    if(!row.name || row.stock === undefined) continue; 

                    // Default values
                    const stockVal = parseInt(row.stock) || 0;
                    const statusVal = stockVal > 0 ? 'In Stock' : 'Out of Stock';
                    
                    stmt.run(
                        row.name, 
                        row.unit || 'pcs', 
                        row.category || 'General', 
                        row.brand || 'Generic', 
                        stockVal, 
                        statusVal, 
                        row.image || 'https://via.placeholder.com/50'
                    );
                    added++;
                }

                stmt.finalize();
                db.run("COMMIT", (err) => {
                    if(err) return res.status(500).json({error: "Import Transaction Failed"});
                    
                    // Cleanup file
                    fs.unlink(req.file.path, () => {}); 

                    res.json({ message: "Import Successful", added: added });
                });
            });
        });
};

// 3. UPDATE PRODUCT (With History Log)
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, unit, category, brand, stock, status, image } = req.body;
    // user comes from Auth Middleware
    const changedBy = req.user ? req.user.username : 'Unknown'; 

    db.get("SELECT stock FROM products WHERE id = ?", [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Product not found" });

        const oldStock = row.stock;
        const newStock = parseInt(stock);

        db.run(`UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
            [name, unit, category, brand, newStock, status, image, id],
            function(err) {
                if (err) return res.status(400).json({ error: err.message });

                // Log Change if stock changed
                if (oldStock !== newStock) {
                    db.run(`INSERT INTO inventory_logs (product_id, old_stock, new_stock, changed_by, change_date) VALUES (?, ?, ?, ?, ?)`,
                    [id, oldStock, newStock, changedBy, new Date().toISOString()]);
                }
                res.json({ message: "Updated successfully" });
            }
        );
    });
};

// 4. EXPORT
exports.exportProducts = (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const headers = "name,unit,category,brand,stock,status,image\n";
        const csvRows = rows.map(r => 
            `"${r.name}","${r.unit}","${r.category}","${r.brand}",${r.stock},"${r.status}","${r.image}"`
        ).join("\n");
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
        res.send(headers + csvRows);
    });
};

// 5. DELETE
exports.deleteProduct = (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if(err) return res.status(500).json({error: err.message});
        res.json({message: "Deleted"});
    });
};



// NEW: Add Single Product
exports.addProduct = (req, res) => {
    const { name, unit, category, brand, stock, status, image } = req.body;

    // Validation
    if (!name || stock === undefined) {
        return res.status(400).json({ error: "Name and Stock are required" });
    }

    const sql = `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    // Auto-determine status
    const computedStatus = status || (parseInt(stock) > 0 ? 'In Stock' : 'Out of Stock');
    const defaultImage = image || 'https://via.placeholder.com/50';

    db.run(sql, [name, unit, category, brand, stock, computedStatus, defaultImage], function(err) {
        if (err) {
            // Check for duplicate name error
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Product name already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product added successfully", id: this.lastID });
    });
};
