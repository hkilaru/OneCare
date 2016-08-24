import React, {Component} from 'react';
import $ from 'jquery';
import { Router, Route, Link, browserHistory } from 'react-router';
import {Button, ResponsiveEmbed, Grid, Row, Col, Image} from 'react-bootstrap';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="family" style={{width: 'auto', height: 'auto'}}>
          <ResponsiveEmbed a16by9>
            <embed type="image/jpeg" src="../styles/family.jpg" />
          </ResponsiveEmbed>
        </div>

        <div className= "splashHeader">
          <div className= "splashName">
            <h1> OneCare </h1>
          </div>

          <div className= "signInSplash">
            <div className='login shadow-box'><Link to='/signin'><Button bsSize='large' block bsStyle='primary' >Login</Button></Link> </div>
          </div>
          <div className= "signUpSplash">
            <div className='logout'><Link to='/signup'><Button bsSize='large' block bsStyle='primary' >Signup</Button></Link> </div>
          </div>
        </div>


        <div className= "appDescribe">
          <Grid>
            <Row>
              <Col xs={6} md={6}>
                <div className="circle">
                  <div className="circleText">
                    <h3> Prescription Reminder </h3>
                    <h3> _____________________ </h3>
                    <h4> Input your prescriptions </h4>
                    <h4> Refill Text Reminders </h4>
                    <h4> We'll send you text reminders to take your medications </h4>
                    <h4> Add prescriptions to your own customized Roladex </h4>
                    <h4> Edit your prescriptions </h4>
                  </div>
                </div>
              </Col>
              <Col xs={6} md={6}>
                <div className="circle">
                  <div className="circleText">
                    <h3>Doctor Recommender</h3>
                    <h3> _____________________ </h3>
                    <h4> Input your symptoms </h4>
                    <h4> We'll recommend a specialist for you! </h4>
                    <h4> Search for nearby specialists </h4>
                    <h4> Add Doctors to your own customized Roladex </h4>
                    <h4> Edit your doctors </h4>
                    <h4> Recieve doctor's notes on your Roladex </h4>
                  </div>
                </div>
              </Col>

            </Row>
          </Grid>
        </div>

        <div className="team">
          <Grid>
            <Row>
              <h1> Our Team: </h1>
            </Row>
            <Row>
              <Col xs={6} md={3}>
                <Image src="../styles/harish.jpg" circle responsive />
                <h2> Harish Kilaru </h2>
              </Col>
              <Col xs={6} md={3}>
                <Image src="../styles/kenton.png" circle responsive />
                <h2> Kenton Lin </h2>
              </Col>
              <Col xs={6} md={3}>
                <Image src="../styles/ian.jpg" circle responsive />
                <h2> Ian Culleton </h2>
              </Col>
              <Col xs={6} md={3}>
                <Image src="../styles/dan.jpg" circle responsive />
                <h2> Dan Zhao </h2>
              </Col>
            </Row>
          </Grid>
        </div>

        <div className="copyright">
          OneCare Inc.&copy; 2016
        </div>
      </div>
    );
  }
}
