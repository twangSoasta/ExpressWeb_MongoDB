var fs = require('fs');
var config = JSON.parse(fs.readFileSync("../files/HostPort.json"));
var host = config.host;
var port = config.port;
var express = require('express');
var app = express();
var mongodbquery = require("./mongodbquery.js");
var collection = "student";

//app.use(app.router);
app.use(express.static(__dirname + "/files"));
app.get('/',function(req,res){
	res.send("hello");
	});

app.listen(port,host);
console.log("Listening on "+host+":"+port);

app.get("/hello/:text",function(req,res){
	res.send("Hello "+req.params.text);
});

var users = {
	"1" : {
		   "name":"tony wang",
		   "wechat":"tonyw1976"
		
	},
	"2" : {
		   "name":"Jianing Yang",
		   "wechat":"lichenlichen"
	}
};


app.get("/"+ collection +"/:id",function(req,res){
//	var user = users[req.params.id];
	
		   mongodbquery.queryUser(collection,req.params.id,function (users){   //users is array object
			   if (!users) {
	             res.status(404).send("no user found");
	           } else {
				 res.status(200).send("the 1st match record is: ",users[0]);
//	             users.forEach(function(value){          //forEach can pass 3 arguments, value, name and object itself
//			     res.status(200).send("Found a match: ",value);
	             };
               });
		   });
//		   res.send("<a href='http://www.weibo.com/" + user.wechat + "'>Follow "+ user.name + " on wechat</a>");





