Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("PROJECT_SYNOPSIS.docx")
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "*media*") {
        Write-Output $entry.FullName
    }
}
$zip.Dispose()
