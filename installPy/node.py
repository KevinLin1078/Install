
import os

arr=[
	'sudo apt-get update', 'sudo apt-get install -y nodejs',	
	'sudo apt-get install -y npm', 'curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh',
	'sudo bash nodesource_setup.sh', 'sudo apt-get install -y nodejs', 'sudo apt-get install -y build-essential',
	'sudo npm install -y -g pm2', 'sudo ufw allow OpenSSH'
	]

for i in arr:
	os.system(i)



# #!/usr/bin/env nodejs
# //var http = require('http');
# var express = require('express')
# var app = express()
# var path = require('path')
# var bodyParser = require('body-parser')
# var session = require('express-session')
# var MongoClient = require('mongodb').MongoClient;
# var url = 'mongodb://localhost:27017';
# //var url = 'mongodb://130.245.170.77:27017';


# app.use(session({secret:'iloveit'}))
# app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
# app.set('view engine', 'ejs') // will lok for 'views' folder
# app.use(bodyParser.urlencoded( {extended: false}) ) ; // must use this to parse form data
# app.use(bodyParser.json() ) ; // must use this to parse form data


# app.all('/', index)
# function index(request, response){
# 	return response.render('login', {person : "KevinLOII"})
# }

# global.ret = "NONE"
# app.all('/adduser', adduser)
# function adduser(request, response){
	
# 	if( request.method == 'POST'){
# 		var jss = request.body
# 		var name = jss['username']
# 		var email = jss['email']
# 		var password = jss['password']

# 		MongoClient.connect(url,  { useNewUrlParser: true }, insertUser)
# 		function insertUser(err, db){
# 			if (err) throw err;
# 			var userTable = db.db("stack").collection("user")
# 			var user = { 'username': name, 'email': email, 'password': password, 'verified': 'no' }
# 		  	userTable.insertOne(user)
# 		  	// var myquery = { 'username': name }
# 		  	// var newvalues = { $set: {'verified': "yes" } };
# 		  	// userTable.updateOne(myquery, newvalues, updateStat)
# 		  	// function updateStat(err, res){
# 		  	// 	if (err) throw err;
# 		  	// }
# 		  	db.close()
# 		}
# 		console.log("Added user")
# 		return response.json({ 'status': 'OK' })
# 	}
# 	return response.render('adduser')
# }


# app.post('/verify',verify)
# function verify(request, response){
# 	if( request.method == 'POST'){
# 		var jss =request.body
# 		var email = jss['email']
# 		var key = jss['key']

# 		if(key != 'abracadabra'){
# 			return response.json({ 'status': 'ERROR' })
# 		}
		
# 		MongoClient.connect(url,  { useNewUrlParser: true }, verifyUser)
# 		function verifyUser(err, db){
# 			if (err) throw err;
# 			var userTable = db.db("stack").collection("user")
# 		  	var myquery = { 'email': email }
# 		  	var newvalues = { $set: {'verified': "yes" } };
# 		  	userTable.updateOne(myquery, newvalues, updateStat)
# 		  	function updateStat(err, res){
# 		  		if (err) throw err;
# 		  	}
# 		  	db.close()
# 		}
		
# 		return response.json({ 'status': 'OK' })

# 	}
# }



# app.all('/login', login)
# function login(request, response){
# 	if( request.method == 'POST'){
# 		var username = request.body['username']
# 		var password = request.body['password']
		

# 		MongoClient.connect(url,  { useNewUrlParser: true }, validatePassword)
# 		function validatePassword(err, db){
# 			if (err) throw err;

# 			var userTable = db.db("stack").collection("user")
# 		  	var myquery = { 'username': username }
# 		  	var newvalues = { $set: {'verified': "yes" } };
# 		  	var ree = userTable.findOne(myquery, getQuery)
# 		  	function getQuery(err, res){
# 		  		if (err) throw err;
# 		  		if(res.password != password){
# 		  			return { 'status': 'ERROR' }
# 		  		}else{
# 		  			request.session['user'] = username
# 		  			return return { 'status': 'OK' }
# 		  		}
# 		  	}
# 		  	db.close()
# 		}
# 		return response.json(ree)
# 	}
# 	return response.render('login')
# }

# app.all('/logout', logout)
# function logout(request, response){
# 	if( request.method == 'POST'){
# 		request.session = null
# 		return response.json({ 'status': 'OK' })
# 	}
# }




# app.listen(8080, 'localhost');
# console.log('Server running at http://0.0.0.0:8080/')

# //response.sendFile(__dirname + '/templates/adduser.html')
# //<%= person %>      ejs template engine
