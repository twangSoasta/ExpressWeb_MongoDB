//const API_KEY = 77553b5f0e58a630af9c385f8d68fc97;  juhe
// api.avatardata.cn/GuoNeiNews/Query?key=3f1eaab5a87946fdb07deb16bf0f9629&page=1&rows=10
//http://api.avatardata.cn/GuoNeiNews/Query?key=3f1eaab5a87946fdb07deb16bf0f9629&page=200&rows=1
const API_KEY = "3f1eaab5a87946fdb07deb16bf0f9629";
var page = 1;
var http = require('http');

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
	console.log("starting");
	var body ="";
	res.on("data",function(chunk){
	  body += chunk.toString("utf8");	
	});
	res.on("end",function(){
		var json = JSON.parse(body);
		var jsonSingle = json.result[0];
//		console.log(jsonSingle);
		var title = jsonSingle.title;
		var url = jsonSingle.url;
		var ctime = jsonSingle.ctime;
		console.log(page+ ". ",title," ",ctime);
		page ++;
	});
	
});
request.end();   //not res.end()
},1000);

