const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getFacets } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/meta/facets', getFacets);
router.get('/:id', getProductById);

module.exports = router;