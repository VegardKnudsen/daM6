#!/bin/sh
echo "Content-type: text/html"
echo

read BODY

cat << EOF
<!doctype html>
<html>
 <head>
  <meta charset='utf-8'>
  <title>Please work</title>
  <style>
	form {
		border: 3px solid #f1f1f1;
	}
	h1{
		color: #4f92ff;
	}
	button {
		background-color: #4f92ff;
		color: white;
		padding: 15px 32px;
		text-align: center;
		display: inline-block;
		font-size: 16px;
		margin: 8px 0;
		cursor: pointer;
	}
	input{
		background-color: #e8f0ff;
	}
</style>
 </head>
 <body>
  <form method=POST>
   <input type="text" placeholder="Username" name="usr" required>
   <input type="password" placeholder="Password" name="psw" required>
   <button type=submit>Login</button> 
  </form>
 </body>
</html>

EOF

USR=$(echo $BODY | awk -F'[=&]' {'print $2'})
PSW=$(echo $BODY | awk -F'[=&]' {'print $4'})

#echo 'her er user:' $USER 'og passord:' $PSW


if [[ "$REQUEST_METHOD" == "POST" ]] ; then
	XLM_CONTENT="<test><userID>$USR</userID><passwordhash>$PSW</passwordhash></test>"
	resp=$(curl POST "http://172.17.0.2:3000/login" --data "$XLM_CONTENT")
	echo 'her er responsen' $resp
fi

#if [[ "$REQUEST_METHOD" == "GET" ]] ; then
#    /usr/bin/env | grep $REQUEST_METHOD
#fi

#/usr/bin/env | grep $REQUEST_METHOD