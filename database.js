#!/usr/bin/env nodejs
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017';




MongoClient.connect(url,  { useNewUrlParser: true }).then(
function (db){			
	
	var idTable = db.db("stack").collection("pid")
	pass1 = 1
	idTable.updateOne({'pid':'pid'}, { $set: {'id': 1 } }, 
	function(err, res){
		console.log('ggod')
		db.close()
	})

})



MongoClient.connect(url,  { useNewUrlParser: true }).then(
	function (db){			
		
		var idTable = db.db("stack").collection("answer_id")
		pass1 = 1
		idTable.updateOne({'aid':'aid'}, { $set: {'id': 1 } }, 
		function(err, res){
			console.log('ggod')
			db.close()
		})
	
})