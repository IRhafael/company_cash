# Script para instalar dependências e executar o backend
Write-Host "Instalando dependências do backend..." -ForegroundColor Green
cd backend
npm install

Write-Host "Iniciando servidor backend..." -ForegroundColor Green
npm run dev
