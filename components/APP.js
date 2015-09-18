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
			title: ''
		}
	},

	componentWillMount(){
		(process.env.NODE_ENV === 'development') ? this.socket = io('http://localhost:5000') : this.socket = io('https://fathomless-sea-2599.herokuapp.com');
		//this.socket = io('https://fathomless-sea-2599.herokuapp.com');
		this.socket.on('connect', this.connect);
		this.socket.on('disconnect', this.disconnect);
		this.socket.on('welcome', this.welcome);
	},

	connect(){
		this.setState({status: 'connected'});
	},

	disconnect(){
		this.setState({status: 'disconnected'});
	},

	welcome(serverState){
		this.setState({title: serverState.title});
	},

	render() {
		return (
			<div>
				<Header title={this.state.title} status={this.state.status} />
				<RouteHandler {...this.state}/>
			</div>
		);
	}
});

module.exports = APP;