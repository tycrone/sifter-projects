import React from 'react';
import { Link } from 'react-router-dom';
import q4logo from '../../img/q4_white.svg';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import {AuthUserContext} from '../Session';

const Header = () => (
	<div className="header">
		<div className="wrapper">
			<div className="logo">
				<img src={q4logo} className="logo_image" alt="Q4 logo" />
				<h1 className="logo_text">SCHEDULER</h1>
			</div>
			<div className="header-navigation">
				<AuthUserContext.Consumer>
					{authUser => authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth/>}
				</AuthUserContext.Consumer>
			</div>
		</div>
	</div>
);

const NavigationAuth = ({ authUser }) =>(
	<ul>
		<li>
			<Link to={ROUTES.HOME}>Home</Link>
		</li>
		<li>
			<Link to={ROUTES.ACCOUNT}>Account</Link>
		</li>
		{!!authUser.roles[ROLES.ADMIN] && (
	      <li>
	        <Link to={ROUTES.ADMIN}>Admin</Link>
	      </li>
	    )}
		<li>
			<SignOutButton />
		</li>
	</ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_IN}>Home</Link>
    </li>
  </ul>
);

export default Header;

