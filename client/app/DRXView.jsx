import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class DRXView extends React.Component {
  constructor(props) {
    super(props);
    // this.yalp = this.yalp.bind(this);
    this.state = {
      starsArray: []
    }

    this.findDrx = this.findDrx.bind(this);
    this.createStars = this.createStars.bind(this);

  };

  createStars(){
    var stars = [];
    for(var i = 0; i < this.props.info.ratings[0].rating; i++){
      stars.push("star");
    }
    this.setState({
      starsArray: stars
    })
  }

  componentDidMount(){
    this.createStars();
  }

  // no longer needed :(
  // yalp() {
  //   $.ajax({
  //     type: 'POST',
  //     url: '/api/yelp',
  //     headers: {
  //       "content-type": "application/json"
  //     },
  //     data: JSON.stringify({ name: this.props.info.profile.first_name+' '+this.props.info.profile.last_name, zip: this.props.zipcode }),
  //     success: function(searchTerm) {
  //       console.log(searchTerm);
  //     }.bind(this),
  //     error: function(err) {
  //       console.error('no yelp', err);
  //     }
  //   });
  // }

  findDrx() {
    var npiUrl = 'https://api.betterdoctor.com/2016-03-01/doctors/npi/'+this.props.info.npi+'?user_key=87b39c90783391ac6ce972736d117741';
    console.log(npiUrl);
    console.log('PROPS:', this.props);
    $.ajax({
      type: 'GET',
      url: npiUrl,
      success: function(npiData) {
        console.log('name:', npiData.data.practices[0].name);
        console.log('phone:', npiData.data.practices[0].phones[0].number);
        console.log('addy:'+'\n', npiData.data.practices[0].visit_address.street+'\n',
                    npiData.data.practices[0].visit_address.city+'\n',
                    npiData.data.practices[0].visit_address.state+'\n',
                    npiData.data.practices[0].visit_address.zip);
        console.log('spec:', npiData.data.specialties[0].actor);

        var toSubmit = {
          "username": window.localStorage.username,
          "first_last": window.localStorage.first_last,
          "userID": window.localStorage.userID,
          "doc": {
            name: npiData.data.practices[0].name,
            phone: '1'+npiData.data.practices[0].phones[0].number,
            email: 'N/A',
            address: npiData.data.practices[0].visit_address.street+' '+npiData.data.practices[0].visit_address.city+', '+npiData.data.practices[0].visit_address.state,
            specialty: npiData.data.specialties[0].actor
          }
        };

        $.ajax({
          type: 'POST',
          url: '/api/doctor/add',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(toSubmit),
          success: this.props.closeFn(),
          error: function(err) {
            console.log('inner error', err);
          }
        });
      }.bind(this),
      error: function(err) {
        console.log('outer error', err);
      }
    });
  }

  render() {
    return (
      <div className="card-wrap">
        <div className='profile-pic-description'>
          <div className="profile-pic-container">
            <img className= 'profile-pic' src={this.props.info.profile.image_url} alt=""></img>
          </div>
          <div className="info-container">
            <h3 className="user-name">{this.props.info.profile.first_name+' '+this.props.info.profile.last_name}</h3>
            <p>{this.props.info.profile.bio}</p>
          </div>
        </div>
        <div className='rating-save'>
          <div className='rating gold-star'>
            {/* <p>{this.props.info.ratings[0] ? this.props.info.ratings[0].rating+' stars' : 'No rating found'}</p> */}
              {this.state.starsArray.map((star, idx) => {
                return (
                  <div key={idx}>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                )
              })}
          </div>
          <div>
            <Button onClick={this.findDrx} bsStyle='primary' bsSize='xsmall'>Save to My Doctors</Button>
          </div>
        </div>
      </div>
    );
  }
}
