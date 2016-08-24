import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery';
import {Button, ButtonToolbar, Form, FormGroup, Col, FormControl, ControlLabel, Checkbox, Row, Grid} from 'react-bootstrap';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName:"",
      lastName: "",
      username: "",
      password: "",
      address: "",
      phone: "",
      zipcode: 10001,
      email: "",
      //form validation
      firstnameIsValid: false,
      lastnameIsValid: false,
      usernameIsValid: false,
      passwordIsValid: false,
      phoneIsValid: false,
      emailIsValid: false,
      zipcodeIsValid: false,
      formIsValid: true
    };
    this.submitUser = this.submitUser.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleZipcode = this.handleZipcode.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  submitUser(e) {

    if(!this.state.phoneIsValid || !this.state.emailIsValid || !this.state.zipcodeIsValid || !this.state.firstnameIsValid || !this.state.lastnameIsValid || !this.state.usernameIsValid || !this.state.passwordIsValid) {
      this.setState({formIsValid: false});
    }
    else {
      window.localStorage.removeItem("currentPage");
      e.preventDefault();
      var newUser = {
        firstName: this.state.firstName,  //length 2
        lastName: this.state.lastName,  //length 2
        username: this.state.username,  //length 4
        password: this.state.password,  //length 4
        address: this.state.address,
        phone: this.state.phone,  //
        zipcode: this.state.zipcode,  //exactly 5 digits
        email: this.state.email  //
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
            console.log('user signup successful! This is the data returned: ', data.user.zipcode);
            window.localStorage.setItem("username", data.user.username);
            window.localStorage.setItem("token", data.token);
            window.location = "/profile";
          },
          error: function(err){
            alert("Sorry! We were unable to sign you up. Please complete the empty fields. If all fields are complete, please select a different username");
            console.log('error in signup :', err);
          }
      });
    }
  }

  handleFirstName(e) {
    this.setState({firstName: e.target.value});
    if (e.target.value.length >= 2) {
      this.setState({firstnameIsValid: true});
    } else {
      this.setState({firstnameIsValid: false});
    }
  }

  handleLastName(e) {
    this.setState({lastName: e.target.value});
    if (e.target.value.length >= 2) {
      this.setState({lastnameIsValid: true});
    } else {
      this.setState({lastnameIsValid: false});
    }
  }

  handleUsername(e) {
    this.setState({username: e.target.value});
    if (e.target.value.length >= 4) {
      this.setState({usernameIsValid: true});
    } else {
      this.setState({usernameIsValid: false});
    }
  }

  handlePassword(e) {
    this.setState({password: e.target.value});
    if (e.target.value.length >= 4) {
      this.setState({passwordIsValid: true});
    } else {
      this.setState({passwordIsValid: false});
    }

  }

  handleAddress(e) {
    this.setState({address: e.target.value});
  }

  handleZipcode(e) {
    this.setState({zipcode: e.target.value});
    if (e.target.value.match(/\d/g).length===5) {
      this.setState({zipcodeIsValid: true});
    } else {
      this.setState({zipcodeIsValid: false});
    }

  }

  handlePhone(e) {
    this.setState({phone: e.target.value});
        if (e.target.value.match(/\d/g).length===10) {
      this.setState({phoneIsValid: true});
    } else {
      this.setState({phoneIsValid: false});
    }
  }

  handleEmail(e) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setState({email: e.target.value});
    if (re.test(e.target.value)) {
      this.setState({emailIsValid: true});
    } else {
      this.setState({emailIsValid: false});
    }
  }

  render() {
    return (
      <div className= "signup-container">
        <Grid>
          <Row>
            <Form>
              <Row>
                <Col mdOffset={4} md={3}>
                <Row>
                  <h1 className="signup-h1"> Sign-up </h1>
                </Row>
                <Row>
                  <br/>
                </Row>
                  <FormGroup className="left-align" >
                    <ControlLabel>First Name</ControlLabel><FormControl type="text"  onChange={this.handleFirstName}></FormControl></FormGroup>
                    <h6 className={(this.state.firstnameIsValid ? 'hidden' : 'invalid')}> Name must be at least two letters. </h6>
                  <FormGroup className="left-align">
                    <ControlLabel>Last Name</ControlLabel><FormControl type="text" onChange={this.handleLastName}></FormControl></FormGroup>
                    <h6 className={(this.state.lastnameIsValid ? 'hidden' : 'invalid')}> Name must be at least two letters. </h6>
                  <FormGroup className="left-align">
                    <ControlLabel>Username</ControlLabel><FormControl type="text"  onChange={this.handleUsername}></FormControl></FormGroup>
                    <h6 className={(this.state.usernameIsValid ? 'hidden' : 'invalid')}> Username must be at least four letters. </h6>
                  <FormGroup className="left-align" >
                    <ControlLabel>Password</ControlLabel><FormControl type="password" onChange={this.handlePassword}></FormControl></FormGroup>
                    <h6 className={(this.state.passwordIsValid ? 'hidden' : 'invalid')}> Password must be at least four letters. </h6>
                  <FormGroup className="left-align" >
                    <ControlLabel>Address</ControlLabel><FormControl type="text"  onChange={this.handleAddress}></FormControl></FormGroup>
                  <FormGroup className="left-align" >
                    <ControlLabel>Zipcode</ControlLabel><FormControl type="text" onChange={this.handleZipcode}></FormControl>
                    <h6 className={(this.state.zipcodeIsValid ? 'hidden' : 'invalid')}> Please enter a valid zipcode </h6>
                  </FormGroup>
                  <FormGroup  className="left-align" >
                    <ControlLabel>Phone</ControlLabel><FormControl type="text"  onChange={this.handlePhone}></FormControl></FormGroup>
                    <h6 className={(this.state.phoneIsValid ? 'hidden' : 'invalid')}> Phone number must be 11 digits</h6>
                  <FormGroup className="left-align" >
                    <ControlLabel>Email</ControlLabel><FormControl type="text" onChange={this.handleEmail}></FormControl></FormGroup>
                    <h6 className={(this.state.emailIsValid ? 'hidden' : 'invalid')}> Please enter a valid email </h6>
                  <Row>
                    <Button className='signup-cat' bsStyle='success' onClick={ this.submitUser }>Submit</Button>
                  </Row>
                  <Col>
                    <Link to="/signin"> Return to Sign-in </Link>
                  </Col>
                </Col>
              </Row>
            </Form>
          </Row>
        </Grid>
      </div>
    );
  }
}
