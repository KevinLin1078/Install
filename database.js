#!/usr/bin/env nodejs

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://130.245.170.77:27017';


console.log("ef")


MongoClient.connect(url,  { useNewUrlParser: true }, insert)


function insert(err, db){
	var dbo = db.db("mm");
	var myobj = { name: "Anniec", address: "Anna 37" };
  	dbo.collection("movie").insertOne(myobj)
}

console.log('successSSS')