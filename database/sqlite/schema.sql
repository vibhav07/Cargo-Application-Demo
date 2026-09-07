-- Smart Shipment Tracker Database Schema

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    transport_mode TEXT NOT NULL, -- Air, Ocean, Road
    status TEXT NOT NULL,         -- Booked, Picked Up, In Transit, Customs Processing, Out For Delivery, Delivered
    estimated_delivery_date TEXT NOT NULL, -- YYYY-MM-DD
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS shipment_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id TEXT NOT NULL,
    event_type TEXT NOT NULL,     -- Booked, Picked Up, In Transit, Customs Processing, Out For Delivery, Delivered
    event_time TEXT NOT NULL,     -- ISO timestamp
    location TEXT NOT NULL,
    FOREIGN KEY (shipment_id) REFERENCES shipments (shipment_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    timestamp TEXT NOT NULL,      -- ISO timestamp
    FOREIGN KEY (shipment_id) REFERENCES shipments (shipment_id) ON DELETE CASCADE
);
