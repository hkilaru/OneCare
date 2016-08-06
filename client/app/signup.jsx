import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      address: "",
      phone: "",
      zipcode: "",
      email: ""
    };
    this.submitUser = this.submitUser.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  submitUser(e) {
    window.localStorage.removeItem("currentPage");
    e.preventDefault();
    var newUser = {

      username: this.state.username,
      password: this.state.password,
      address: this.state.address,
      phone: this.state.phone,
      zipcode: this.state.zipcode,
      email: this.state.email
    };

    $.ajax({
      type: 'POST',
      url: '/api/signup',
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(newUser),
        success: function(data){
          console.log('user signup successful! This is the data returned: ', data);
          window.localStorage.setItem("username", data.user.username);
          window.localStorage.setItem("token", data.token);
          window.location = "/profile";
        },
        error: function(err){
          console.log('error in signup :', err);
        }
    });
  }

  validatePhone(phone) {
    return phone.match(/\d/g).length===11;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    return (
      <div className= "signup-container">
        <h1> Signup </h1>
        <form>
          <span>username</span><input type="text" onChange={(event) => {this.setState({username: event.target.value})}}/><br/>
          <span>password</span><input type="password" onChange={(event) => {this.setState({password: event.target.value})}}/><br />
          <span>address</span><input type="text" onChange={(event) => {this.setState({address: event.target.value})}}/><br/>
          <span>zip code</span><input type="text" onChange={(event) => {this.setState({zipCode: event.target.value})}}/><br/>
          <span>phone</span><input type="text" validation={this.validatePhone} onChange={(event) => {this.setState({phone: event.target.value})}}/><br/>
          <span>email</span><input type="text" validation={this.validateEmail} onChange={(event) => {this.setState({email: event.target.value})}}/><br/>
          <button onClick={ this.submitUser }>Submit</button>
        </form>
        <Link to="/signin">Signin </Link>
      </div>
    );
  }
}
