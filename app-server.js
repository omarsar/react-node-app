var express = require('express'); //call express library
var _ = require('underscore');
var app = express(); //express intance

var connections = [];
var title = 'Untitled Presentation'; // passing this from the server...
var audience = [];
var speaker = {}; //an object to hold informtion about speaker


//in reality data from the server is passed from here

//middleware
app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'))

//var server = app.listen(3000); //port
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);


//To display what is happening on the server side
//all the scokets
io.sockets.on('connection', function(socket){

	socket.once('disconnect', function(){

		var member = _.findWhere(audience, {id: this.id});
		if (member){
			audience.splice(audience.indexOf(member), 1);
			io.sockets.emit('audience', audience);
			console.log("left: %s (%s audience memners", member.name, audience.length);
		}

		connections.splice(connections.indexOf(socket),1);
		socket.disconnect();
		console.log("disconnected: %s socket remaining", connections.length);
	});

	socket.on('join', function(payload){
		var newMember = {
			id: this.id,
			name: payload.name,
			type: 'member'
		};
		this.emit('joined', newMember); //send back to APP component
		audience.push(newMember);
		io.sockets.emit('audience',audience);//pass this to all sockets
		console.log("Audience Joined: %s", payload.name);
	});

	//handle events for speaker
	socket.on('start', function(payload){
		speaker.name = payload.name;
		speaker.id = this.id; //socket id
		speaker.type = 'speaker';
		title = payload.title;
		this.emit('joined', speaker);
		io.sockets.emit('start', {title: title, speaker: speaker.name})
		console.log("presenaton started: '%s' by %s", title, speaker.name);

	});


	//emit even to user when they come in: the data passed is title
	socket.emit('welcome',{
		title: title,
		audience: audience,
		speaker: speaker.name
	});

	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);
});

console.log("Polling server is running at 'http://localhost:5000'");