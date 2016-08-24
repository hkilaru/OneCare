import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router';
import { Button, PageHeader } from 'react-bootstrap';


export default class NavigateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "username": window.localStorage.username
  }

}

componentDidMount(){
  if(!window.localStorage.latitude) {
    navigator.geolocation.getCurrentPosition(function(location) {
      window.localStorage.latitude = location.coords.latitude;
      window.localStorage.longitude = location.coords.longitude;

      console.log("lat", location.coords.latitude);
      console.log("long", location.coords.longitude);
      console.log("accur", location.coords.accuracy);
    });
  }
}

  render() {
    return(
      <div className="navbar-container">
        <h1 className='title shadow'>OneCare</h1>
        <div className="top">
          {/* <img className='logo' src='https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/12316641_10105768042772978_923906279489141499_n.jpg?oh=bbb5b2be0e9bba21d5b33d879a199c4e&oe=58574F1F'></img> */}
        </div>
        <div onClick={() => {window.localStorage.removeItem("username"); window.localStorage.removeItem("token");}}>
          <div className='logout shadow-box'><Link to='/signin'><Button bsSize='large' bsStyle='danger' >Logout</Button></Link> </div>
        </div>
      </div>
    );
  }
}
