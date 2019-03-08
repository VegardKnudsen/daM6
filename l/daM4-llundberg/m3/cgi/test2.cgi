#!/bin/sh
echo "Content-type:text/plain;charset=utf-8"
echo

read BODY

echo BODY:            $BODY
echo CONTENT_LENGTH:  $CONTENT_LENGTH

USERNAME=`echo "$BODY" | sed -n 's/^.*uname=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
PASSWORD=`echo "$BODY" | sed -n 's/^.*psw=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`

echo $USERNAME
echo $PASSWORD

resp=$(curl --data "userID=$USERNAME&passwordhash=$PASSWORD" POST "http://172.17.0.2:3000/login")
echo $resp

if [[ "$resp" == *"Found. Redirecting to /cgi-bin/test3.cgi"* ]] ; then
    test3.cgi
fi

/usr/bin/env | grep $REQUEST_METHOD