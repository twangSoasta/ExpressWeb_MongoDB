var mongo = require('mongodb');
var test = require('assert');
var host = "127.0.0.1";
var port = 27017; //mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host,port,{})); //name and topology
console.log(db.databaseName);
db.open(function(error){
	console.log("we are connected! "+host+":"+port+" "+error);
//	db.addUser("user","user",['userAdminAnyDatabase','dbAdminAnyDatabase'],function(err,result){
//	//	test.equal(null,err);
//		console.log("user:user is added "+result);
//	});

// DB collection user 

	db.collection("user",function(error,collection){
//	db.createCollection("tonywang",function(error,collection){
		if (error) {
			console.log(error);
		} else {
		collection.insert({
			id: "1",
			name: "twang",
			account:"xwang",
			email:"xinchenw@hotmail.com"
		},function(err,res){
			console.log("Successfully inserted twang: "+err+"\n"+JSON.stringify(res));
		});
		
		collection.insert({
			id: "2",
			name: "byang",
			account:"bbyya",
			email:"byang@hotmail.com"
		},function(err,res){
			console.log("Successfully inserted byang: "+err+"\n"+JSON.stringify(res));
		});
		
	}});

//DB collection student	
		db.collection("student",function(error,collection){
//	db.createCollection("tonywang",function(error,collection){
		if (error) {
			console.log(error);
		} else {
		collection.insert({
			id: "1",
			name: "stwang",
			account:"sxwang",
			email:"sxinchenw@hotmail.com"
		},function(err,res){
			console.log("Successfully inserted stwang: "+err+"\n"+JSON.stringify(res));
		});
		
		collection.insert({
			id: "2",
			name: "sbyang",
			account:"sbbyya",
			email:"sbyang@hotmail.com"
		},function(err,res){
			console.log("Successfully inserted sbyang: "+err+"\n"+JSON.stringify(res));
		});
		
	}});
});

