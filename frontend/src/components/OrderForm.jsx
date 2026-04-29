import React, { useState, useEffect } from 'react'
import './OrderForm.css'

const HIZMET_OPTIONS = ['YAZILIM KAYNAK BEDELİ', 'YEMEK YANSITMA BEDELİ']

const fmt = (n) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)
const parseTL = (v) => parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0

const emptyForm = {
  firmaAdi: '',
  ilgiliYonetici: '',
  calismaSekli: 'Aylık',
  itemId: '',
  hizmetAciklamasi: '',
  hizmetTanimi: '',
  miktar: '',
  birimFiyat: 0,
  satisTutari: 0,
  kdvOrani: 0,
  kdvTutari: 0,
  faturaToplam: 0,
  tevkifatOrani: 0,
  tevkifatTutari: 0,
  odenecekTutar: 0,
}

export default function OrderForm({ onSubmit, editingData, editingIndex, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm)
  const [birimFiyatDisplay, setBirimFiyatDisplay] = useState('')

  useEffect(() => {
    if (editingData) {
      setForm(editingData)
      setBirimFiyatDisplay(fmt(editingData.birimFiyat))
    } else {
      setForm(emptyForm)
      setBirimFiyatDisplay('')
    }
  }, [editingData])

  useEffect(() => {
    const miktar = parseFloat(form.miktar) || 0
    const birimFiyat = parseTL(birimFiyatDisplay)
    const satisTutari = miktar * birimFiyat
    const hizmet = form.hizmetAciklamasi

    const kdvOrani = hizmet === 'YAZILIM KAYNAK BEDELİ' ? 0.20
      : hizmet === 'YEMEK YANSITMA BEDELİ' ? 0.10 : 0

    const kdvTutari = satisTutari * kdvOrani
    const faturaToplam = satisTutari + kdvTutari

    let tevkifatOrani = 0
    if (hizmet === 'YAZILIM KAYNAK BEDELİ') {
      tevkifatOrani = 0.90
    } else if (hizmet === 'YEMEK YANSITMA BEDELİ') {
      tevkifatOrani = satisTutari > 10000 ? 0.50 : 0
    }

    const tevkifatTutari = kdvTutari * tevkifatOrani
    const odenecekTutar = faturaToplam - tevkifatTutari

    setForm(prev => ({
      ...prev,
      birimFiyat,
      satisTutari,
      kdvOrani,
      kdvTutari,
      faturaToplam,
      tevkifatOrani,
      tevkifatTutari,
      odenecekTutar,
    }))
  }, [form.miktar, birimFiyatDisplay, form.hizmetAciklamasi])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'hizmetAciklamasi') {
      setForm(prev => ({ ...prev, hizmetAciklamasi: value, hizmetTanimi: value }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleBirimFiyatChange = (e) => {
    const raw = e.target.value.replace(/[^0-9,]/g, '')
    setBirimFiyatDisplay(raw)
  }

  const handleBirimFiyatBlur = () => {
    const n = parseTL(birimFiyatDisplay)
    setBirimFiyatDisplay(fmt(n))
  }

  const handleBirimFiyatFocus = () => {
    const n = parseTL(birimFiyatDisplay)
    setBirimFiyatDisplay(n ? String(n).replace('.', ',') : '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.firmaAdi || !form.ilgiliYonetici || !form.hizmetAciklamasi || !form.miktar || !form.birimFiyat) {
      alert('Lütfen zorunlu alanları doldurun.')
      return
    }
    onSubmit({ ...form })
    setForm(emptyForm)
    setBirimFiyatDisplay('')
  }

  const pct = (v) => `%${Math.round(v * 100)}`

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2 className="form-title">
          {editingIndex !== null ? '✏️ Satır Düzenle' : '➕ Yeni Satır Ekle'}
        </h2>
        {editingIndex !== null && (
          <button className="btn-cancel" onClick={onCancelEdit}>İptal</button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label className="form-label required">Firma Adı</label>
            <select className="form-select" name="firmaAdi" value={form.firmaAdi} onChange={handleChange} required>
              <option value="">-- Seçin --</option>
              <option value="PİKSEL TEKNOLOJİ">PİKSEL TEKNOLOJİ</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">İlgili Yönetici</label>
            <select className="form-select" name="ilgiliYonetici" value={form.ilgiliYonetici} onChange={handleChange} required>
              <option value="">-- Seçin --</option>
              <option value="METİN GÖKSU">METİN GÖKSU</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Çalışma Şekli</label>
            <select className="form-select" name="calismaSekli" value={form.calismaSekli} onChange={handleChange}>
              <option value="Aylık">Aylık</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">ITEM_ID</label>
            <input className="form-input" name="itemId" value={form.itemId} onChange={handleChange} placeholder="Boş bırakılabilir" />
          </div>

          <div className="form-group">
            <label className="form-label required">Hizmet Açıklaması</label>
            <select className="form-select" name="hizmetAciklamasi" value={form.hizmetAciklamasi} onChange={handleChange} required>
              <option value="">-- Seçin --</option>
              {HIZMET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Hizmet Tanımı</label>
            <input className="form-input form-input-readonly" value={form.hizmetTanimi} readOnly placeholder="Hizmet açıklaması ile aynı" />
          </div>

          <div className="form-group">
            <label className="form-label required">Miktar</label>
            <input
              className="form-input"
              name="miktar"
              type="number"
              min="1"
              value={form.miktar}
              onChange={handleChange}
              placeholder="Adet"
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Birim Fiyat (₺)</label>
            <input
              className="form-input"
              value={birimFiyatDisplay}
              onChange={handleBirimFiyatChange}
              onBlur={handleBirimFiyatBlur}
              onFocus={handleBirimFiyatFocus}
              placeholder="0,00"
            />
          </div>

          <div className="form-group form-group-wide">
            <label className="form-label">Satış Tutarı (Miktar × Birim Fiyat)</label>
            <div className="calc-field calc-field-blue">
              <span className="calc-value-lg">{form.miktar && form.birimFiyat ? fmt(form.satisTutari) + ' ₺' : '—'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">KDV Oranı</label>
            <div className="calc-field">
              <span className={`kdv-badge ${form.kdvOrani === 0.20 ? 'kdv-20' : form.kdvOrani === 0.10 ? 'kdv-10' : 'kdv-0'}`}>
                {form.hizmetAciklamasi ? pct(form.kdvOrani) : '—'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">KDV Tutarı</label>
            <div className="calc-field">
              <span className="calc-value">{form.hizmetAciklamasi ? fmt(form.kdvTutari) + ' ₺' : '—'}</span>
            </div>
          </div>

          <div className="form-group form-group-wide">
            <label className="form-label">Fatura Toplam Tutar (KDV Dahil)</label>
            <div className="calc-field calc-field-highlight">
              <span className="calc-value-lg">{form.hizmetAciklamasi ? fmt(form.faturaToplam) + ' ₺' : '—'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tevkifat Oranı</label>
            <div className="calc-field">
              <span className={`kdv-badge ${form.tevkifatOrani > 0 ? 'tevk-active' : 'kdv-0'}`}>
                {form.hizmetAciklamasi ? pct(form.tevkifatOrani) : '—'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tevkifat Tutarı</label>
            <div className="calc-field">
              <span className="calc-value">{form.hizmetAciklamasi ? fmt(form.tevkifatTutari) + ' ₺' : '—'}</span>
            </div>
          </div>

          <div className="form-group form-group-wide">
            <label className="form-label">Ödenecek Tutar (Tevkifat Düşülmüş)</label>
            <div className="calc-field calc-field-success">
              <span className="calc-value-lg success-val">{form.hizmetAciklamasi ? fmt(form.odenecekTutar) + ' ₺' : '—'}</span>
            </div>
          </div>

        </div>

        <div className="form-footer">
          <div className="form-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Satış tutarı = Miktar × Birim Fiyat. KDV ve tevkifat otomatik hesaplanır.
          </div>
          <button type="submit" className="btn-submit">
            {editingIndex !== null ? 'Güncelle' : 'Listeye Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}
