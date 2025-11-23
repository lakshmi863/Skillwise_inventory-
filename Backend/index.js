const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const historyRoutes = require('./routes/historyRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api', userRoutes);           // Login/Register
app.use('/api/products', productRoutes); 
app.use('/api/stats', statsRoutes); // CRUD + Import/Export
app.use('/api/products', historyRoutes); // History (Nested under products for :id)

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});