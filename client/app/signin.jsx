import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Signup from './signup.jsx';
import {Button, ButtonToolbar, Form, FormGroup, Col, FormControl, ControlLabel, Checkbox, Row, Grid} from 'react-bootstrap';


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
        window.localStorage.setItem("first_last", data.user.first_last);
        window.localStorage.setItem("userID", data.user.id);
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
        <Grid>
          <Row>
            <div className='one-care-header'> OneCare </div> <br/>
          </Row>
          <Row>
            <Form>
              <div className='signin-cat'> <span className='signin-username white' >Username</span>&nbsp;&nbsp;<input type="text" onChange={(event) => {this.setState({username: event.target.value})}}></input></div><br />
              <div className='signin-cat2'> <span className='signin-password white' >Password</span>&nbsp;&nbsp;<input type="password" onChange={(event) => {this.setState({password: event.target.value})}}></input></div><br />
              <div className='login'>
                <Button bsStyle='success' onClick={ this.submitLogin}>Login</Button>
              </div>
              <div className='signup'>
              <Link to='/signup'> Signup </Link>
              </div>
            </Form>
          </Row>
        </Grid>
      </div>
    );
  }
}
