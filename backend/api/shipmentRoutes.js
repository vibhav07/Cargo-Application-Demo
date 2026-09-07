import express from 'express';
import {
  getAllShipments,
  searchShipments,
  getShipmentById,
  getShipmentStats
} from '../services/shipmentService.js';

const router = express.Router();

// GET /api/shipments/stats - Summary counter KPIs
router.get('/stats', async (req, res) => {
  try {
    const stats = await getShipmentStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment statistics', details: err.message });
  }
});

// GET /api/shipments/search?q=query - Search by Shipment ID or Customer Name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await searchShipments(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// GET /api/shipments - List all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await getAllShipments();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments', details: err.message });
  }
});

// GET /api/shipments/:id - Shipment Detail View (Info, Events, History)
router.get('/:id', async (req, res) => {
  try {
    const shipment = await getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment details', details: err.message });
  }
});

export default router;
