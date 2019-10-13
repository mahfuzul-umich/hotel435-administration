import React from 'react';
import { GoogleLogin } from 'react-google-login';

function App() {
  const response = user => {
    console.log(user)
  }

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        render={() => <div></div>}
        onSuccess={response}
        onFailure={response}
        cookiePolicy={'single_host_origin'}
        autoLoad
      />
    </div>
  );
}

export default App;
