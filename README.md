# MigrosOS - Sipariş Teklif Formu

## Kurulum

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Çalıştırma

### Tüm servisleri tek komutla başlatmak için:
```bash
./start.sh
```

### Ya da ayrı ayrı:
```bash
# Backend (port 3001)
cd backend && npm start

# Frontend (port 3000)
cd frontend && npx vite
```

## Kullanım

Uygulama açıldıktan sonra `http://localhost:3000` adresine gidin.

### Form Alanları
- **Firma Adı** - Zorunlu
- **İlgili Yönetici** - Zorunlu
- **Çalışma Şekli** - Aylık (sabit)
- **ITEM_ID** - Opsiyonel
- **Hizmet Açıklaması** - YAZILIM KAYNAK BEDELİ veya YEMEK YANSITMA BEDELİ
- **Hizmet Tanımı** - Hizmet açıklaması ile otomatik dolar
- **Miktar** - Manuel giriş
- **Satış Tutarı** - TL formatında manuel giriş

### Otomatik Hesaplanan Alanlar
- KDV Oranı: Yazılım → %20, Yemek → %10
- KDV Tutarı: Satış × KDV Oranı
- Fatura Toplam: Satış + KDV
- Tevkifat Oranı: Yazılım → %90, Yemek (>10.000₺) → %50, Yemek (≤10.000₺) → %0
- Tevkifat Tutarı: KDV × Tevkifat Oranı
- Ödenecek Tutar: Toplam - Tevkifat

### Excel İndirme
Satırları ekledikten sonra sağ üstteki "Excel İndir" butonuna tıklayın.

### Takvim
Sol panelde seçili ayın takvimi görüntülenir:
- 🔵 Mavi: Hafta sonu günleri
- 🔴 Kırmızı: Resmi tatil günleri
- ⬤ Kırmızı dolgu: Bugün
