# System Architecture - Smart Shipment Tracker

## Overview

Smart Shipment Tracker is a lightweight logistics operations portal built to demonstrate real-world shipment tracking, delay identification, status transition logging, and support investigation.

## Architecture Layers

```
+-------------------------------------------------------------+
|                React Web Frontend (Vite)                   |
|  - Dashboard View (Shipment list & stats KPIs)             |
|  - Shipment Search Component (ID & Customer Filtering)     |
|  - Shipment Details Drawer (Timeline & Status Audit Trail)  |
+-------------------------------------------------------------+
                              | REST APIs
                              v
+-------------------------------------------------------------+
|                     Express.js Backend                      |
|  - API Controller Layer (/api/shipments, /api/search)       |
|  - Service Layer (Delay calculations, Data formatting)     |
|  - Repository Layer (SQLite Database Access Layer)          |
+-------------------------------------------------------------+
                              | SQLite Driver
                              v
+-------------------------------------------------------------+
|                      SQLite Database                        |
|  - shipments (25 seeded records, 5 delayed)                 |
|  - shipment_events (Milestone event logs)                   |
|  - status_history (Status transition audit history)         |
+-------------------------------------------------------------+
```

## Component Breakdown

1. **Frontend (`frontend/`)**:
   - `src/dashboard/ShipmentDashboard.jsx`: Displays KPI summary widgets and active shipment table.
   - `src/shipment-search/ShipmentSearch.jsx`: Input search for Shipment ID and Customer Name, plus Delay filter toggle.
   - `src/shipment-details/ShipmentDetails.jsx`: Modal drawer displaying detailed info, visual event timeline, and complete status history log.

2. **Backend (`backend/`)**:
   - `api/shipmentRoutes.js`: Exposes REST endpoints (`GET /api/shipments`, `GET /api/shipments/search`, `GET /api/shipments/:id`, `GET /api/shipments/stats`).
   - `services/shipmentService.js`: Business logic layer computing delays, status transitions, and search filters.
   - `repositories/db.js`: Low-level SQLite database query wrappers.
   - `models/shipmentModel.js`: Data structures and delay rules (`Current Reference Date > Estimated Delivery Date` and `Status != Delivered`).

3. **Database (`database/sqlite/`)**:
   - `schema.sql`: Table definitions for shipments, events, and status history.
   - `seed.js`: Database seeder creating 25 shipments across Singapore, Germany, Austria, India, Netherlands, UAE, with 5 delayed shipments.

## Delay Identification Rule (FR-4)
A shipment is flagged as **Delayed** (`isDelayed: true`) when:
`Current Date > Estimated Delivery Date` AND `Status != 'Delivered'`.
