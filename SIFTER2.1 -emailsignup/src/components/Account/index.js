import React from 'react';
import { compose } from 'recompose';
import SignOutButton from '../SignOut';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
	<AuthUserContext.Consumer>
    	{authUser => (
			<div className="wrapper max-w--90per section-account">
				<div className="section-account_info">
					<h2>Account Information:</h2>
					<p><strong>Name:</strong> {authUser.username}</p>
					<p><strong>Email:</strong> {authUser.email}</p>
					<p><strong>User ID:</strong> {authUser.uid}</p>
				</div>
				<div className="section-account_change">
					<h2>Change your password:</h2>
					<PasswordChangeForm />
				</div>
				<div className="section-account_signout">
					<h2>Sign out of your account:</h2>
					<SignOutButton />
				</div>
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