$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
} catch {
    $port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
}

$basePath = "C:\Users\siddh\.gemini\antigravity\scratch\ai-loan-eligibility-checker"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        $relPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = 'index.html' }
        $filePath = Join-Path $basePath $relPath
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            if ($filePath.EndsWith('.html')) { $res.ContentType = 'text/html; charset=utf-8' }
            elseif ($filePath.EndsWith('.css')) { $res.ContentType = 'text/css; charset=utf-8' }
            elseif ($filePath.EndsWith('.js')) { $res.ContentType = 'application/javascript; charset=utf-8' }
            elseif ($filePath.EndsWith('.svg')) { $res.ContentType = 'image/svg+xml' }
            elseif ($filePath.EndsWith('.json')) { $res.ContentType = 'application/json' }
            $res.ContentLength64 = $content.Length
            $res.OutputStream.Write($content, 0, $content.Length)
        } else {
            $res.StatusCode = 404
            $buf = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            $res.OutputStream.Write($buf, 0, $buf.Length)
        }
        $res.Close()
    } catch {
        # continue listening on minor socket errors
    }
}
