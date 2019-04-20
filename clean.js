#!/usr/bin/env nodejs
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://130.245.170.57:27017';



MongoClient.connect(url,  { useNewUrlParser: true }).then(async function (db){			
	userTable = db.db("stack").collection("user")
	answerTable = db.db("stack").collection("answer")
	questionTable = db.db("stack").collection("question")
	ipTable  = db.db("stack").collection("ip")

	
	// await userTable.insertOne({'kevin':12})
	// await answerTable.insertOne({'anna': 12})
	// await questionTable.insertOne({'annie': 12})
	// await ipTable.insertOne({'anna': 12})
	// await userTable.deleteMany({})
	// await answerTable.deleteMany({})
	// await questionTable.deleteMany({})
	// await ipTable.deleteMany({})
	
	// console.log("Cleared")
	// db.close()
	query = 'logging branches '.trim()
	timestamp = Date.now()
	limit = 25

	search_query = {}
	search_query['$or'] = []

	query_title = {}
	query_title['$or'] = []

	query_body = {}
	query_body['$or'] =[]
	query = query.toLowerCase()
	query = query.split(" ")

	query.forEach(function(each){
		term = {}
		term['$or'] = []
		term['$or'].push({'title':{$regex: ' ' + each}})
		term['$or'].push({'title':{$regex: each + ' '}})
		query_title['$or'].push(term)

		term = {}
		term['$or'] = []
		term['$or'].push({'body':{$regex: ' ' + each}})
		term['$or'].push({'body':{$regex: each + ' '}})
		query_body['$or'].push(term)
	})
	search_query['$or'].push(query_title)
	search_query['$or'].push(query_body)

	results = await questionTable.find(search_query)
	
	count = 0;
	results.forEach(function(item){
		console.log(count)
		count+=1
	})
	

	
})



// function kk(){
// 	var ObjectID = require('mongodb').ObjectID;
// 	MongoClient.connect(url,  { useNewUrlParser: true }).then(async function (db){			
// 		userTable = db.db("stack").collection("user")
// 		insertObj = {'username':'anna'}
		
// 		await userTable.insertOne(insertObj)
// 		getID = await userTable.findOne(insertObj)

// 		console.log(getID._id)
		
// 		findID = await userTable.findOne({'_id': getID._id})
// 		console.log(findID)
// 	})

// }