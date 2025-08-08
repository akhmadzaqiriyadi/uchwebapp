#!/bin/bash

# =================================================================
# SKRIP DEPLOYMENT FINAL UNTUK UCH CREATIVE HUB WEB APP
# =================================================================
# Pastikan variabel di bawah ini sudah sesuai dengan konfigurasi Anda
# -----------------------------------------------------------------
VPS_USER="vps"
VPS_IP="192.168.254.200"
SSH_KEY_PATH="~/vps"
GIT_REPO_URL="https://github.com/akhmadzaqiriyadi/uchwebapp.git" # <-- GANTI JIKA PERLU
# -----------------------------------------------------------------

echo "🚀 Memulai proses deploy UCH Web App ke VPS..."

ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} << 'EOF'
  set -e # Hentikan skrip jika ada error
  
  REPO_URL="https://github.com/akhmadzaqiriyadi/uchwebapp.git" # <-- GANTI JIKA PERLU

  echo "🔐 Berhasil terhubung ke VPS!"

  if [ -d "/home/vps/uchwebapp/.git" ]; then
    cd /home/vps/uchwebapp
    echo "📥 Menarik update terbaru dari Git..."
    git fetch origin main
    git reset --hard origin/main
  else
    echo "📥 Repositori belum ada, melakukan cloning..."
    git clone $REPO_URL /home/vps/uchwebapp
    cd /home/vps/uchwebapp
  fi

  # =================================================
  # DEPLOY BACKEND (uch-backend)
  # =================================================
  echo ""
  echo "🛠️  Mulai deploy Backend..."
  cd /home/vps/uchwebapp/uch-backend

  echo "📦 Membuat file .env untuk Backend..."
  cat > .env << 'ENV_EOF'
# >> KREDENSIAL DATABASE SUDAH DIPERBARUI <<
PORT=5000
DATABASE_URL="mysql://uch_user:uchwebkerenuty2002@localhost:3306/uch_booking_db"
JWT_SECRET="1dfc431d51279fd87bccb5c23ad65620d83b6cea69ed5a4c8df36943c3a6e28a"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_USER="sentrahki@uty.ac.id"
EMAIL_PASS="mukjitgwehsvaxex"
ADMIN_EMAIL="sentrahki@uty.ac.id"
ENV_EOF

  echo "📦 Menginstall dependensi Backend..."
  npm install

  echo "🗄️ Menjalankan migrasi database Prisma..."
  npx prisma migrate deploy
  
  # Jalankan seed jika ada
  if [ -f "prisma/seed.js" ]; then
    echo "🌱 Menjalankan database seeding..."
    node prisma/seed.js
  fi

  echo "🚀 Menjalankan Backend dengan PM2..."
  pm2 restart uch-backend || pm2 start src/index.js --name "uch-backend"

  # =================================================
  # DEPLOY FRONTEND (uch-creative-hub-frontend)
  # =================================================
  echo ""
  echo "🎨 Mulai deploy Frontend..."
  cd /home/vps/uchwebapp/uch-creative-hub-frontend

  echo "📦 Membuat file .env.local untuk Frontend..."
  cat > .env.local << 'CLIENT_ENV_EOF'
NEXT_PUBLIC_API_URL=https://kreanovasi.uty.ac.id/api
CLIENT_ENV_EOF

  echo "📦 Menginstall dependensi Frontend..."
  npm install

  echo "🔨 Mem-build aplikasi Frontend..."
  npm run build

  echo "🚀 Menjalankan Frontend dengan PM2..."
  pm2 restart uch-frontend || pm2 start npm --name "uch-frontend" -- start

  echo ""
  echo "📊 Status proses PM2 saat ini:"
  pm2 list

  echo ""
  echo "🎉 Deploy UCH Web App selesai!"
  echo "📍 Kunjungi aplikasi Anda di: https://kreanovasi.uty.ac.id"
EOF

echo ""
echo "✅ Skrip deploy selesai dijalankan dari mesin lokal Anda!"
