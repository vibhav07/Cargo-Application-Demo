/**
 * Shipment Data Transformation Helpers
 * Current Date reference: 2026-09-07
 */

export const CURRENT_REFERENCE_DATE = '2026-09-07';

export const formatShipment = (row) => {
  if (!row) return null;

  // A shipment is delayed when Current Date > Estimated Delivery Date and status != 'Delivered'
  const isDelayed = (CURRENT_REFERENCE_DATE > row.estimated_delivery_date) && row.status !== 'Delivered';

  return {
    shipmentId: row.shipment_id,
    customerName: row.customer_name,
    origin: row.origin,
    destination: row.destination,
    transportMode: row.transport_mode,
    status: row.status,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    isDelayed: Boolean(isDelayed)
  };
};

export const formatEvent = (row) => ({
  id: row.id,
  shipmentId: row.shipment_id,
  eventType: row.event_type,
  eventTime: row.event_time,
  location: row.location
});

export const formatStatusHistory = (row) => ({
  id: row.id,
  shipmentId: row.shipment_id,
  previousStatus: row.previous_status || 'N/A',
  newStatus: row.new_status,
  timestamp: row.timestamp
});
