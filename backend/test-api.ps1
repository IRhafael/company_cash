# Script de teste da API
Write-Host "=== TESTE DA API BACKEND ===" -ForegroundColor Green

# 1. Teste Health Check
Write-Host "`n1. Testando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 5
    Write-Host "Health Check OK: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Erro no Health Check: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verificando se o servidor está rodando..."
    
    # Tentar iniciar o servidor
    Write-Host "Iniciando servidor backend..." -ForegroundColor Yellow
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "." -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 10
    
    # Tentar novamente
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 5
        Write-Host "Health Check OK após restart: $($health | ConvertTo-Json)" -ForegroundColor Green
    } catch {
        Write-Host "Servidor não está respondendo mesmo após restart" -ForegroundColor Red
        exit 1
    }
}

# 2. Teste Registro
Write-Host "`n2. Testando Registro de Usuário..." -ForegroundColor Yellow
$userData = Get-Content "test-user.json" -Raw
try {
    $register = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $userData -ContentType "application/json" -TimeoutSec 10
    Write-Host "Registro OK: $($register | ConvertTo-Json)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Usuário já existe (409 - esperado)" -ForegroundColor Yellow
    } else {
        Write-Host "Erro no registro: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Teste Login
Write-Host "`n3. Testando Login..." -ForegroundColor Yellow
$loginData = @{
    email = "teste@teste.com"
    password = "123456"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "Login OK!" -ForegroundColor Green
    $token = $login.token
    Write-Host "Token obtido: $($token.Substring(0, 20))..." -ForegroundColor Green
    
    # 4. Teste endpoint protegido
    Write-Host "`n4. Testando endpoint protegido (income sources)..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $sources = Invoke-RestMethod -Uri "http://localhost:3001/api/income-sources" -Method GET -Headers $headers -TimeoutSec 10
        Write-Host "Sources obtidas: $($sources.Count) items" -ForegroundColor Green
        Write-Host "Primeira source: $($sources[0] | ConvertTo-Json)" -ForegroundColor Cyan
    } catch {
        Write-Host "Erro ao buscar sources: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTE CONCLUÍDO ===" -ForegroundColor Green