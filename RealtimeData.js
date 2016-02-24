//const API_KEY = 77553b5f0e58a630af9c385f8d68fc97;  juhe
// api.avatardata.cn/GuoNeiNews/Query?key=3f1eaab5a87946fdb07deb16bf0f9629&page=1&rows=10
//http://api.avatardata.cn/GuoNeiNews/Query?key=3f1eaab5a87946fdb07deb16bf0f9629&page=200&rows=1
//0dcc418b470f48e0beb818f62bdfcbee(wechat api)
const API_KEY1 = "3f1eaab5a87946fdb07deb16bf0f9629";
const API_KEY2 = "0dcc418b470f48e0beb818f62bdfcbee";
var page = 1;
var http = require('http');
var mongo = require('mongodb');
var host = "127.0.0.1";
var port = 27017; //mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("NEWS", new mongo.Server(host,port,{})); //name and topology
var guonei = true;
var wechat = true;


//guonei source
if (guonei === true) {
setInterval(function(){
var options = {
	host : "api.avatardata.cn",
	path : "/GuoNeiNews/Query?key=3f1eaab5a87946fdb07deb16bf0f9629&page=" + page.toString() + "&rows=1",
	headers : {
		"User-Agent":"Chrome/46.0.2490.80"
	},
	method : "GET"
};	

var request = http.request(options,function(res){
	var body ="";
	res.on("data",function(chunk){
	  body += chunk.toString("utf8");	
	});
	res.on("end",function(){
		var json = JSON.parse(body);
		var jsonSingle = json.result[0];
		var title = jsonSingle.title;
		var url = jsonSingle.url;
		var ctime = jsonSingle.ctime;
		console.log("国内 - "+page+ ". ",title," ",ctime);
		var jsonToWrite = {
			"souce":"国内",
			"title":title,
			"timestamp":ctime,
			"url":url
		};
//		console.log(jsonToWrite);
        writeToMongoDB("domestic",jsonToWrite,function(err,res){
			console.log("domestic write done: "+err); //+"\n"+JSON.stringify(res));			
		});
		page ++;
	});
	
});
request.end();   //not res.end()
},500);
}

//wechat source
if (wechat === true) {
var keyword = "王思聪";
var pageNew = 1;
setInterval(function(){
var options = {
	host : "api.avatardata.cn",
	path : "/WxNews/Query?key=0dcc418b470f48e0beb818f62bdfcbee&page=" + pageNew.toString() + "&rows=1&keyword="+encodeURIComponent(keyword),
	headers : {
		"User-Agent":"Chrome/46.0.2490.80"
	},
	method : "GET"
};	

var request = http.request(options,function(res){
	var body ="";
	res.on("data",function(chunk){
	  body += chunk.toString("utf8");	
	});
	res.on("end",function(){
		var json = JSON.parse(body);
		var jsonSingle = json.result[0];
		var title = jsonSingle.title;
		var url = jsonSingle.url;
		var hottime = jsonSingle.hottime;
		console.log("微信 - "+pageNew+ ". ",title," ",hottime);
		var jsonToWrite = {
			"souce":"微信",
			"title":title,
			"timestamp":hottime,
			"url":url
		};
//		console.log(jsonToWrite);
        writeToMongoDB("wechat",jsonToWrite,function(err,res){
			console.log("wechat write done: "+err); // +"\n"+JSON.stringify(res));			
		});        
		pageNew ++;
	});
	
});
request.end();   //not res.end()
},500);
}



function writeToMongoDB(collectionName,json,callback){
 db.open(function(error){
// 	console.log("open db returns: "+error);
 	db.collection(collectionName,function(error,collection){
 		if (error) {
 	//		console.log("open collection returns: "+error);
 		} else {
 		collection.insert(json,function(err,res){
 		//	console.log("Successfully inserted twang: "+err+"\n"+JSON.stringify(res));
		   callback(err,res);
 		});
 		}
 	});
 });
}
