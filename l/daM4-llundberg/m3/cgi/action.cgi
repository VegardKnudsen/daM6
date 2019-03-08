#!/bin/bash

echo    'Content-Type: text/html; charset=UTF-8'
echo    
echo    '<html>'
echo    '<head><title>CGI: Get book</title></head>'
echo    '<body>'
echo    '<h1>CGI Get</h1>'
echo    '<h2>Add a new book</h2>'
#action=address | address is the url of the cgi script the content should be sent to

xmlpost=$(curl --request POST "http://172.17.0.2:3000/add/authors/3/JK/Rowling/UK")
xmlresp=$(curl --request GET "http://172.17.0.2:3000/authors/1")

echo    "$xmlresp"
echo    '</body>'
echo    '<html>'
