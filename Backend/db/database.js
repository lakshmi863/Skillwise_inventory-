// backend/db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../inventory.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('DB Connection Error:', err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    // 1. Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // 2. Products Table (FIX: Removed 'UNIQUE' from name)
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, 
        unit TEXT,
        category TEXT,
        brand TEXT,
        stock INTEGER NOT NULL,
        status TEXT,
        image TEXT
    )`);

    // 3. Inventory Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS inventory_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        old_stock INTEGER,
        new_stock INTEGER,
        changed_by TEXT,
        change_date TEXT,
        FOREIGN KEY(product_id) REFERENCES products(id)
    )`);
});

module.exports = db;