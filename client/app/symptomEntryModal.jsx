import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import $ from 'jquery';
import DoctorView from './doctorView.jsx';
import BrainView from './brainView.jsx';
import DRXView from './DRXView.jsx';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

export default class SymptomEntryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
      index: 2,
      currentRec: null,
      isInRolodex: true,
      cloak: true,
      drxs: []
    };
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.drx = this.drx.bind(this);
    this.assignDrx = this.assignDrx.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recommendations.length !== 0) {
      console.log("de-cloaking", nextProps.recommendations[nextProps.recommendations.length-1].specialty);
      if(nextProps.recommendations[nextProps.recommendations.length-1].specialty) {
        this.setState({isInRolodex: true});
        this.setState({cloak: false});
      } else {
        this.setState({isInRolodex: false});
        this.setState({cloak: false});
      }
      // list is in reverse order
      this.setState({currentRec: nextProps.recommendations[nextProps.recommendations.length-1]});
    }
  }

  upvote() {
    var tmp = this.state.currentRec;
    tmp.id = 1000;
    this.setState({currentRec: tmp});
    this.setState({isInRolodex: false});
    //training AJAX goes here!
    $.ajax({
        type: "POST",
        url: "/api/brain/add",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({pair: [this.props.symptoms,[this.state.currentRec]]}),
        success: function(res) {
          console.log("The Brain thanks you for this knowledge.  ", res);
        },
        error: function(err) {
          console.error("You rekt da brain.  ", err);
        }
    });
  }

  downvote() {
    this.setState({index: this.state.index+1});
    this.setState({drxs: []});
    if (this.state.index < this.props.recommendations.length) {
      var rec = this.props.recommendations[this.props.recommendations.length - this.state.index];
      this.setState({currentRec: rec});
      if(rec.specialty) {
        this.setState({isInRolodex: true});
      } else {
        this.setState({isInRolodex: false});
      }
    } else {
      this.setState({currentRec: {id: 0, name: "We're sorry, but we have no more recommendations to give you!"}});
    }
  }

  // MAKES AJAX CALL TO BETTER DOCTORS API
  drx() {
    var api_key = '87b39c90783391ac6ce972736d117741';
    var query = (this.state.currentRec ? this.state.currentRec.name : '**empty**').split(' ').join('%20');
    if (query.charCodeAt(query.length-1) === 8206) {
      query = query.slice(0, query.length-1);
    }
    var latitude = window.localStorage.latitude;
    var longitude = window.localStorage.longitude;
    var location = latitude+'%2C'+longitude;
    var resource_url = 'https://api.betterdoctor.com/2016-03-01/doctors?query='+query+'&user_location='+location+'&skip=0&limit=3&user_key='+api_key;

    $.ajax({
      type: 'GET',
      url: resource_url,
      success: this.assignDrx,
      error: function(err) {
        console.log('not quite right');
      }
    });

    console.log('===============>', resource_url);
    console.log('+++++++++++++++>', query);
  }

  // UPDATES DRXS STATE FROM SUCCESSFUL AJAX CALL
  assignDrx(drxs) {
    this.setState({
      drxs: drxs.data
    });
    console.log('+++++++++++++++>', drxs);
  }

  render() {
    return(
      <div>
        <div className={this.state.cloak ? 'hidden' : '' +" recommend-modal-container"}>
          <div className='modal-button-close close-x' onClick={this.props.closeFn}><i className="fa fa-times-circle white" aria-hidden="true"></i></div>
          <div className="symptom-modal-header">
            <div> Symptoms</div>
          </div>
            <div className="modal-symptom-container">
            {
            this.props.symptoms.map((symptom) => {
              return (
                  <div key={symptom.id} className="modal-symptom-entry">
                    <i className="fa fa-arrow-right" aria-hidden="true"></i> <div className='symptom-name'>{symptom.name}</div>
                  </div>
                );
              })
            }
          </div>
          <div className='we-rec'>
            We recommend...
          </div>
            <div className={this.state.isInRolodex ? '' : 'hidden'}>
              <DoctorView
                name={this.state.currentRec ? this.state.currentRec.name : ''}
                phone={this.state.currentRec ? this.state.currentRec.phone : ''}
                email={this.state.currentRec ? this.state.currentRec.email : ''}
                address={this.state.currentRec ? this.state.currentRec.address : ''}
                specialty={this.state.currentRec ? this.state.currentRec.specialty : ''} />
              <div className={this.state.currentRec && this.state.currentRec.id === 1000 ? '' : 'hidden'}>We're glad to have been of assistance!</div>
                <div className="symptom-modal-voting">
                  <span className={(this.state.currentRec && this.state.currentRec.id !== 1000 ? '' : 'hidden')+' modal-button upvote'} onClick={this.upvote}><i className="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
                  <span className={(this.state.currentRec && this.state.currentRec.id !== 1000 ? '' : 'hidden')+' modal-button downvote'} onClick={this.downvote}><i className="fa fa-thumbs-o-down" aria-hidden="true"></i></span>
                </div>
            </div>
            <div className='doc-recommendation-container'>
              <div className={this.state.currentRec && !this.state.isInRolodex ? '' : 'hidden'}>
                <div className='doc-rec'>
                  <h2>{this.state.currentRec ? this.state.currentRec.name : '**empty**'}</h2>
                  <div className={this.state.currentRec && this.state.currentRec.id === 1000 ? '' : 'hidden'}>We're glad to have been of assistance!</div>
                </div>
                <div className={this.state.currentRec && this.state.currentRec.id !== 1000 ? 'post-rec-options' : 'hidden'}>
                  <div className='register-new-doc'> <Link to='/newdoctor'>Click here to register a new {this.state.currentRec ? this.state.currentRec.name : '**empty**'}!</Link> </div>
                  <div className={this.state.isInRolodex ? 'hidden' : 'find-doc-btn'}>
                    <Button onClick={this.drx} bsStyle='success' bsSize='small'>Find Nearby {this.state.currentRec ? this.state.currentRec.name : '**empty**'}s</Button>
                  </div>
                  <div className="symptom-modal-voting">
                    <span className={(this.state.currentRec && this.state.currentRec.id !== 1000 ? '' : 'hidden')+' modal-button upvote'} onClick={this.upvote}><i className="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
                    <span className={(this.state.currentRec && this.state.currentRec.id !== 1000 ? '' : 'hidden')+' modal-button downvote'} onClick={this.downvote}><i className="fa fa-thumbs-o-down" aria-hidden="true"></i></span>
                  </div>
                </div>
                {this.state.drxs.map((doctrx, i) => <DRXView specialty={this.state.currentRec.name} closeFn={this.props.closeFn} zipcode={this.props.zipcode} info={doctrx}/>)}
              </div>
            </div>
        </div>
      </div>
    );
  }
}
