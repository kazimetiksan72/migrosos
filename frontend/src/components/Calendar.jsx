import React from 'react'
import './Calendar.css'

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
const TR_DAYS = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']

export default function Calendar({ selectedMonth, onMonthChange, holidays }) {
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const isHoliday = (d) => {
    const str = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    return holidays.includes(str)
  }

  const isWeekend = (d) => {
    const dow = new Date(year, month, d).getDay()
    return dow === 0 || dow === 6
  }

  const isToday = (d) => {
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year
  }

  const prevMonth = () => onMonthChange(new Date(year, month - 1, 1))
  const nextMonth = () => onMonthChange(new Date(year, month + 1, 1))

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  let workdays = 0, weekendDays = 0, holidayDays = 0
  for (let d = 1; d <= daysInMonth; d++) {
    if (isHoliday(d)) holidayDays++
    else if (isWeekend(d)) weekendDays++
    else workdays++
  }

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button className="cal-nav" onClick={prevMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="cal-title">
          <span className="cal-month">{TR_MONTHS[month]}</span>
          <span className="cal-year">{year}</span>
        </div>
        <button className="cal-nav" onClick={nextMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div className="calendar-grid">
        {TR_DAYS.map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={[
              'cal-cell',
              d === null ? 'cal-empty' : '',
              d && isHoliday(d) ? 'cal-holiday' : '',
              d && !isHoliday(d) && isWeekend(d) ? 'cal-weekend' : '',
              d && isToday(d) ? 'cal-today' : '',
            ].filter(Boolean).join(' ')}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="cal-legend">
        <div className="cal-legend-item">
          <span className="cal-dot cal-dot-work"></span>
          <span>{workdays} iş günü</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-dot cal-dot-weekend"></span>
          <span>{weekendDays} hafta sonu</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-dot cal-dot-holiday"></span>
          <span>{holidayDays} resmi tatil</span>
        </div>
      </div>

      <div className="cal-summary">
        <div className="cal-summary-item">
          <span className="cal-summary-label">Toplam Gün</span>
          <span className="cal-summary-value">{daysInMonth}</span>
        </div>
        <div className="cal-summary-item">
          <span className="cal-summary-label">Çalışma Günü</span>
          <span className="cal-summary-value cal-work-val">{workdays}</span>
        </div>
      </div>
    </div>
  )
}
