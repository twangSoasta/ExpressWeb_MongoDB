var http = require('http');
var server = http.createServer(handler);
var app = require('express')(); // initialize app to be a function handler to be supplied to an http server
var io = require('socket.io')(server); //server has to be defined 1st, pass an http server instance to be bind with IO
var fs = require('fs');
var port = 8080; 

//var serverapp = http.Server(app);  //server by express can also passed into socketio

var header = {
	"Content-Type":"text/html",
	"Access-Control-Allow-Origin":"http://127.0.0.1:8080",
	"Access-Control-Allow-Credentials": "true"
}
//create http server instance
//reads an html file and display the content on the web page upon any incoming connection
function handler(req,res){
	fs.readFile("./index_sensor.html",function(err,data){
		console.log(err);		
		var json = getSensorData();
		var ul = "SENSOR "+ json.id + " NAME: "+json.name+ " DATA: "+
		         json.value + " TIMESTAMP: "+ json.timestamp;
	//	data = data.toString("utf8").replace("猴年吉祥如意",ul); 
    //    io.emit("news",json);			
	    res.writeHead(200,header);
	    res.end(data);
		setInterval(function(){
			json = getSensorData();
		    ul = "SENSOR "+ json.id + " NAME: "+json.name+ " DATA: "+
		    json.value + " TIMESTAMP: "+ json.timestamp;
	//	    data = data.toString("utf8").replace("猴年吉祥如意",ul); 
            io.emit('news', json);
			console.log("sent");
		
		},5000);
		
		setInterval(function(){
			json = getSensorData();
		    ul = "SENSOR "+ json.id + " NAME: "+json.name+ " DATA: "+
		    json.value + " TIMESTAMP: "+ json.timestamp;
	//	    data = data.toString("utf8").replace("猴年吉祥如意",ul); 
            io.emit('news1', json);
			console.log("sent");
		
		},3000);
		
		});
}

server.listen(port,function(){
	console.log("starting listening on port:",port);
});



var sensorData = {
	"id" : 1,
	"name" : "sensor_name1",
	"value" : 34,
	"valueArray" : [],
	"timestamp" : "2016-02-12T18:34:00Z"
};

function getSensorData(){

	var date = new Date();
    var month = date.getMonth()<10 ? "0"+(date.getMonth()+1):date.getMonth()+1;
    var day = date.getDate()<10 ? "0"+date.getDate():date.getDate();
    var timestamp = date.getFullYear()+"-"+ month +"-"+day+"  "+date.getHours()
                +":"+date.getMinutes()+":"+date.getSeconds();
	sensorData.value ++;
	sensorData.valueArray.push(sensorData.value);
	sensorData.timestamp = timestamp;
	return sensorData;
	
}
