import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Signup from './signup.jsx';


export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.submitLogin = this.submitLogin.bind(this);
  }

  componentDidMount() {
    window.localStorage.currentPage = 'signin';
  }


  submitLogin(e) {
    e.preventDefault();
    var user = {
      "username": this.state.username,
      "password": this.state.password
    };

    $.ajax({
      type: "POST",
      url: "/api/signin",
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(user),
      success: function(data){
        window.localStorage.setItem("username", data.user.username);
        window.localStorage.setItem("token", data.token);
        window.location = '/profile';
      },
      error: function(err){
        console.log('user not found in database error in ajax', err);
      }
    });
  }


  render() {
    return (
      <div className="signin-container">
        <h1>Sign in to OneCare</h1>
        <form>
          <span className='signin-cat'>username</span><input type="text" onChange={(event) => {this.setState({username: event.target.value})}}></input><br />
          <span className='signin-cat'>password</span><input type="password" onChange={(event) => {this.setState({password: event.target.value})}}></input><br />
          <div className='signup'>
            <Link to='/signup'> Signup </Link>
          </div>
          <button onClick={ this.submitLogin}>Submit</button>
        </form>
      </div>
    );
  }
}
