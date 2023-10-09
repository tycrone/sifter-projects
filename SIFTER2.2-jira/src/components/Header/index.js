import React from 'react';
import { NavLink } from 'react-router-dom';
import q4Logo from '../../img/q4_white.svg';
import asanaLogo from '../../img/asana.PNG';

import * as ROUTES from '../../constants/routes';

import {AuthUserContext} from '../Session';

const Header = () => (
	<div className="header">
		<div className="wrapper max-w--90per">
			<div className="header-logo">
				<img src={q4Logo} className="header-logo_image" alt="Q4 logo" />
				<span className="header-logo_text">Scheduler</span>
			</div>
			<div className="header-navigation">
				<AuthUserContext.Consumer>
					{authUser => authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth/>}
				</AuthUserContext.Consumer>
			</div>
			<div className="header-title">
				<h1>Organic Development Team</h1>
			</div>
		</div>
	</div>
);

const NavigationAuth = ({ authUser }) =>(
	<ul>
		<li>
			<NavLink exact activeClassName="active" to={ROUTES.HOME}>Timeline</NavLink>
		</li>
		<li>
			<NavLink exact activeClassName="active" to={ROUTES.ACCOUNT}>Account</NavLink>
		</li>
		<li>
			<a title="Visit Asana (link opens in new window)" className="asana-link" rel="noopener noreferrer" target="_blank" href="https://app.asana.com/0/1199222491229814/list"><img src={asanaLogo} alt="Asana logo" /> </a>
		</li>
	</ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <NavLink exact activeClassName="active" to={ROUTES.SIGN_IN}>Home</NavLink>
    </li>
  </ul>
);

export default Header;

