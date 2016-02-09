var mongo = require('mongodb');
var test = require('assert');
var host = "127.0.0.1";
var port = 27017; //mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host,port,{}));
console.log(db.databaseName);
function queryUser(collectionName,id,callback){
db.open(function(error){
	console.log("we are connected! "+host+":"+port+" "+error);

	db.collection(collectionName.toString(),function(error,collection){
		if (error) {
			console.log(error);
		} else {
		console.log("we have the collections");
		collection.find({},function(err,cursor){       //cusor is circular buffer
			console.log("found "+cursor.toArray.length+" records");
		});
		collection.find({"id":id.toString()},function(error,cursor){
			if (error) {
				console.log(error);
			} else {
		       cursor.toArray(function(err,users){       //users is array of objects
				   if (users.length == 0) {
					   callback(false);
				   } else {					   
				       console.log("found a match, showing the 1st one: ",users[0]); 
					   callback(users);
					   }					   
				   });
			   };
			});

	}});
});
}

exports.queryUser = queryUser;
/*
queryUser("user","2",function(users){
	if (!users) {
	  console.log("no user found");
	} else {
	  users.forEach(function(value){          //forEach can pass 3 arguments, value, name and object itself
						  console.log("Found a match: ",value);
	});
}
});
*/