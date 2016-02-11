var http = require('http');
var server = http.createServer(handler);
var io = require('socket.io')(server);
var fs = require('fs');

server.listen(8080,function(){
	console.log("Starting listening on port:"+8080);
});

function handler (req, res) {
  fs.readFile('./Index_SocketIo.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
 //   console.log(data.toString());
  getNews(function(jsonToWrite){
	 var ul = jsonToWrite.title;
	 data = data.toString("utf8").replace("猴年吉祥如意",ul);  
     io.sockets.emit("news",jsonToWrite);  	 
  });
  
  res.writeHead(200,{"Content-Type":"text/html"});
    res.end(data);
  });
}

/*
io.on('connection', function (socket) {
  socket.emit('news', { hellojs: 'worldjs' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/


function getNews(callback){
	console.log("getNews get called");
	var keyword = "西安";
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
		var json = JSON.parse(body); //console.log(json);
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
		console.log(jsonToWrite);
        callback(jsonToWrite);
  //      writeToMongoDB("wechat",jsonToWrite,function(err,res){
  //			console.log("wechat write done: "+err); //+"\n"+JSON.stringify(res));			
  //		});        
		pageNew ++;
	});
	
});
request.end();   //not res.end()
},100);
}