$sh = New-Object -ComObject Shell.Application
$rb = $sh.Namespace(10)
$results = @()
foreach ($item in $rb.Items()) {
    $results += [PSCustomObject]@{
        Name = $item.Name
        OrigLoc = $rb.GetDetailsOf($item, 1)
        DateDel = $rb.GetDetailsOf($item, 2)
        Size = $rb.GetDetailsOf($item, 3)
        Type = $rb.GetDetailsOf($item, 4)
    }
}
$results | Where-Object { $_.OrigLoc -like '*viril*' -or $_.Name -like '*.mp4' -or $_.Name -like '*viril*' -or $_.Name -like '*Portefeuille*' -or $_.Name -like '*sac*' } | Format-Table -AutoSize
