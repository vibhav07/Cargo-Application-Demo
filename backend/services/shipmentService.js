import { queryAll, queryOne } from '../repositories/db.js';
import { formatShipment, formatEvent, formatStatusHistory, CURRENT_REFERENCE_DATE } from '../models/shipmentModel.js';

export const getAllShipments = async () => {
  const rows = await queryAll('SELECT * FROM shipments ORDER BY shipment_id ASC');
  return rows.map(formatShipment);
};

export const searchShipments = async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return getAllShipments();
  }
  const term = `%${searchTerm.trim()}%`;
  const rows = await queryAll(
    `SELECT * FROM shipments 
     WHERE shipment_id LIKE ? OR customer_name LIKE ?
     ORDER BY shipment_id ASC`,
    [term, term]
  );
  return rows.map(formatShipment);
};

export const getShipmentById = async (shipmentId) => {
  const row = await queryOne('SELECT * FROM shipments WHERE shipment_id = ?', [shipmentId]);
  if (!row) return null;

  const events = await queryAll(
    'SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY event_time ASC',
    [shipmentId]
  );

  const history = await queryAll(
    'SELECT * FROM status_history WHERE shipment_id = ? ORDER BY timestamp ASC',
    [shipmentId]
  );

  return {
    ...formatShipment(row),
    events: events.map(formatEvent),
    statusHistory: history.map(formatStatusHistory)
  };
};

export const getShipmentStats = async () => {
  const shipments = await getAllShipments();

  const total = shipments.length;
  const delayed = shipments.filter(s => s.isDelayed).length;
  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;

  return {
    total,
    delayed,
    inTransit,
    delivered,
    currentReferenceDate: CURRENT_REFERENCE_DATE
  };
};
