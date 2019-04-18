import React from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:7000/';

axios.interceptors.request.use(
  function(options) {
    options.headers.authorization = localStorage.getItem('jwt');
    return options; 
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default function(Component) {
  return class Authenticate extends React.Component {
    render() {
      const token = localStorage.getItem('jwt');

      const notLoggedIn = <div>Please login to see the users</div>;
      return <> {token ? <Component {...this.props} /> : notLoggedIn} </>;
    }
  };
}