import React, {Component} from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import ScriptRemind from './scriptRemind.jsx';
import Modal from 'react-modal';
import DoctorEntryView from './doctorEntryView.jsx';
import Map from './map.jsx';
import _ from 'lodash';

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
      modalStyles: {
        overlay : {
          position          : 'fixed',
          top               : 0,
          left              : 0,
          right             : 0,
          bottom            : 0,
          backgroundColor   : 'rgba(255, 255, 255, 0.75)'
        },
        content : {
          position                   : 'absolute',
          top                        : '10%',
          left                       : '10%',
          right                      : '30%',
          bottom                     : '30%',
          border                     : '4px solid #ccc',
          background                 : '#fff',
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
    console.log("component has mounteD!!!");
    this.getScripts();
    this.getDocs();
    // this.getZip();
  }

  render() {
    return (
      <div className='profile-container'>
        <Navigate />
        <h1> My Profile </h1>
        <button onClick={this.openModalScript}> New Prescription </button>
        <button onClick={this.openModalDoctor}> New Doctor </button> <br/><br/>
        <div>
          <div> Input Zipcode</div><input type="text" onChange={(event) => {this.setState({inputZip: event.target.value})}}/>
          <button onClick={this.openModalMap}> Nearest Pharmacy </button>
        </div>

        <Modal
          isOpen={this.state.scriptmodalIsOpen}
          shouldCloseOnOverlayClick={false}
        >
            <ScriptRemind
            closeFn={this.closeModalScript} />
            <button onClick={this.closeModalScript}>Exit</button>

        </Modal>

        <Modal

          isOpen={this.state.docmodalIsOpen}
          shouldCloseOnOverlayClick={false}
        >
            <DoctorEntryView
            closeFn={this.closeModalDoctor} />
            <button onClick={this.closeModalDoctor}>Exit</button>
        </Modal>

        <Modal
          isOpen={this.state.mapmodalIsOpen}
          shouldCloseOnOverlayClick={false}
        >
          <Map
          zipcode = {this.state.inputZip}
          />
          <button onClick={this.closeModalMap}>Exit</button>
        </Modal>
      <div className="scripts-doctors">
      <div className='scripts-container'>
      <h3 className='scripts-title'> Scripts </h3>
             {
              this.state.scripts.map((script, idx) => {
                return (
                  <div className="scripts-view-container" key={idx}>
                  <div className="script-top-bar"><p className="script-name"> {script.name}</p><i className="fa fa-times" aria-hidden="true" onClick={this.deleteScript.bind(this, idx)}></i></div>
                  <div> <i className="fa fa-heart" aria-hidden="true"></i> Dosage: {script.dosage} </div>
                  <div> <i className="fa fa-bell" aria-hidden="true"></i> Reminder: {script.frequency} </div>
                  <div> <i className="fa fa-calendar" aria-hidden="true"></i> Refill: {String(new Date(script.refill)).split('').slice(0, 15).join('')} </div>
                 </div>
               );
              }, this)
            }
          </div>
        <div className='doctors-container'>
          <h3 className='doctors-title'> Doctors </h3>
              {
                this.state.doctors.map((doctor, idx) => {
                  return (
                    <div className="doctor-view-container" key={idx }>
                    <div className="doctor-top-bar"><p className='doctor-name'>{doctor.name}</p><i className="fa fa-times" aria-hidden="true" onClick={this.deleteDoc.bind(this, idx)}></i></div>
                    <div><i className="fa fa-phone" aria-hidden="true"></i>  {doctor.phone}</div>
                    <div><i className="fa fa-envelope" aria-hidden="true"></i>  {doctor.email}</div>
                    <div><i className="fa fa-map-marker" aria-hidden="true"></i>  {doctor.address}</div>
                    <div><i className="fa fa-stethoscope" aria-hidden="true"></i>  {doctor.specialty}</div>
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
