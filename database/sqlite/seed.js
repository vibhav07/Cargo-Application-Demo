import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const sqlite3 = require(path.resolve(__dirname, '../../backend/node_modules/sqlite3')).verbose();

const dbPath = path.join(__dirname, 'shipments.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Remove existing DB file for a fresh seed
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file.');
}

const db = new sqlite3.Database(dbPath);

const schemaSql = fs.readFileSync(schemaPath, 'utf8');

db.serialize(() => {
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Error creating schema:', err);
      process.exit(1);
    }
    console.log('Schema created successfully.');
  });

  const shipments = [
    { shipment_id: 'SP1001', customer_name: 'ABC Retail', origin: 'Singapore', destination: 'Germany', transport_mode: 'Air', status: 'In Transit', estimated_delivery_date: '2026-09-10', created_at: '2026-09-01T08:00:00Z' },
    { shipment_id: 'SP1002', customer_name: 'Global Tech Solutions', origin: 'Singapore', destination: 'Germany', transport_mode: 'Air', status: 'In Transit', estimated_delivery_date: '2026-09-02', created_at: '2026-08-25T10:00:00Z' }, // DELAYED 1
    { shipment_id: 'SP1003', customer_name: 'Zenith Pharma', origin: 'India', destination: 'Austria', transport_mode: 'Ocean', status: 'Customs Processing', estimated_delivery_date: '2026-09-12', created_at: '2026-08-28T09:30:00Z' },
    { shipment_id: 'SP1004', customer_name: 'Nexus Heavy Machinery', origin: 'Germany', destination: 'UAE', transport_mode: 'Ocean', status: 'Picked Up', estimated_delivery_date: '2026-09-15', created_at: '2026-09-02T14:00:00Z' },
    { shipment_id: 'SP1005', customer_name: 'Alpine Logistics', origin: 'Austria', destination: 'Netherlands', transport_mode: 'Road', status: 'Customs Processing', estimated_delivery_date: '2026-09-04', created_at: '2026-08-27T11:15:00Z' }, // DELAYED 2
    { shipment_id: 'SP1006', customer_name: 'Dutch Trading Co', origin: 'Netherlands', destination: 'Singapore', transport_mode: 'Air', status: 'Booked', estimated_delivery_date: '2026-09-18', created_at: '2026-09-05T16:20:00Z' },
    { shipment_id: 'SP1007', customer_name: 'Vienna Motors', origin: 'Austria', destination: 'UAE', transport_mode: 'Ocean', status: 'Out For Delivery', estimated_delivery_date: '2026-09-08', created_at: '2026-08-30T07:45:00Z' },
    { shipment_id: 'SP1008', customer_name: 'Tata Freight', origin: 'India', destination: 'Netherlands', transport_mode: 'Ocean', status: 'In Transit', estimated_delivery_date: '2026-09-14', created_at: '2026-08-29T12:00:00Z' },
    { shipment_id: 'SP1009', customer_name: 'Emirates Cargo', origin: 'UAE', destination: 'India', transport_mode: 'Ocean', status: 'In Transit', estimated_delivery_date: '2026-09-03', created_at: '2026-08-20T15:30:00Z' }, // DELAYED 3
    { shipment_id: 'SP1010', customer_name: 'Desert Sands Trading', origin: 'UAE', destination: 'Germany', transport_mode: 'Air', status: 'Picked Up', estimated_delivery_date: '2026-09-11', created_at: '2026-09-03T10:00:00Z' },
    { shipment_id: 'SP1011', customer_name: 'SilkRoute Express', origin: 'Singapore', destination: 'India', transport_mode: 'Road', status: 'Delivered', estimated_delivery_date: '2026-09-05', created_at: '2026-08-28T09:00:00Z' },
    { shipment_id: 'SP1012', customer_name: 'Munich Solar Systems', origin: 'Germany', destination: 'Singapore', transport_mode: 'Air', status: 'In Transit', estimated_delivery_date: '2026-09-09', created_at: '2026-09-01T13:45:00Z' },
    { shipment_id: 'SP1013', customer_name: 'Salzburg BioTech', origin: 'Austria', destination: 'India', transport_mode: 'Air', status: 'Booked', estimated_delivery_date: '2026-09-20', created_at: '2026-09-06T11:00:00Z' },
    { shipment_id: 'SP1014', customer_name: 'Bharat Electronics', origin: 'India', destination: 'Germany', transport_mode: 'Air', status: 'Customs Processing', estimated_delivery_date: '2026-09-05', created_at: '2026-08-26T08:30:00Z' }, // DELAYED 4
    { shipment_id: 'SP1015', customer_name: 'Rotterdam Ports Corp', origin: 'Netherlands', destination: 'UAE', transport_mode: 'Ocean', status: 'Customs Processing', estimated_delivery_date: '2026-09-13', created_at: '2026-08-31T14:15:00Z' },
    { shipment_id: 'SP1016', customer_name: 'Gulf Telecom', origin: 'UAE', destination: 'Austria', transport_mode: 'Air', status: 'Delivered', estimated_delivery_date: '2026-09-04', created_at: '2026-08-29T10:30:00Z' },
    { shipment_id: 'SP1017', customer_name: 'Singapore Tech Hub', origin: 'Singapore', destination: 'Netherlands', transport_mode: 'Ocean', status: 'In Transit', estimated_delivery_date: '2026-09-16', created_at: '2026-09-02T09:00:00Z' },
    { shipment_id: 'SP1018', customer_name: 'Berlin Fashion Line', origin: 'Germany', destination: 'India', transport_mode: 'Air', status: 'Picked Up', estimated_delivery_date: '2026-09-12', created_at: '2026-09-04T12:00:00Z' },
    { shipment_id: 'SP1019', customer_name: 'Tyrol Timber Co', origin: 'Austria', destination: 'Germany', transport_mode: 'Road', status: 'Delivered', estimated_delivery_date: '2026-09-02', created_at: '2026-08-25T16:00:00Z' },
    { shipment_id: 'SP1020', customer_name: 'EuroRetail GmbH', origin: 'Germany', destination: 'Austria', transport_mode: 'Road', status: 'Out For Delivery', estimated_delivery_date: '2026-09-06', created_at: '2026-08-30T10:00:00Z' }, // DELAYED 5
    { shipment_id: 'SP1021', customer_name: 'Indus Chemical', origin: 'India', destination: 'UAE', transport_mode: 'Ocean', status: 'Out For Delivery', estimated_delivery_date: '2026-09-08', created_at: '2026-08-28T14:00:00Z' },
    { shipment_id: 'SP1022', customer_name: 'Amsterdam Organic', origin: 'Netherlands', destination: 'Germany', transport_mode: 'Road', status: 'In Transit', estimated_delivery_date: '2026-09-10', created_at: '2026-09-03T08:30:00Z' },
    { shipment_id: 'SP1023', customer_name: 'Dubai Gold & Jewels', origin: 'UAE', destination: 'Singapore', transport_mode: 'Air', status: 'Customs Processing', estimated_delivery_date: '2026-09-14', created_at: '2026-09-01T15:00:00Z' },
    { shipment_id: 'SP1024', customer_name: 'Bavaria Auto Parts', origin: 'Germany', destination: 'Netherlands', transport_mode: 'Road', status: 'Booked', estimated_delivery_date: '2026-09-19', created_at: '2026-09-06T13:00:00Z' },
    { shipment_id: 'SP1025', customer_name: 'Kerala Spices Ltd', origin: 'India', destination: 'Singapore', transport_mode: 'Ocean', status: 'Picked Up', estimated_delivery_date: '2026-09-17', created_at: '2026-09-04T09:45:00Z' }
  ];

  const stmtShipment = db.prepare(`
    INSERT INTO shipments (shipment_id, customer_name, origin, destination, transport_mode, status, estimated_delivery_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  shipments.forEach((s) => {
    stmtShipment.run(s.shipment_id, s.customer_name, s.origin, s.destination, s.transport_mode, s.status, s.estimated_delivery_date, s.created_at);
  });
  stmtShipment.finalize();

  console.log(`Seeded ${shipments.length} shipments.`);

  // Generate events & status history for each shipment
  const stmtEvent = db.prepare(`
    INSERT INTO shipment_events (shipment_id, event_type, event_time, location)
    VALUES (?, ?, ?, ?)
  `);

  const stmtHistory = db.prepare(`
    INSERT INTO status_history (shipment_id, previous_status, new_status, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  const statusOrder = ['Booked', 'Picked Up', 'In Transit', 'Customs Processing', 'Out For Delivery', 'Delivered'];

  shipments.forEach((s) => {
    const currentIndex = statusOrder.indexOf(s.status);
    let prevStatus = null;
    const baseDate = new Date(s.created_at);

    for (let i = 0; i <= currentIndex; i++) {
      const status = statusOrder[i];
      const eventTime = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString();
      const location = i === 0 ? s.origin : i === currentIndex && status === 'Delivered' ? s.destination : `${s.origin} Hub / Transit Hub`;

      stmtEvent.run(s.shipment_id, status, eventTime, location);
      stmtHistory.run(s.shipment_id, prevStatus, status, eventTime);

      prevStatus = status;
    }
  });

  stmtEvent.finalize();
  stmtHistory.finalize();

  console.log('Seeded shipment events and status history.');
});

db.close(() => {
  console.log('Database seeding complete.');
});
