#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://localhost:27017';
var url = 'mongodb://130.245.170.77:27017';


app.use(session({resave:true, secret:'iloveit', saveUninitialized:true}))
app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: false}) ) ; // must use this to parse form data
app.use(bodyParser.json() ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	return response.render('login', {person : "KevinLOII"})
}

global.ret = "NONE"
app.post('/adduser', adduser)
function adduser(request, response){
	
	MongoClient.connect(url,  { useNewUrlParser: true }).then(function (db){
		var jss = request.body
		var name = jss['username']
		var email = jss['email']
		var password = jss['password']
		test = 12	
		var userTable = db.db("stack").collection("user")
		var user = 	{ 	'username': name, 
						'email': email, 
						'password': password, 
						'verified': 'no' 
					}
	  	
	  	userTable.insertOne(user)
	  	console.log('adduser')
	  	db.close()
	  	return response.json({ 'status': 'OK' })
	}).catch(function(err){
		if (err) throw err
	})
}


app.post('/verify',verify)
function verify(request, response){
	
	MongoClient.connect(url,  { useNewUrlParser: true }).then(function (db){
		
		var email = request.body['email']
		var key=request.body['key']
		if(key == 'abracadabra'){
			var userTable = db.db("stack").collection("user")
	  		var myquery = { 'email': email }
	  		var newvalues = { $set: {'verified': "yes" } };
	  		userTable.updateOne(myquery, newvalues, function(err, res){
	  			if (err) throw err;
	  			console.log('verifyied Success')
	  		})
	  		return response.json({ 'status': 'OK' }) 
		}else{
			return response.json({ 'status': 'ERROR' })
		}

		
	  	db.close()
	})
		

	
}

app.post('/login', login)
function login(request, response){
			
		MongoClient.connect(url,  { useNewUrlParser: true }).then(function (db){		
			var username = request.body['username']
			var password = request.body['password']
			var ret = {'status': "OK"}
			var userTable = db.db("stack").collection("user")
			userTable.find({'username': username}).toArray(function(err, result){
				if(err) throw (err);
				query = result[0]
				console.log("QUERY is :" + query.verified)
				if(query['password'] == password && query['verified'] == 'yes'){
					request.session.user = username
					console.log("login :" + request.session.user)
					return response.json({ 'status': 'OK' }) 
				}else{
					return response.json({ 'status': 'ERROR' }) 
				}
			})			
		})
}

app.post('/logout', logout)
function logout(request, response){
	console.log("logout :" + request.session.user)
	request.session = null
	return response.json({ 'status': 'OK' })
	
}

app.post('/questions/add', addQuestions)
function addQuestions(request, response){

	MongoClient.connect(url,  { useNewUrlParser: true }).then(addQuestion)
	function addQuestion(db){
		if(!request.session['user']){
			return response.json({ 'status': 'not logged in' }) 
		}
		
		var questionTable = db.db("stack").collection("question")
		var idTable = db.db("stack").collection("pid")

		idTable.find({'pid':'pid'}).toArray(updateId)
		function updateId(err, result){

			pid = result[0]['id']
			idTable.updateOne({'pid':'pid'}, { $set: {'id': pid+1 } }, function(err, res){
	  			if (err) throw err;
	  			console.log('id update Success')
	  		})

			title = request.body['title']
			body = request.body['body']
			tags = request.body['tags']
			username = request.session['user']
			var question =	{	'username': username, 
								'title': title, 
								'tags': tags, 
								'view_count': 0,
								'time' : Date.now(),
								'pid' : pid
						 	}

		  	questionTable.insertOne(question)
		  	console.log('added qeustion: ' + title )
		  	return response.json({ 'status': 'OK', 'id': pid}) 
		}
	}

}

/*
user = {username, email, password, verified: 'no/yes' }	//all users in the database
question = { username,title, body, tags, view_count }   			//person who post the question
id = id


*/


app.listen(8080, 'localhost');
console.log('Server running at http://0.0.0.0:8080/')

//response.sendFile(__dirname + '/templates/adduser.html')
//<%= person %>      ejs template engine
