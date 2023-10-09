import React from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
	<AuthUserContext.Consumer>
    	{authUser => (
			<div>
        		<h1>Account: {authUser.email}</h1>
				<p></p>
				<p><strong>Name:</strong> {authUser.username}</p>
				<p><strong>User ID:</strong> {authUser.uid}</p>
		    	<PasswordChangeForm />
		  	</div>
   		)}
  	</AuthUserContext.Consumer>
);

//is authenticated?
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);