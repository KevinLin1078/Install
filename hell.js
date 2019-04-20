#!/usr/bin/env nodejs
//var http = require('http');
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://130.245.170.57:27017';
var mail = require('nodemailer')


app.use(session({resave:true, secret:'iloveit', saveUninitialized:true}))
app.use(express.static(path.join(__dirname, '/views'))) //tells Nodejs that template is static
app.set('view engine', 'ejs') // will lok for 'views' folder
app.use(bodyParser.urlencoded( {extended: false}) ) ; // must use this to parse form data
app.use(bodyParser.json() ) ; // must use this to parse form data


app.all('/', index)
function index(request, response){
	if(request.method == 'GET'){
		return response.render('login' )
	}
}


app.all('/adduser', adduser)
function adduser(request, response){
	if(request.method == 'POST'){
		MongoClient.connect(url,  { useNewUrlParser: true }).then(function (db){
			var jss = request.body
			var name = jss['username']
			var email = jss['email']
			var password = jss['password']
			var key = 'keykey1212'
			var userTable = db.db("stack").collection("user")
			var user = 	{ 	'username': name, 
							'email': email, 
							'password': password, 
							'verified': 'no'
						}
			
			userTable.insertOne(user, function(err, res){
				sendMail(email, key)
			})
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
			if(key == 'abracadabra' || key =='keykey1212'){
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
	request.session.destroy()
	return response.json({ 'status': 'OK' })
	
}

app.post('/questions/add', addQuestions)
async function addQuestions(request, response){
	console.log("add question")
	MongoClient.connect(url,  { useNewUrlParser: true }).then( async function addQuestion(db){
		console.log(url)
		if(!request.session.user){
			return response.json({'status':'error', 'error': 'Please login to add question'})
		}
		questionTable = await db.db("stack").collection("question")
		if( !('title' in request.body) ){
			return response.json({'status':'error', 'error': 'Title cannot be empty'})
		}

		title = request.body['title']
		body = request.body['body']
		tags = request.body['tags']

		username = request.session.user
		question =	{
					'user': 		{	'username': username,
										'reputation': 1
									},
					'title': title, 
					'body': body,
					'score': 0,
					'view_count': 0,
					'answer_count': 0,
					'timestamp':Date.now(),
					'media': null,
					'tags': tags,
					'accepted_answer_id': null,
					'username': username
		}
		await questionTable.insertOne(question, function(err, res){
			pid = question._id
			return response.json({'status':'OK', 'id': pid})
		})
		
	})
}

app.get('/questions/:pid', getQuestion) //pid = id of Question
function getQuestion(request, response){
	MongoClient.connect(url,  { useNewUrlParser: true }).then(async  function (db){
		
		questionTable = db.db("stack").collection("question")
		pid = request.params.pid
		result = await questionTable.findOne({"_id": pid})
		if(result == null){
			ip = request.connection.remoteAddress
			return response.json({'status': 'error', 'error': 'Question does not exist', "ip": ip })
		}
		

		
	})
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

function sendMail(email, key){
    
    var transporter = mail.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
            user: 'ktube110329@gmail.com',
            pass: '@12345678kn'
        }
    });
    var mailOpton = {
        from: 'ktube110329@gmail.com',
        to: email,
        subject: "Verification Key",
        text: 'validation key:<' + key +">"
    };

    var info = transporter.sendMail(mailOpton)    
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
