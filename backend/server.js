import express from 'express';
import cors from 'cors';
import shipmentRoutes from './api/shipmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/shipments', shipmentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart Shipment Tracker API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Smart Shipment Tracker Backend running on http://localhost:${PORT}`);
});
