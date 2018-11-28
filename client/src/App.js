import React, { Component } from "react";
import "./App.css";
import { Route, NavLink } from "react-router-dom";
import Users from "./components/Users";

const Home = props => {
  return (
    <div>
      <h1>Home Component</h1>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <nav>
            <NavLink exact to="/">
              Home
            </NavLink>
            &nbsp; | &nbsp;
            <NavLink to="/users">Users</NavLink>
          </nav>
          <main>
            <Route exact path="/" component={Home} />
            <Route path="/users" component={Users} />
          </main>
        </header>
      </div>
    );
  }
}

export default App;
