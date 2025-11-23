const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.post('/', authenticateToken, productController.addProduct); 

// Protected Routes (require Login)
router.get('/', authenticateToken, productController.getProducts);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.post('/import', authenticateToken, upload.single('file'), productController.importProducts);
router.get('/export', productController.exportProducts); // Usually left public or token in query

module.exports = router;