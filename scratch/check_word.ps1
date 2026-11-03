try {
    $w = New-Object -ComObject Word.Application
    Write-Host "WORD_AVAILABLE"
    $w.Quit()
} catch {
    Write-Host "WORD_NOT_AVAILABLE: $_"
}
