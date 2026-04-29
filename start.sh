#!/bin/bash
# MigrosOS - Geliştirme ortamını başlat

BASE="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 MigrosOS başlatılıyor..."
echo ""

# Bağımlılıkları yükle (gerekiyorsa)
if [ ! -d "$BASE/backend/node_modules" ]; then
  echo "📦 Backend bağımlılıkları yükleniyor..."
  npm install --prefix "$BASE/backend" --silent
fi

if [ ! -d "$BASE/frontend/node_modules" ]; then
  echo "📦 Frontend bağımlılıkları yükleniyor..."
  npm install --prefix "$BASE/frontend" --silent
fi

# Backend başlat
echo "📦 Backend başlatılıyor (port 3001)..."
node "$BASE/backend/server.js" &
BACKEND_PID=$!

sleep 1

# Frontend başlat
echo "🎨 Frontend başlatılıyor (port 3000)..."
npx --prefix "$BASE/frontend" vite &
FRONTEND_PID=$!

echo ""
echo "✅ MigrosOS çalışıyor!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Durdurmak için Ctrl+C basın"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Durduruldu.'; exit 0" INT TERM

wait
