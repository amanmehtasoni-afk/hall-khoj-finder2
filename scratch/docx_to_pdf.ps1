param(
    [string]$docxPath,
    [string]$pdfPath
)
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone
    $doc = $word.Documents.Open($docxPath)
    $wdFormatPDF = 17
    $doc.SaveAs([ref]$pdfPath, [ref]$wdFormatPDF)
    $doc.Close([ref]0) # wdDoNotSaveChanges
    $word.Quit()
    Write-Host "PDF_CONVERTED_SUCCESSFULLY"
} catch {
    Write-Host "CONVERSION_ERROR: $_"
}
