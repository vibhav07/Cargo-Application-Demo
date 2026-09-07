import React, { useEffect, useState } from 'react';
import { X, Plane, Ship, Truck, Clock, AlertTriangle, CheckCircle2, MapPin, History, FileText } from 'lucide-react';

export default function ShipmentDetails({ shipmentId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shipmentId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/shipments/${shipmentId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Shipment not found');
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [shipmentId]);

  const getTransportIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane size={18} />;
      case 'ocean': return <Ship size={18} />;
      case 'road': return <Truck size={18} />;
      default: return <Truck size={18} />;
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

  const allStages = ['Booked', 'Picked Up', 'In Transit', 'Customs Processing', 'Out For Delivery', 'Delivered'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="shipment-id-badge">{shipmentId}</span>
              {details?.isDelayed && (
                <span className="delay-flag">
                  <AlertTriangle size={14} /> Delayed
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.2rem', marginTop: '0.5rem', color: '#f8fafc' }}>
              {details?.customerName || 'Loading shipment...'}
            </h2>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close detail view" id="close-drawer-btn">
            <X size={22} />
          </button>
        </div>

        <div className="drawer-body">
          {loading && (
            <div className="loading-spinner">
              <Clock className="animate-spin" size={24} />
              <span>Fetching shipment details...</span>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <AlertTriangle size={32} color="#f43f5e" />
              <p style={{ marginTop: '0.5rem' }}>{error}</p>
            </div>
          )}

          {!loading && details && (
            <>
              {/* Shipment Info Section */}
              <div className="detail-card">
                <div className="detail-card-title">
                  <FileText size={18} color="#38bdf8" />
                  Shipment Information
                </div>

                <div className="info-grid">
                  <div>
                    <div className="info-item-label">Customer Name</div>
                    <div className="info-item-value">{details.customerName}</div>
                  </div>

                  <div>
                    <div className="info-item-label">Current Status</div>
                    <div className="info-item-value" style={{ marginTop: '0.3rem' }}>
                      <span className={`status-badge ${getStatusClass(details.status)}`}>
                        {details.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="info-item-label">Origin & Destination</div>
                    <div className="info-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                      <MapPin size={14} color="#38bdf8" />
                      {details.origin} → {details.destination}
                    </div>
                  </div>

                  <div>
                    <div className="info-item-label">Transport Mode</div>
                    <div className="info-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {getTransportIcon(details.transportMode)}
                      <span>{details.transportMode}</span>
                    </div>
                  </div>

                  <div>
                    <div className="info-item-label">Est. Delivery Date</div>
                    <div className="info-item-value" style={{ color: details.isDelayed ? '#f43f5e' : '#f8fafc' }}>
                      {details.estimatedDeliveryDate}
                    </div>
                  </div>

                  <div>
                    <div className="info-item-label">Created At</div>
                    <div className="info-item-value" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {new Date(details.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Timeline Visual */}
              <div className="detail-card">
                <div className="detail-card-title">
                  <Clock size={18} color="#a855f7" />
                  Shipment Timeline
                </div>

                <div className="timeline-list">
                  {allStages.map((stageName) => {
                    const eventOccurred = details.events?.find(
                      (e) => e.eventType.toLowerCase() === stageName.toLowerCase()
                    );

                    const isCurrent = details.status.toLowerCase() === stageName.toLowerCase();
                    const stageIndex = allStages.indexOf(stageName);
                    const currentIndex = allStages.indexOf(details.status);
                    const isPassed = stageIndex <= currentIndex;

                    return (
                      <div className="timeline-item" key={stageName}>
                        <div
                          className={`timeline-dot ${
                            isCurrent ? 'current' : isPassed ? 'completed' : ''
                          }`}
                        >
                          {isPassed && <CheckCircle2 size={12} color="#ffffff" />}
                        </div>
                        <div className="timeline-title" style={{ color: isPassed ? '#f8fafc' : '#64748b' }}>
                          {stageName}
                        </div>
                        {eventOccurred && (
                          <div className="timeline-meta">
                            <span>📅 {new Date(eventOccurred.eventTime).toLocaleString()}</span>
                            <span>📍 {eventOccurred.location}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status History Audit Trail */}
              <div className="detail-card">
                <div className="detail-card-title">
                  <History size={18} color="#10b981" />
                  Status History Log
                </div>

                {details.statusHistory && details.statusHistory.length > 0 ? (
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Previous Status</th>
                        <th>New Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.statusHistory.map((h) => (
                        <tr key={h.id}>
                          <td style={{ color: '#94a3b8' }}>{h.previousStatus}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(h.newStatus)}`}>
                              {h.newStatus}
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8' }}>
                            {new Date(h.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No status transitions logged.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
