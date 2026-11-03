import React from "react";

/**
 * ServicedBrandsBanner
 * High-impact brand capability showcase representing multi-brand precision service.
 * Displays all major Indian road vehicle manufacturers & brands in a sleek automotive card.
 */
export default function ServicedBrandsBanner({ className = "" }) {
  return (
    <section className={`serviced-brands-section ${className}`} aria-label="Supported Vehicle Brands">
      <div className="wrap">
        <div className="serviced-brands-card">
          <div className="brands-card-ambient-glow" aria-hidden="true" />
          
          <div className="brands-card-header">
            <h3 className="brands-card-title">
              SERVICING ALL INDIAN ROAD VEHICLES &amp; BRANDS
            </h3>
          </div>

          <div className="brands-grid-layout">
            {/* Row 1: Primary Domestic & Japanese Giants */}
            <div className="brands-row">
              <span className="brand-item">MARUTI SUZUKI</span>
              <span className="brand-item">HYUNDAI</span>
              <span className="brand-item">TATA MOTORS</span>
            </div>

            {/* Row 2: Leading SUV & Sedan Manufacturers */}
            <div className="brands-row">
              <span className="brand-item">MAHINDRA</span>
              <span className="brand-item">KIA</span>
              <span className="brand-item">HONDA</span>
              <span className="brand-item">TOYOTA</span>
            </div>

            {/* Row 3: European Precision Engineering */}
            <div className="brands-row">
              <span className="brand-item">SKODA / VOLKSWAGEN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
