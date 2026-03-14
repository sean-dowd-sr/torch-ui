$file = 'e:\Projects\torch-ui\src\components\forms\MultiSelect.tsx'
$lines = [System.IO.File]::ReadAllLines($file)
$out = foreach ($line in $lines) {
    $i = 0
    $tabs = 0
    while ($i + 1 -lt $line.Length -and $line[$i] -eq ' ' -and $line[$i+1] -eq ' ') {
        $tabs++
        $i += 2
    }
    ("`t" * $tabs) + $line.Substring($i)
}
[System.IO.File]::WriteAllLines($file, $out)
Write-Host "Done: $($lines.Length) lines converted"
