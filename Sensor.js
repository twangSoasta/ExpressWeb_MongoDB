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
		var json = getSensorData(0);
		var json1 = getSensorData(1);
		var ul = "SENSOR "+ json.id + " NAME: "+json.name+ " DATA: "+
		         json.value + " TIMESTAMP: "+ json.timestamp;	
	    res.writeHead(200,header);
	    res.end(data);              //send initial header and data 
		
		setInterval(function(){
			json = getSensorData(0);
			json.valueArray.push(sensorDataArr[0].value);
		    ul = "SENSOR "+ json.id + " NAME: "+json.name+ " DATA: "+
		    json.value + " TIMESTAMP: "+ json.timestamp;
            io.emit('news', json);
//			console.log("sent1");
		
		},4500);
			
		setInterval(function(){
			json1 = getSensorData(1);
			json1.valueArray.push(sensorDataArr[1].value);
		    ul = "SENSOR "+ json1.id + " NAME: "+json1.name+ " DATA: "+
		    json1.value + " TIMESTAMP: "+ json1.timestamp;
            io.emit('news1', json1);
//			console.log("sent2");
		
		},3000);
		
		});
}

server.listen(port,function(){
	console.log("starting listening on port:",port);
});

io.on("connection",function(socket){
	console.log("sockets connected!");
	socket.on("newsback",function(a){
		console.log("Got message back from JS: ",a);
	});
	
	socket.on("newsback1",function(a){
		console.log("Got message back from JS: ",a);
	});
});

var sensorData1 = {
	"id" : 1,
	"name" : "sensor_name1",
	"value" : 34,
	"valueArray" : [],
	"timestamp" : "2016-02-12T18:34:00Z"
};

var sensorData2 = {
	"id" : 2,
	"name" : "sensor_name2",
	"value" : 35,
	"valueArray" : [],
	"timestamp" : "2016-02-12T18:34:00Z"
};

var sensorDataArr = [];
sensorDataArr[0] = sensorData1;
sensorDataArr[1] = sensorData2;

function getSensorData(index){

	var date = new Date();
    var month = date.getMonth()<10 ? "0"+(date.getMonth()+1):date.getMonth()+1;
    var day = date.getDate()<10 ? "0"+date.getDate():date.getDate();
    var timestamp = date.getFullYear()+"-"+ month +"-"+day+"  "+date.getHours()
                +":"+date.getMinutes()+":"+date.getSeconds();
	sensorDataArr[index].value = Math.floor(Math.random()*100);	
	sensorDataArr[index].timestamp = timestamp;
	return sensorDataArr[index];	
}



