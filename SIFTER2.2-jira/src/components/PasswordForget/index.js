import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
	<div class="wrapper max-w--90per">
		<h2>Reset your password</h2>
		<p>Enter the email address you registered with to receive a password reset link</p>
		<PasswordForgetForm/>
	</div>
);

const INITIAL_STATE = {
	email: '',
	error: null,
};

class PasswordForgetFormBase extends Component{
	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE};
	}

	onSubmit = event => {
		const { email } = this.state;
	 
	    this.props.firebase.doPasswordReset(email)
	    	.then(() => {
	       		this.setState({ ...INITIAL_STATE });
	    	})
	    	.catch(error => {
	       		this.setState({ error });
	    	});

		event.preventDefault();
	};
	 
	onChange = event => {
	    this.setState({ [event.target.name]: event.target.value });
	};
	 
	render() {
	    const { email, error } = this.state;
	 
	    const isInvalid = email === '';
	 
	    return (
	      <form onSubmit={this.onSubmit}>
	        <input
	          name="email"
	          value={this.state.email}
	          onChange={this.onChange}
	          type="text"
	          placeholder="Email Address"
	        />
	        <button disabled={isInvalid} type="submit">
	          Reset My Password
	        </button>
	 
	        {error && <p>{error.message}</p>}
	      </form>
		);
	}
}
 
const PasswordForgetLink = () => (
	<p className="text--small">
		<Link to={ROUTES.PASSWORD_FORGET}>I forgot my password</Link>
	</p>
);
 
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };