// This higher-order-component is in charge of storing the merged user in the local state and distributing it to other componenents with Reacts Context Provider Component

import React from 'react';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';


//HIGHER-ORDER COMPONENT will hold everything related to authentication. Keeps app.js a functional component and this higher-order component will make authenticated user available for all components below app. 
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        //grab it as json from browser storage
        authUser: JSON.parse(localStorage.getItem('authUser')),
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          //put in browser storage as json for better ux
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        }
      );
    }

    //remove listener if component unmounts to avoid memory leak issues
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;