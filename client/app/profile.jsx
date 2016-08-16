import React, {Component} from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import ScriptRemind from './scriptRemind.jsx';
import DoctorEntryView from './doctorEntryView.jsx';
import SymptomEntry from './symptomEntry.jsx';
import SymptomEntryModal from './symptomEntryModal.jsx';
import Map from './map.jsx';
import _ from 'lodash';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      scripts: [],
      inputZip: null,
      scriptmodalIsOpen: false,
      docmodalIsOpen: false,
      mapmodalIsOpen: false,
      symptomModalIsOpen: false,
      brainModalIsOpen: false,
      modalStyles: {
        overlay : {
          position          : 'fixed',
          top               : 0,
          left              : 0,
          right             : 0,
          bottom            : 0,
          backgroundColor   : '#333333'
        },
        content : {
          position                   : 'absolute',
          top                        : '10%',
          left                       : '10%',
          right                      : '30%',
          bottom                     : '30%',
          border                     : '4px solid #ccc',
          background                 : '#333333',
          color                      :  'white',
          overflow                   : 'auto',
          WebkitOverflowScrolling    : 'touch',
          borderRadius               : '4px',
          outline                    : 'none',
          padding                    : '20px'

        }
      },
    };
    this.openModalScript = this.openModalScript.bind(this);
    this.closeModalScript = this.closeModalScript.bind(this);
    this.openModalDoctor = this.openModalDoctor.bind(this);
    this.closeModalDoctor = this.closeModalDoctor.bind(this);
    this.getScripts = this.getScripts.bind(this);
    this.deleteScript= this.deleteScript.bind(this);
    this.getDocs = this.getDocs.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
    this.openModalMap = this.openModalMap.bind(this);
    this.closeModalMap = this.closeModalMap.bind(this);
    this.openModalSymptom = this.openModalSymptom.bind(this);
    this.closeModalSymptom = this.closeModalSymptom.bind(this);
    this.openModalBrain = this.openModalBrain.bind(this);
    this.closeModalBrain = this.closeModalBrain.bind(this);
    // this.getZip = this.getZip.bind(this);
  }

  deleteDoc(idx){
    console.log("index", idx);
    var id = this.state.doctors[idx]._id;

    $.ajax({
     type: "POST",
     url: "/api/doctor/delete",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({ "docID": id }),
     success: this.getDocs(),
     error: this.getDocs()
   });

  }

  deleteScript(index) {
    console.log("deleteReminder called!!");
    var id = this.state.scripts[index]._id;
    console.log("reminderID", id);
    $.ajax({
     type: "POST",
     url: "/api/reminder/delete",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({ "reminderID": id }),
     success: this.getScripts(),
     error: this.getScripts()
   });
  }

  openModalScript() {
    console.log("open modal script called");
    this.setState({
      scriptmodalIsOpen: true
    });
  }

  openModalDoctor() {
    this.setState({
      docmodalIsOpen: true
    });
  }

  openModalMap() {
    this.setState({
      mapmodalIsOpen: true
    });
  }

  openModalSymptom() {
    this.setState({
      symptomModalIsOpen: true
    });
  }

  openModalBrain() {
    this.setState({
      brainModalIsOpen: true
    });
  }

 closeModalScript() {
   this.setState({
     scriptmodalIsOpen: false
   }, this.getScripts)
 }

  closeModalDoctor() {
    this.setState({
      docmodalIsOpen: false
    }, this.getDocs)
  }

  closeModalMap() {
    this.setState({
      mapmodalIsOpen: false
    });
  }

  closeModalSymptom() {
    this.setState({
      symptomModalIsOpen: false
    });
  }

  closeModalBrain() {
    this.setState({
      brainModalIsOpen: false
    });
  }

  getScripts() {
    console.log("get scripts has been called!");
    $.ajax({
     type: "POST",
     url: "/api/script/find",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({username: window.localStorage.username}),
     success: function(data) {
       console.log("data!!!!", data);
       var sorted  = _.sortBy(data, 'refill'); //sorts scripts by refill date
       this.setState({scripts: sorted});
     }.bind(this),
     error: function(err) {
       console.log('error in ajax request for user scripts', err);
     }
   });

  }

  getDocs() {
    $.ajax({
      type: 'POST',
      url: '/api/doctors/get',
      headers: {
        "content-type": "application/json"
      },
      data: JSON.stringify({"username": window.localStorage.username}),
      success: function(docs) {
        console.log("DOCTORS", docs);
        this.setState({
          doctors: docs
        });
      }.bind(this),
      error: function(err) {
        console.log('I can\'t pill you...not today', err);
      }
    });
  }

  // getZip() {
  //   $.ajax({
  //     type: 'POST',
  //     url: '/api/user/zip',
  //     headers: {
  //       "content-type": "application/json"
  //     },
  //     data: JSON.stringify({"username": window.localStorage.username}),
  //     success: function(zipcode) {
  //       console.log("USER zipcode", zipcode);
  //       this.setState({
  //         zipcode: zipcode
  //       });
  //     }.bind(this),
  //     error: function(err) {
  //       console.log('Could not retrieve user zipcode', err);
  //     }
  //   });
  // }


  componentDidMount() {
    console.log("component has mounted!!!");
    this.getScripts();
    this.getDocs();
    // this.getZip();
  }

  render() {
    return (
      <div className='profile-container'>
        <Navigate />
        <Modal show={this.state.scriptmodalIsOpen}>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalScript}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <ScriptRemind
              closeFn={this.closeModalScript} />
        </Modal>

        <Modal show={this.state.docmodalIsOpen} bsSize='small'>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalDoctor}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <DoctorEntryView
            closeFn={this.closeModalDoctor} />
        </Modal>

        <Modal show={this.state.mapmodalIsOpen} style={this.state.modalStyles}>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalMap}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <Map
          zipcode = {this.state.inputZip}
          />
        </Modal>

        <Modal show={this.state.symptomModalIsOpen} style={this.state.modalStyles}>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalSymptom}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <SymptomEntry closeFn={this.closeModalSymptom} />
        </Modal>

        <Modal show={this.state.brainModalIsOpen} bsSize='small'>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalBrain}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <SymptomEntryModal
            brainState
            symptoms
            recommendations
            closeFn={this.closeModalDoctor} />
        </Modal>

      <div className="scripts-doctors">
      <div className='scripts-container'>
      <div className='scripts-title'> Prescriptions </div>
        <div className='scripts-header'>
            <div>
              <input className='zipcode-input' placeholder='Zipcode' type="text" onChange={(event) => {this.setState({inputZip: event.target.value})}}/>
              <Button bsStyle='success' onClick={this.openModalMap}> <div> <i className="fa fa-search" aria-hidden="true"></i> Pharmacy </div> </Button>
            </div>
            <Button bsClass='btn midnight-blue' onClick={this.openModalScript}> <div> <i className="fa fa-plus-circle" aria-hidden="true"></i> Prescription </div> </Button>
        </div>
             {
              this.state.scripts.map((script, idx) => {
                return (
                  <div className="scripts-view-container" key={idx}>
                  <div className="script-top-bar"><div><p className="script-name"> {script.name}</p>{/* <a target="_blank" href={"https://simple.wikipedia.org/wiki/" + script.name}>(get more info)</a>*/}</div><i className="fa fa-times" aria-hidden="true" onClick={this.deleteScript.bind(this, idx)}></i></div>
                  <div className='script-attribute'> <i className="fa fa-heart red" aria-hidden="true"></i> Dosage: {script.dosage} </div>
                  <div className='script-attribute'> <i className="fa fa-bell gold" aria-hidden="true"></i> Reminder: {script.frequency} </div>
                  <div className='script-attribute'> <i className="fa fa-calendar royal-blue" aria-hidden="true"></i> Refill: {String(new Date(script.refill)).split('').slice(0, 15).join('')} </div>
                 </div>
               );
              }, this)
            }
          </div>
        <div className='doctors-container'>
        <div className='doctors-title'> Doctors </div>
        <div className='doctors-header'>
          <Button bsStyle="success" bsSize='small' onClick={this.openModalSymptom}> <div> <i className="fa fa-stethoscope" aria-hidden="true"></i> Recommend </div></Button>
          <Button bsClass='btn midnight-blue' onClick={this.openModalDoctor}> <div> <i className="fa fa-plus-circle" aria-hidden="true"></i> Doctor </div> </Button>
        </div>
              {
                this.state.doctors.map((doctor, idx) => {
                  return (
                    <div className=" doctor-view-container" key={idx }>
                    <div className="doctor-top-bar"><p className='doctor-name'>{doctor.name}</p><i className="fa fa-times" aria-hidden="true" onClick={this.deleteDoc.bind(this, idx)}></i></div>
                    <div className='doctor-attribute'><i className="fa fa-phone phone-green" aria-hidden="true"></i>  {doctor.phone}</div>
                    <div className='doctor-attribute'><i className="fa fa-envelope" aria-hidden="true"></i>  {doctor.email}</div>
                    <div className='doctor-attribute'><i className="fa fa-map-marker red" aria-hidden="true"></i>  {doctor.address}</div>
                    <div className='doctor-attribute'><i className="fa fa-stethoscope" aria-hidden="true"></i>  {doctor.specialty}</div>
                    </div>
                  );
                }, this)
              }
      </div>
      </div>
      </div>
    );
  }

}
