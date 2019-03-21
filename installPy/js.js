#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017';
var url = 'mongodb://130.245.170.77:27017';


app.use(session({secret:'iloveit'}))
app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: false}) ) ; // must use this to parse form data
app.use(bodyParser.json() ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	return response.render('login', {person : "KevinLOII"})
}

global.ret = "NONE"
app.all('/adduser', adduser)
function adduser(request, response){
	
	if( request.method == 'POST'){
		var jss = request.body
		var name = jss['username']
		var email = jss['email']
		var password = jss['password']
		var db = request.app.locals.db
		test = [0]
		var user = { 'username': name, 'email': email, 'password': password, 'verified': 'no' }
		db.collection('user').insertOne(user, function(err, r){
			if(err) {throw err}
			console.log('addedd   success')
			test[0] = 1
		})
		console.log(test[0])

		console.log("Added user")
		return response.json({ 'status': 'OK' })
	}
	return response.render('adduser')
}


app.post('/verify',verify)
function verify(request, response){
	if( request.method == 'POST'){
		var jss =request.body
		var email = jss['email']
		var key = jss['key']

		if(key != 'abracadabra'){
			return response.json({ 'status': 'ERROR' })
		}
		
		MongoClient.connect(url,  { useNewUrlParser: true }, verifyUser)
		function verifyUser(err, db){
			if (err) throw err;
			var userTable = db.db("stack").collection("user")
		  	var myquery = { 'email': email }
		  	var newvalues = { $set: {'verified': "yes" } };
		  	userTable.updateOne(myquery, newvalues, updateStat)
		  	function updateStat(err, res){
		  		if (err) throw err;
		  	}
		  	db.close()
		}
		return response.json({ 'status': 'OK' })

	}
}

app.all('/login', login)
function login(request, response){
	if( request.method == 'POST'){
		var username = request.body['username']
		var password = request.body['password']
		var ret = {'status': "OK"}

		MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db){
			if(err){throw err}
			var userTable = db.db("stack").collection("user")
			userTable.find({'username': username}).toArray(function(err, result){
				if(err) res.send(err);
				query = result[0]
				console.log("QUERY is :" + query.verified)
				if(query['password'] == password && query['verified'] == 'yes'){
					request.session['user'] = username

				}else{
					ret['status'] = "ERROR"
					console.log("result is " + ret['status'])
		return response.json(ret)

				}
			})
			db.close()				
		})
		
	}
	return response.render('login')
}

app.all('/logout', logout)
function logout(request, response){
	if( request.method == 'POST'){
		request.session = null
		return response.json({ 'status': 'OK' })
	}
}



MongoClient.connect(url, { useNewUrlParser: false }, (err, client) => {
    // ... start the server
    if(err){throw err}
    db = client.db('stack');
    app.locals.db = db;
    app.listen(8080, 'localhost');
    console.log('Server running at http://0.0.0.0:8080/')
})




//response.sendFile(__dirname + '/templates/adduser.html')
//<%= person %>      ejs template engine
