#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
//npm install express-session
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';



console.log('successSSS')

app.use(session({secret:'iloveit'}))

app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: true}) ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	return response.render('login', {person : "KevinLOII"})
}


app.all('/adduser', adduser)
function adduser(request, response){
	
	MongoClient.connect(url,  { useNewUrlParser: true }, insert)
	function insert(err, db){
		var dbo = db.db("mm");
		var myobj = { name: "Ann23iec", address: "Anna 43537" };
	  	dbo.collection("movie").insertOne(myobj)
	  	db.close()
	}
	if( request.method == 'POST'){
		name = request.body['username']
		email = request.body['email']
		password = request.body['password']
		console.log("Added")
		return response.json({ 'status': 'OK' })
	}
	return response.render('adduser')
}



app.all('/login', login)
function login(request, response){
	if( request.method == 'POST'){
		name = request.body['username']
		password = request.body['password']
		request.session['name'] = name
		return response.json({ 'status': 'OK' , 'session': request.session['name'] })
	}
	return response.render('login')
}

app.all('/logout', logout)
function logout(request, response){
	if( request.method == 'POST'){
		request.session['name'] = null;
		return response.json({"sessionPOST" :request.session['name']})
	}
	request.session = null;
	return response.json({"sessionGET" :request.session})
}



app.listen(8080, 'localhost');
console.log('Server running at http://0.0.0.0:8080/')

//response.sendFile(__dirname + '/templates/adduser.html')
//<%= person %>      ejs template engine
