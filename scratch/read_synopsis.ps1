Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("PROJECT_SYNOPSIS.docx")
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$text = [System.Text.RegularExpressions.Regex]::Replace($xml, "<[^>]+>", " ")
$text = [System.Text.RegularExpressions.Regex]::Replace($text, "\s+", " ")
[System.IO.File]::WriteAllText("scratch/docx_text.txt", $text)
Write-Output "Extracted length: $($text.Length)"
Write-Output $text.Substring(0, [Math]::Min(1000, $text.Length))
