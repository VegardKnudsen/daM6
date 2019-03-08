#! /bin/sh

read inputstring

echo "Content-type:text/html;charset=utf-8"
echo

cat << EOF
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>Post</title>
  </head>
  <body>
    Posted from client: $inputstring 
  </body>
</html>
EOF
