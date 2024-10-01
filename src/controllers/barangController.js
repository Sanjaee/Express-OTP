const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Create barang
exports.createBarang = async (req, res) => {
  const { nama, deskripsi, harga, stok } = req.body;

  try {
    const newBarang = await prisma.barang.create({
      data: { nama, deskripsi, harga, stok },
    });
    res.status(201).json(newBarang);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create barang' });
  }
};

// Get all barang
exports.getAllBarang = async (req, res) => {
  try {
    const barangList = await prisma.barang.findMany();
    res.status(200).json(barangList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch barang' });
  }
};

// Get barang by ID
exports.getBarangById = async (req, res) => {
  const { id } = req.params;

  try {
    const barang = await prisma.barang.findUnique({
      where: { id },
    });
    if (barang) {
      res.status(200).json(barang);
    } else {
      res.status(404).json({ error: 'Barang not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch barang' });
  }
};

// Update barang
exports.updateBarang = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, harga, stok } = req.body;

  try {
    const updatedBarang = await prisma.barang.update({
      where: { id },
      data: { nama, deskripsi, harga, stok },
    });
    res.status(200).json(updatedBarang);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update barang' });
  }
};

// Delete barang
exports.deleteBarang = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.barang.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Barang deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete barang' });
  }
};
