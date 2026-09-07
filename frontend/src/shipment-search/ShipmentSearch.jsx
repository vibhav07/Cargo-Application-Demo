import React from 'react';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ShipmentSearch({
  searchTerm,
  setSearchTerm,
  showDelayedOnly,
  setShowDelayedOnly,
  onReset
}) {
  return (
    <div className="controls-bar">
      <div className="search-input-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by Shipment ID (e.g. SP1001) or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="shipment-search-input"
        />
      </div>

      <div className="filter-actions">
        <button
          className={`filter-btn ${showDelayedOnly ? 'active-delay' : ''}`}
          onClick={() => setShowDelayedOnly(!showDelayedOnly)}
          id="toggle-delayed-btn"
        >
          <AlertTriangle size={16} />
          {showDelayedOnly ? 'Showing Delayed Only' : 'Filter Delayed'}
        </button>

        {(searchTerm || showDelayedOnly) && (
          <button className="filter-btn" onClick={onReset} title="Reset filters">
            <RefreshCw size={16} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
