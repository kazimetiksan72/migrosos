import React from 'react'
import './Header.css'

export default function Header({ onExport, rowCount }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#e2231a"/>
            <path d="M6 10h20M6 16h20M6 22h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="header-title">MigrosOS</h1>
          <p className="header-subtitle">Sipariş Teklif Formu</p>
        </div>
      </div>
      <div className="header-actions">
        {rowCount > 0 && (
          <span className="header-badge">{rowCount} satır</span>
        )}
        <button
          className="btn-export"
          onClick={onExport}
          disabled={rowCount === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Excel İndir
        </button>
      </div>
    </header>
  )
}
