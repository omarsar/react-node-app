var React = require('react');
var Display =  require('./parts/Display');
var Join = require('./parts/Join');

var Audience = React.createClass({
	render() {
		var fullAudience = this.props.audience;
		var status = this.props.status;
		return (
			<div>
				<Display if={this.props.status === 'connected'}>
					<Display if={this.props.member.name}>
						<h2>Welcome {this.props.member.name}</h2>
						<p>{this.props.audience.length} audience members connected:</p>
						<ul className="list-group">
							{ fullAudience.map(function(result){
								return <li className="list-group-item" key={result.id}>									
											<span className="badge">{status}</span>
											{result.name}											
										</li> ;
								})
							}
						</ul>
						<br></br>
						<p>Question go here</p>
					</Display>
					<Display if={!this.props.member.name}>
						<h1>Joined the session</h1>
						<Join emit={this.props.emit}/>
					</Display>
					
				</Display>
			</div>
		);
	}
});

module.exports = Audience;