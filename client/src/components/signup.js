import React, { Component } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      departments: ""
    };
  }

  editInputHandler = e => {
    console.log(e);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmitInput = e => {
    e.preventDefault();
    const users = {
      username: this.state.username,
      password: this.state.password,
      departments: this.state.departments
    };
    axios
      .post("http://localhost:8000/api/register", users)
      .then(response => {
        this.state.users(response.data);
        console.log(response);
        this.setState({
          username: "",
          password: "",
          departments: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1>signup</h1>
        <form>
          <input
            type="text"
            name="username"
            onChange={this.editInputHandler}
            value={this.state.username}
            placeholder="add username"
          />
          <input
            type="text"
            name="password"
            onChange={this.editInputHandler}
            value={this.state.password}
            placeholder="add password"
          />
          <input
            type="text"
            name="departments"
            onChange={this.editInputHandler}
            value={this.state.departments}
            placeholder="add departments"
          />
          <br />
          <button onClick={this.handleSubmitInput}>Add User </button>
        </form>
      </div>
    );
  }
}

export default SignUp;
