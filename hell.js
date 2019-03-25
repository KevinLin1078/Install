#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017';
//var url = 'mongodb://130.245.170.77:27017';


app.use(session({resave:true, secret:'iloveit', saveUninitialized:true}))
app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: false}) ) ; // must use this to parse form data
app.use(bodyParser.json() ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	return response.redirect('/login')
}


global.ret = "NONE"
app.all('/adduser', adduser)
function adduser(request, response){
	if(request.method == 'POST'){
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
			return response.json({ 'status': 'OK' })
		}).catch(function(err){
			//if (err) throw err
			return response.json({ 'status': 'error', 'err':err })
		})
	}

	if(request.method == 'GET'){
		return response.render('adduser' )
	}

}


app.all('/verify',verify)
function verify(request, response){
	if(request.method == 'POST'){
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
					return response.json({ 'status': 'OK' }) 
				})
			}else{
				return response.json({ 'status':'error'}) 
			}

		})
	}

	if(request.method == 'GET'){
		return response.render('verify')
	}
}

app.all('/login', login)
function login(request, response){
		
		if(request.method == 'POST'){
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
						return response.json({ 'status':'error'}) 
					}
				})			
			})
		}
		if(request.method == 'GET'){
			return response.render('login', {person : "Kevin Lin"})
		}
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
								'pid' : pid// id of question
						 	}

		  	questionTable.insertOne(question)
		  	console.log('added qeustion: ' + title )
		  	return response.json({ 'status': 'OK', 'id': pid}) 
		}
	}

}

app.get('/questions/:pid', getQuestion) //pid = id of Question
function getQuestion(request, response){
	MongoClient.connect(url,  { useNewUrlParser: true }).then(updateViewCount)
	function updateViewCount(db){
		var questionTable = db.db("stack").collection("question")
		var pid = parseInt(request.params.pid)
		var userTable = db.db("stack").collection("user")

		questionTable.findOne({'pid':pid}, getCount)
		function getCount(err, result){
			
			count = result['view_count']
			console.log('before count is :  '+ count)
			questionTable.updateOne({'pid': pid}, { $set: {'view_count': count + 1}},
				function(err, res){
					console.log('update is ' + res)

					questionTable.findOne({'pid': pid},
						function(err, result){
							var username =  result['username']
							var body = result['body']
							var timestamp =  result['time']
							var tags = result['tags']
							var view_count = result['view_count']
							console.log('after count is :  '+ result['view_count'])
							userTable.findOne({'username': username}, 
								function(err, result){
									var userID = result['_id'].toString()
									data = 	{	'status': 'OK',
										'question' :{	
														'id':pid.toString(),
														'user': { 	
																	'id': userID,	// IMplement
																	'username': username,
																	'reputation' : 0,
																},
													},
										'body': body,
										'score': -1000000,
										'view_count' : view_count,
										'answer_count': -100000000,
										'timestamp': timestamp,
										'media': [],
										'tags': tags,
										'accepted_answer_id': -1000000000
									}
									console.log('done')
									return response.json(data) 					
								})
						})
					
				})				
		}
	}
}


app.post('/questions/:pid/answers/add', addAnswer)
function addAnswer(request, response){
	MongoClient.connect(url,  { useNewUrlParser: true }).then(addAnswer2)
	function addAnswer2(db){
		var answerTable = db.db("stack").collection("answer")
		
		var pid = parseInt(request.params.pid)
		var body = request.body['body']
		var media = request.body['media']
		var aidTable = db.db("stack").collection("answer_id")
	
		aidTable.findOne({"aid": "aid"}, 
		function(err, result){
			//if(result == null){return response.json({"status":"doesnt exist"})}
			var aid = result['id']
			
			aidTable.updateOne({'aid':'aid'}, { $set: {'id': aid+1 } }, 
			function(err, res){
				
				answer ={	'pid' : pid,
							'body': body,
							'media': media,
							'aid': aid,
							'user': request.session['user'],
							'timestamp': Date.now(),
							'accepted': true
						}
				
				answerTable.insertOne(answer, 
				function(err, res){
					
					return response.json({"status":"OK", "id": aid})
				})



			})
		})

	}
}

app.get('/questions/:pid/answers', getAnswer)
function getAnswer(request, response){
	//return response.json({"statis": "evil"})
	MongoClient.connect(url,  { useNewUrlParser: true }).then(getAnswer2)
	function getAnswer2(db){
		
		var pid = parseInt(request.params.pid)
		//return response.json({"statis": "evil"})
		var answerTable = db.db("stack").collection("answer")
		
		answerTable.find({"pid": pid}).toArray(
		function(err, result){
			var retAnswer = []
			for(var i = 0; i < result.length; i++){
				var item =	{	'id': result[i]['aid'].toString(),
								'user': result[i]['user'],
								'body': result[i]['body'],
								'score': -100000,
								'accepted': true,
								'timestamp': result[i]['timestamp'],
								'media': result[i]['media']
							}
				retAnswer.push(item)
			}

			return response.json({'answers': retAnswer})
		})


	}


}



app.post('/search', search)
function search(request, response){
	MongoClient.connect(url,  { useNewUrlParser: true }).then(getAnswer2)
	function getAnswer2(db){
		var questionTable = db.db("stack").collection("question")

		var timestamp = request.body['timestamp']
		var limit = request.body['limit']
		var accepted = request.body['accepted']

		questionTable.find({}).toArray(
		function(err, result){
			var filterResult =[]
			for(var i = 0; i < result.length; i++){
				if(result[i]['timestamp'] <= timestamp){
					filterResult.push(result[i])
				}
			}
		})

	}
}



app.listen(8080, 'localhost');
console.log('Server running at http://0.0.0.0:8080/')

/*
user = {username, email, password, verified: 'no/yes' }	//all users in the database
question = { username,title, body, tags, view_count, time }   			//person who post the question
id = id


response.sendFile(__dirname + '/templates/adduser.html')
<%= person %>      ejs template engine
pp
*/
