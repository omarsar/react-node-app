var React = require('react');

var Join = React.createClass({
	
	join(){
		var memberName = React.findDOMNode(this.refs.name).value;
		this.props.emit('join',{name: memberName});
		//alert("env:"+pr);
	},

	render (){
		//html5 form
		return(
			<form action="javascript:void(0)" onSubmit={this.join}>
				<label>Full Name</label>
				<input 	ref="name" 
						className="form-control"
						placeholder="enter your full name..."
						required />
				<button className="btn btn-primary">Join</button>

			</form>
		);
	}
});

module.exports = Join;