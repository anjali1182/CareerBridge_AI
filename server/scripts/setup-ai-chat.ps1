# CareerBridge AI chat setup — opens free Groq key page (recommended)
Write-Host ""
Write-Host "=== CareerBridge AI Chat Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "FREE (recommended): Groq API key" -ForegroundColor Green
Write-Host "  1. Browser mein Groq keys page khulega"
Write-Host "  2. Sign up -> Create API Key -> copy (gsk_...)"
Write-Host "  3. server\.env file mein paste karo:"
Write-Host "     GROQ_API_KEY=gsk_your_key_here"
Write-Host ""
Write-Host "PAID: OpenAI / ChatGPT key" -ForegroundColor Yellow
Write-Host "  https://platform.openai.com/api-keys"
Write-Host "  OPENAI_API_KEY=sk_..."
Write-Host ""
Write-Host "Phir: cd server; npm run dev" -ForegroundColor Cyan
Write-Host ""

$envPath = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envPath) {
  notepad $envPath
}

Start-Process "https://console.groq.com/keys"
