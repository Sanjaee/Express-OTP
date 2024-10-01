const express = require('express');
const { createBarang, getAllBarang, getBarangById, updateBarang, deleteBarang } = require('../controllers/barangController');
const router = express.Router();

// CRUD Routes
router.post('/barang', createBarang);        // Create barang
router.get('/barang', getAllBarang);         // Get all barang
router.get('/barang/:id', getBarangById);    // Get barang by ID
router.put('/barang/:id', updateBarang);     // Update barang
router.delete('/barang/:id', deleteBarang);  // Delete barang

module.exports = router;
