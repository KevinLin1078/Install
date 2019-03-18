#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: true}) ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	return response.render('login', {person : "KevinLOII"})
}

app.all('/adduser', adduser)
function adduser(request, response){
	if( request.method == 'POST'){
		name = request.body['username']
		email = request.body['email']
		password = request.body['password']
		
		
	}
	return response.render('adduser')
}


app.listen(8080, 'localhost');
console.log('Server running at http://0.0.0.0:8080/');


//response.sendFile(__dirname + '/templates/adduser.html')
//<%= person %>      ejs template engine