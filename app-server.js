var express = require('express'); //call express library
var app = express(); //express intance

var connections = [];
var title = 'Untitled Presentation'; // passing this from the server...
//in reality data from the server is passed from here

//middleware
app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'))

//var server = app.listen(3000); //port
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);


//To display what is happening on the server side
io.sockets.on('connection', function(socket){

	socket.once('disconnect', function(){
		connections.splice(connections.indexOf(socket),1);
		socket.disconnect();
		console.log("disconnected: %s socket remaining", connections.length);
	});

	//emit even to user when they come in: the data passed is title
	socket.emit('welcome',{
		title: title
	});

	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);
});

console.log("Polling server is running at 'http://localhost:5000'");