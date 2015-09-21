var React =  require('react'); //require the library
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var io = require('socket.io-client');
var Header =  require('./parts/Header');

//this is the first react component
var APP = React.createClass({

	//handling the state of the components passed from the server
	getInitialState(){
		return {
			status: 'disconnected',
			title: '',
			member: {}, //user of this socket
			audience: [],
			speaker: ''
		}
	},

	//listener for events send from the app-server
	componentWillMount(){
		//TODO: need to fix automatic environment settings
		//(process.env.NODE_ENV === 'production') ? this.socket = io('https://fathomless-sea-2599.herokuapp.com') : this.socket = io('http://localhost:5000');
		//this.socket = io('http://localhost:5000');
		this.socket = io('https://fathomless-sea-2599.herokuapp.com');
		this.socket.on('connect', this.connect);
		this.socket.on('disconnect', this.disconnect);
		this.socket.on('welcome', this.updateState);
		this.socket.on('joined',this.joined);
		this.socket.on('audience',this.updateAudience);
		this.socket.on('start', this.start);
		this.socket.on('end', this.updateState);
	},

	emit(eventName, payload){
		this.socket.emit(eventName, payload);
	},

	connect(){
		var member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;
		
		if (member && member.type ==='audience'){
			this.emit('join',member);
		} else if(member && member.type === 'speaker'){
			this.emit('start', {name: member.name, title: sessionStorage.title});
			
		}

		this.setState({status: 'connected'});

	},

	disconnect(){
		this.setState({
			status: 'disconnected',
			title: 'disconnected',
			speaker: ''
		});
	},

	updateState(serverState){
		this.setState(serverState);
	},

	joined(member){
		//session storage
		sessionStorage.member = JSON.stringify(member);
		this.setState({member: member});
	},

	updateAudience(newAudience){
		this.setState({audience: newAudience});
	},

	start(presentation){
		if (this.state.member.type === 'speaker'){
			sessionStorage.title = presentation.title;
		}
		this.setState(presentation);
	},

	render() {
		return (
			<div>
				<Header {...this.state} />
				<RouteHandler emit={this.emit} {...this.state}/>
			</div>
		);
	}
});



module.exports = APP;