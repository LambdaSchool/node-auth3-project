import React, { Component } from 'react';
import axios from 'axios';

class SignIn extends React.Component {
  
constructor(){
	super();
	
	this.state= {
		username:"",
		password:"",
	};

}        
        
changeHandler = event =>{
	this.setState({[event.target.name]: event.target.value});
};        
        
        
submitHandler =event =>{
	
	event.preventDefault();
	const {username, password} = this.state;
	const user = {username, password};

	axios.post('http://localhost:4003/login', user)
	
	.then(res =>{

	const token = res.data;
	localStorage.setItem('jwt', token);
	})

	.catch(err =>{
	console.log("error: couldn't login");
	
	});

};

        
   render() {
    return (
      <div>
     	<form onSubmit={this.submitHandler}>
	<input type="text" onChange={this.changeHandler} name="username" value={this.state.username}/><br />
	<input type="password" onChange={this.changeHandler} name="password" value={this.state.password}/><br />
	<button type="submit">Submit</button>
	</form>        
     </div>
    );
  }

}

export default SignIn;
