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
      email: "",
      invalidPhone: false,
      invalidEmail: false
    };
    this.submitUser = this.submitUser.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  submitUser(e) {

    if(!this.state.invalidPhone && !this.state.invalidEmail) {
      alert("Please input a valid phone number and email");
    }
    else if (!this.state.invalidPhone) {
      alert("Please input a valid phone number")
    }
    else if (!this.state.invalidEmail) {
      alert("Please input a valid email")
    }
    else {
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
            alert("Sorry! That username already exists");
            console.log('error in signup :', err);
          }
      });
    }
  }

  validatePhone(phone) {
    this.setState({
      invalidPhone: phone.match(/\d/g).length===10
    })
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("test", re.test(email));
    console.log("state", this.state.invalidEmail)
    this.setState({
      invalidEmail: re.test(email)
    })
  }

  render() {
    return (
      <div className= "signup-container">
        <h1> Sign-up </h1>
        <form>
          <div className='signup-cat'>username</div><input type="text" onChange={(event) => {this.setState({username: event.target.value})}}/><br/>
          <div className='signup-cat'>password</div><input type="password" onChange={(event) => {this.setState({password: event.target.value})}}/><br />
          <div className='signup-cat'>address</div><input type="text" onChange={(event) => {this.setState({address: event.target.value})}}/><br/>
          <div className='signup-cat'>zip code</div><input type="text" onChange={(event) => {this.setState({zipCode: event.target.value})}}/><br/>
          <div className='signup-cat'>phone</div><input type="text" onChange={(event) => {this.setState({phone: event.target.value})
        this.validatePhone(this.state.phone)}}/> <h6 className={(this.state.invalidPhone ? 'hidden' : 'invalid')}> Phone number must be 11 digits</h6>
          <div className='signup-cat'>email</div><input type="text" onChange={(event) => {this.setState({email: event.target.value})
          this.validateEmail(this.state.email)}}/><h6 className={(this.state.invalidEmail ? 'hidden' : 'invalid')}> Enter a valid email</h6>
          <button className='signup-cat' onClick={ this.submitUser }>Submit</button>
        </form>
        <Link to="/signin">Return to Sign-in </Link>
      </div>
    );
  }
}
