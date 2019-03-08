#! /bin/sh

echo "Content-type:text/html;charset=utf-8"
echo

cat << EOF
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>GET</title>
  </head>
  <body>
    Got from client: $QUERY_STRING 
  </body>
</html>
EOF
