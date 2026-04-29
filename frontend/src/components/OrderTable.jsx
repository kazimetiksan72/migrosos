import React from 'react'
import './OrderTable.css'

const fmt = (n) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)
const pct = (v) => `%${Math.round(v * 100)}`

export default function OrderTable({ rows, onDelete, onEdit }) {
  if (rows.length === 0) {
    return (
      <div className="table-card table-empty">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <p className="empty-text">Henüz satır eklenmedi</p>
        <p className="empty-sub">Yukarıdaki formu doldurup "Listeye Ekle" butonuna tıklayın</p>
      </div>
    )
  }

  const totalSatis = rows.reduce((s, r) => s + (r.satisTutari || 0), 0)
  const totalKdv = rows.reduce((s, r) => s + (r.kdvTutari || 0), 0)
  const totalToplam = rows.reduce((s, r) => s + (r.faturaToplam || 0), 0)
  const totalTevkifat = rows.reduce((s, r) => s + (r.tevkifatTutari || 0), 0)
  const totalOdenecek = rows.reduce((s, r) => s + (r.odenecekTutar || 0), 0)

  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Sipariş Listesi</h3>
        <span className="table-count">{rows.length} satır</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Firma Adı</th>
              <th>Yönetici</th>
              <th>Hizmet</th>
              <th>Miktar</th>
              <th style={{textAlign:'right'}}>Birim Fiyat</th>
              <th style={{textAlign:'right'}}>Satış Tutarı</th>
              <th>KDV%</th>
              <th style={{textAlign:'right'}}>KDV Tutarı</th>
              <th style={{textAlign:'right'}}>Toplam</th>
              <th>Tevk%</th>
              <th style={{textAlign:'right'}}>Tevkifat</th>
              <th style={{textAlign:'right'}}>Ödenecek</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="td-num">{i + 1}</td>
                <td className="td-bold">{row.firmaAdi}</td>
                <td>{row.ilgiliYonetici}</td>
                <td>
                  <span className={`hizmet-tag ${row.hizmetAciklamasi === 'YAZILIM KAYNAK BEDELİ' ? 'hizmet-yazilim' : 'hizmet-yemek'}`}>
                    {row.hizmetAciklamasi === 'YAZILIM KAYNAK BEDELİ' ? 'YAZILIM' : 'YEMEK'}
                  </span>
                </td>
                <td className="td-center">{row.miktar || '—'}</td>
                <td className="td-money">{fmt(row.birimFiyat)} ₺</td>
                <td className="td-money">{fmt(row.satisTutari)} ₺</td>
                <td className="td-center">{pct(row.kdvOrani)}</td>
                <td className="td-money">{fmt(row.kdvTutari)} ₺</td>
                <td className="td-money td-highlight">{fmt(row.faturaToplam)} ₺</td>
                <td className="td-center">{pct(row.tevkifatOrani)}</td>
                <td className="td-money">{fmt(row.tevkifatTutari)} ₺</td>
                <td className="td-money td-success">{fmt(row.odenecekTutar)} ₺</td>
                <td className="td-actions">
                  <button className="btn-edit" onClick={() => onEdit(i)} title="Düzenle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(i)} title="Sil">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-total">
              <td colSpan="6" className="total-label">TOPLAM</td>
              <td className="td-money total-val">{fmt(totalSatis)} ₺</td>
              <td></td>
              <td className="td-money total-val">{fmt(totalKdv)} ₺</td>
              <td className="td-money total-val td-highlight">{fmt(totalToplam)} ₺</td>
              <td></td>
              <td className="td-money total-val">{fmt(totalTevkifat)} ₺</td>
              <td className="td-money total-val td-success">{fmt(totalOdenecek)} ₺</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
