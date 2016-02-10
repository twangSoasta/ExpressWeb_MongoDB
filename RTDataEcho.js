var http = require('http');
var url = require('url');
var host = "127.0.0.1";
var port = 8080;
var mongo = require('mongodb');
var mport = 27017; //mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("NEWS", new mongo.Server(host,mport,{}));

var server = http.createServer(function(req,res){
	var pathName = req.url;
	console.log(pathName);
	var string = "";
	switch (pathName){
		case "/NEWS/domestic" : 
		     string ="中";
			 queryString("domestic",string,function(result){
				 if (!result){
					 console.log("404 this case");
					 res.writeHead("404",{"content-type":"text/plain"});
					 res.write("Sorry no match found");
					 res.end();
				 } else {
				 res.writeHead("200",{"content-type":"text/html"});
				 res.write('<head><meta charset="utf-8"/></head>');
				 result.forEach(function(one){
					 console.log(one.title);
					 res.write("<b>"+one.title +"</b><br>");
				 });
				 res.end();
				}
			 });
			 break;
			 
		 default:	
            res.writeHead("404",{"content-type":"text/plain"});
			res.write("Sorry no match found"); 		 		 
	}

});

server.listen(port,host,function(){
	console.log("Listening on ",host,":",port);
});

function queryString(collectionName,string,callback){
db.open(function(error){
//	var regex = RegExp("/.*" + string + ".*/");   // ('^' + string)
//    var query = {'title':regex};
	var query = {'title': new RegExp('^' + string)};
	console.log(query);
	db.collection(collectionName.toString(),function(error,collection){
		if (error) {
			console.log(error);
		} else {
		collection.find(query,function(error,cursor){
			if (error) {
				console.log(error);
			} else {
		       cursor.toArray(function(err,res){       //
				   if (res.length == 0) {
					   callback(false);
				   } else {					   
				       console.log("found a match, showing the 1st one: ",res[0]); 
					   callback(res);
					   }					   
				   });
			   };
			});

	}});
});
}