const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Turkish public holidays 2026
const TR_HOLIDAYS_2026 = [
  '2026-01-01', // Yılbaşı
  '2026-04-23', // Ulusal Egemenlik ve Çocuk Bayramı
  '2026-05-01', // Emek ve Dayanışma Günü
  '2026-05-19', // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  '2026-07-15', // Demokrasi ve Millî Birlik Günü
  '2026-08-30', // Zafer Bayramı
  '2026-10-29', // Cumhuriyet Bayramı
  // Ramazan Bayramı 2026 (tahmini: 20-22 Mart)
  '2026-03-20',
  '2026-03-21',
  '2026-03-22',
  // Kurban Bayramı 2026 (tahmini: 27-30 Mayıs)
  '2026-05-27',
  '2026-05-28',
  '2026-05-29',
  '2026-05-30',
];

app.get('/api/holidays', (req, res) => {
  res.json(TR_HOLIDAYS_2026);
});

app.post('/api/generate-excel', async (req, res) => {
  const { rows } = req.body;
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Geçersiz veri' });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Siparis_teklif formu ');

  // Header row
  const headers = [
    'Firma Adı',
    'İlgili yönetici',
    'Çalışma Şekli',
    'ITEM_ID',
    'Hizmet Açıklama',
    'Hizmet Tanımı *',
    'Miktar *',
    'Birim Fiyat *',
    'Kdv Oranı',
    'Satış Tutarı',
    'Kdv Tutarı',
    'Fatura Toplam Tutar  Kdv dahil',
    'Fatura Tevkifatlımı olacak Tevkifat oranu',
    'Tevkifat Tutar',
    'Ödenecek Tutar (Tevkifat Düşülmüş)',
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E5F8E' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  headerRow.height = 40;

  // Column widths
  const colWidths = [20, 18, 14, 10, 24, 24, 10, 14, 12, 14, 14, 20, 20, 16, 24];
  colWidths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });

  // Data rows
  rows.forEach((row) => {
    const dataRow = sheet.addRow([
      row.firmaAdi,
      row.ilgiliYonetici,
      row.calismaSekli,
      row.itemId || 'Boş',
      row.hizmetAciklamasi,
      row.hizmetTanimi,
      row.miktar,
      row.satisTutari,
      row.kdvOrani,
      row.satisTutari,
      row.kdvTutari,
      row.faturaToplam,
      row.tevkifatOrani,
      row.tevkifatTutari,
      row.odenecekTutar,
    ]);

    dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle' };

      // Number formatting for currency columns
      if ([8, 10, 11, 12, 14, 15].includes(colNumber)) {
        cell.numFmt = '#,##0.00 ₺';
      }
      if (colNumber === 9 || colNumber === 13) {
        cell.numFmt = '0%';
      }
    });

    dataRow.height = 22;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="Siparis_${Date.now()}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
});

// Serve built frontend in production
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ MigrosOS çalışıyor: http://localhost:${PORT}`);
});
