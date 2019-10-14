import React, { useEffect } from 'react';
import { useAuth0 } from './Auth0Wrapper';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

function App(props) {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      if (props.history.location.search) {
        let parsedQueryString = queryString.parse(props.history.location.search);
        if (parsedQueryString.error) {
          logout();
          return;
        }
      }
      loginWithRedirect({});
      return;
    }
  }, [isAuthenticated, loading, loginWithRedirect, logout, props.history.location.search]);

  return (
    <div>
      
    </div>
  );
}

export default withRouter(App);
