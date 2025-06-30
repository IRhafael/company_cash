# Script para recriar o banco de dados e reiniciar o servidor
Write-Host "Parando servidor se estiver rodando..." -ForegroundColor Yellow

Write-Host "Recriando banco de dados..." -ForegroundColor Green
npm run db:recreate

Write-Host "Populando dados padrão..." -ForegroundColor Green
npm run db:seed

Write-Host "Iniciando servidor..." -ForegroundColor Green
npm run dev
