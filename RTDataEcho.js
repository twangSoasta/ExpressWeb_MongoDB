var http = require('http');
var url = require('url');
var host = "127.0.0.1";
var port = 8080;
var mongo = require('mongodb');
var mport = 27017; //mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("NEWS", new mongo.Server(host,mport,{}));

var server = http.createServer(function(req,res){
	var pathName = url.parse(req.url).pathname; 
	var query = url.parse(req.url).query;
    if (query == undefined) {
		console.log("Get a null query!");
		res.writeHead("404",{"content-type":"text/plain"});
		res.write("Sorry can't find a query in the request!");
		res.end();
	} else {
	var string = decodeURIComponent(query.substring((query.indexOf("=") +1),query.length));
	console.log(pathName,"   ",string);
	switch (pathName){
		case "/NEWS/domestic" : 
			 queryString("domestic",string,function(result){
				 if (!result){
					 res.writeHead("404",{"content-type":"text/plain"});
					 res.write("Sorry domestic no match found");
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
			 
		 case "/NEWS/wechat" : 
		 queryString("wechat",string,function(result){
			 if (!result){
				 res.writeHead("404",{"content-type":"text/plain"});
				 res.write("Sorry wechat no match found");
				 res.end();
			 } else {
			 res.writeHead("200",{"content-type":"text/html"});
			 res.write('<head><meta charset="utf-8"/></head>');
			 result.forEach(function(one){
		//		 console.log(one.title);
				 res.write("<b>"+one.title +"</b><br>");
			 });
			 res.end();
			}
		 });
		 break;
			 
		 default:	
            res.writeHead("404",{"content-type":"text/plain"});
			res.write("URL does not match any DB collections"); 
            res.end();			
	}
  }
});

server.listen(port,host,function(){
	console.log("Listening on ",host,":",port);
});

function queryString(collectionName,string,callback){
db.open(function(error){
//	var regex = RegExp("/.*" + string + ".*/");   // ('^' + string)
//    var query = {'title':regex};
	var query = {'title': new RegExp(string)};    // once or more
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