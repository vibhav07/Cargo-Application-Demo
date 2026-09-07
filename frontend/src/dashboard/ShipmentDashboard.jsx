import React from 'react';
import { Package, AlertTriangle, Truck, CheckCircle2, ArrowRight, Plane, Ship } from 'lucide-react';

export default function ShipmentDashboard({
  shipments,
  stats,
  loading,
  onSelectShipment
}) {
  const getTransportIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane size={15} />;
      case 'ocean': return <Ship size={15} />;
      case 'road': return <Truck size={15} />;
      default: return <Truck size={15} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'booked': return 'status-booked';
      case 'picked up': return 'status-picked-up';
      case 'in transit': return 'status-in-transit';
      case 'customs processing': return 'status-customs-processing';
      case 'out for delivery': return 'status-out-for-delivery';
      case 'delivered': return 'status-delivered';
      default: return 'status-booked';
    }
  };

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon-total">
            <Package size={24} />
          </div>
          <div>
            <div className="kpi-label">Total Shipments</div>
            <div className="kpi-value">{stats?.total || 0}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon-delayed">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="kpi-label">Active Delays</div>
            <div className="kpi-value" style={{ color: (stats?.delayed || 0) > 0 ? '#f43f5e' : '#f8fafc' }}>
              {stats?.delayed || 0}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon-transit">
            <Truck size={24} />
          </div>
          <div>
            <div className="kpi-label">In Transit</div>
            <div className="kpi-value">{stats?.inTransit || 0}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-icon-delivered">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="kpi-label">Delivered</div>
            <div className="kpi-value">{stats?.delivered || 0}</div>
          </div>
        </div>
      </div>

      {/* Shipment Table Container */}
      <div className="table-card">
        <div className="table-header-bar">
          <div className="table-title">
            <Package size={18} color="#38bdf8" />
            <span>Active Shipments</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>
              ({shipments.length} records)
            </span>
          </div>
        </div>

        <div className="shipment-table-wrapper">
          {loading ? (
            <div className="loading-spinner">
              <span>Loading shipments data...</span>
            </div>
          ) : shipments.length === 0 ? (
            <div className="empty-state">
              <Package size={36} color="#64748b" />
              <p style={{ marginTop: '0.75rem' }}>No shipments found matching criteria.</p>
            </div>
          ) : (
            <table className="shipment-table" id="shipments-data-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Customer Name</th>
                  <th>Route (Origin → Destination)</th>
                  <th>Transport Mode</th>
                  <th>Current Status</th>
                  <th>Est. Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr
                    key={s.shipmentId}
                    className={`shipment-row ${s.isDelayed ? 'row-delayed' : ''}`}
                    onClick={() => onSelectShipment(s.shipmentId)}
                    id={`shipment-row-${s.shipmentId}`}
                  >
                    <td>
                      <span className="shipment-id-badge">{s.shipmentId}</span>
                    </td>
                    <td>
                      <span className="customer-name">{s.customerName}</span>
                    </td>
                    <td>
                      <div className="route-cell">
                        <span>{s.origin}</span>
                        <ArrowRight size={14} className="route-arrow" />
                        <span>{s.destination}</span>
                      </div>
                    </td>
                    <td>
                      <div className="mode-badge">
                        {getTransportIcon(s.transportMode)}
                        <span>{s.transportMode}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(s.status)}`}>
                        {s.status}
                      </span>
                      {s.isDelayed && (
                        <span className="delay-flag">
                          <AlertTriangle size={12} /> Delayed
                        </span>
                      )}
                    </td>
                    <td style={{ color: s.isDelayed ? '#f43f5e' : 'inherit', fontWeight: s.isDelayed ? '600' : 'normal' }}>
                      {s.estimatedDeliveryDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
