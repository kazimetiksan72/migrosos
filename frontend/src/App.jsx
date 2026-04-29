import React, { useState, useEffect, useMemo } from 'react'
import OrderForm from './components/OrderForm'
import OrderTable from './components/OrderTable'
import Calendar from './components/Calendar'
import Header from './components/Header'
import './App.css'

export default function App() {
  const [rows, setRows] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 1)
  })
  const [holidays, setHolidays] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)

  const workdays = useMemo(() => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const str = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dow = new Date(year, month, d).getDay()
      if (dow !== 0 && dow !== 6 && !holidays.includes(str)) count++
    }
    return count
  }, [selectedMonth, holidays])

  useEffect(() => {
    fetch('/api/holidays')
      .then(r => r.json())
      .then(setHolidays)
      .catch(() => {})
  }, [])

  const handleAddRow = (row) => {
    if (editingIndex !== null) {
      setRows(prev => prev.map((r, i) => i === editingIndex ? row : r))
      setEditingIndex(null)
    } else {
      setRows(prev => [...prev, row])
    }
  }

  const handleDelete = (index) => {
    setRows(prev => prev.filter((_, i) => i !== index))
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
  }

  const handleExport = async () => {
    if (rows.length === 0) {
      alert('Lütfen önce en az bir satır ekleyin.')
      return
    }
    try {
      const res = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows })
      })
      if (!res.ok) throw new Error('Hata')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Siparis_${new Date().toISOString().slice(0,10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Excel oluşturulamadı: ' + e.message)
    }
  }

  return (
    <div className="app-layout">
      <Header onExport={handleExport} rowCount={rows.length} />
      <div className="app-body">
        <aside className="app-sidebar">
          <Calendar
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            holidays={holidays}
          />
        </aside>
        <main className="app-main">
          <OrderForm
            onSubmit={handleAddRow}
            editingData={editingIndex !== null ? rows[editingIndex] : null}
            editingIndex={editingIndex}
            onCancelEdit={() => setEditingIndex(null)}
            workdays={workdays}
            selectedMonth={selectedMonth}
          />
          <OrderTable
            rows={rows}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </main>
      </div>
    </div>
  )
}
