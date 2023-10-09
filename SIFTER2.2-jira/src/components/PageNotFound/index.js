import React from 'react';
import { compose } from 'recompose';
import pageNotFoundImg from '../../img/404.png';

import { withAuthorization, withEmailVerification } from '../Session';

const PageNotFound = () => (
	<div className="text--centered padding-v--60">
        <img src={pageNotFoundImg} className="img-404" alt="Error 404. Page not found." /> 
    </div>
);

//is authenticated?
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(PageNotFound);