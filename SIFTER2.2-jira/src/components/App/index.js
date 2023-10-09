import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import PageNotFound from '../PageNotFound';

// import {AuthUserContext} from '../Session';

import '../../css/App.css';
import 'bootstrap/dist/css/bootstrap.css'

import Header from '../Header';
import Footer from '../Footer';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
// import {withFirebase} from '../Firebase';

const App = () => (
  <Router>
    <div>
      <Header />
      <div className="App">
        <Switch>
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  </Router>

);

export default withAuthentication(App);
