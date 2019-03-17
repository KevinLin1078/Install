#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, '/templates'))) //tells Nodejs that template is static


app.get('/', index)
function index(request, response){
	response.sendFile(__dirname + '/templates/login.html')
}

app.get('/hey', adduser)
function adduser(request, response){
	console.log(request.method)
	response.sendFile(__dirname + '/templates/adduser.html')
}





app.listen(8080, 'localhost');
console.log('Server running at http://localhost:8080/');
