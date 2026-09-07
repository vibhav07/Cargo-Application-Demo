import React, { useState, useEffect } from 'react';
import { Box, UserCheck, Shield } from 'lucide-react';
import ShipmentSearch from './shipment-search/ShipmentSearch';
import ShipmentDashboard from './dashboard/ShipmentDashboard';
import ShipmentDetails from './shipment-details/ShipmentDetails';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);

  // Fetch KPI Stats
  const fetchStats = () => {
    fetch('/api/shipments/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Error fetching stats:', err));
  };

  // Fetch Shipments with search & filter logic
  useEffect(() => {
    setLoading(true);
    fetchStats();

    const url = searchTerm.trim()
      ? `/api/shipments/search?q=${encodeURIComponent(searchTerm.trim())}`
      : '/api/shipments';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;
        if (showDelayedOnly) {
          filtered = data.filter((s) => s.isDelayed);
        }
        setShipments(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching shipments:', err);
        setLoading(false);
      });
  }, [searchTerm, showDelayedOnly]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setShowDelayedOnly(false);
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Box size={24} />
          </div>
          <div>
            <div className="brand-title">Smart Shipment Tracker</div>
            <div className="brand-subtitle">Logistics Operations Portal</div>
          </div>
        </div>

        <div className="header-right">
          <div className="role-badge">
            <span className="role-dot"></span>
            <Shield size={14} color="#10b981" />
            <span>Operations & Support Analyst</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <ShipmentSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showDelayedOnly={showDelayedOnly}
          setShowDelayedOnly={setShowDelayedOnly}
          onReset={handleResetFilters}
        />

        <ShipmentDashboard
          shipments={shipments}
          stats={stats}
          loading={loading}
          onSelectShipment={(id) => setSelectedShipmentId(id)}
        />
      </main>

      {/* Shipment Details Drawer */}
      {selectedShipmentId && (
        <ShipmentDetails
          shipmentId={selectedShipmentId}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}
    </div>
  );
}
