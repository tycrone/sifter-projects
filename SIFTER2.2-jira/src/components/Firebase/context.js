import React from 'react';

const FirebaseContext = React.createContext(null);

//higher-order component to give access to instance of firebase without having to unnecessarily supply full instance every time
export const withFirebase = Component => props => (
	<FirebaseContext.Consumer>
		{firebase => <Component {...props} firebase={firebase} />}
	</FirebaseContext.Consumer>
)

export default FirebaseContext;