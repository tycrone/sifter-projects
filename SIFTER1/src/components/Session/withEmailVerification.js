import React from 'react';
 
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

//does user have verified email and email/pass assigned
const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {

  	constructor(props) {
      super(props);
 
      this.state = { isSent: false };
    }
  	
  	onSendEmailVerification = () => {
      this.props.firebase
      	.doSendEmailVerification()
      	.then(() => this.setState({ isSent:true }));
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => 
          	needsEmailVerification(authUser) ? (
              <div>
              	{this.state.isSent ? (
                    <p>
                      Email confirmation sent. Check your inbox (spam folder included) for your confirmation email.
                      <br /><br />
                      You can refresh this page once you have confirmed your email.
                    </p>
                ) : (
	                <p>
	                  Check your inbox for your verification email. Don't see anything? Check your spam folder. Still don't see anything? Request another confirmation email below.
	                </p>
 				)}
                <button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled = {this.state.isSent}
                >
                  Send confirmation E-Mail
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
 
  return withFirebase(WithEmailVerification);
};
 
export default withEmailVerification;