# install Deno 1.10.3 into ./bin
$env:DENO_INSTALL = "$pwd"
$v="1.10.3"
iwr https://deno.land/x/install/install.ps1 -useb | iex
