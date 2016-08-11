import React, {Component} from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import ScriptRemind from './scriptRemind.jsx';
import Modal from 'react-modal';
import DoctorEntryView from './doctorEntryView.jsx';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      scripts: [],
      scriptmodalIsOpen: false,
      docmodalIsOpen: false
    };
    this.openModalScript = this.openModalScript.bind(this);
    this.closeModalScript = this.closeModalScript.bind(this);
    this.openModalDoctor = this.openModalDoctor.bind(this);
    this.closeModalDoctor = this.closeModalDoctor.bind(this);
    this.getScripts = this.getScripts.bind(this);
    this.deleteReminder= this.deleteReminder.bind(this);
    this.getDocs = this.getDocs.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
  }

  deleteDoc(id){
    console.log("docID", id);

    $.ajax({
     type: "POST",
     url: "/api/doctor/delete",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({ "docID": id }),
     success: function(data) {
       console.log("Doctor deleted");
       location.reload();
     },
     error: function(err) {
       console.log('Doctor not deleted', err);
       location.reload();
     }
   });

  }

  deleteReminder(index) {
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
     success: function(data) {
       console.log("Script deleted");
       this.getScripts();
     }.bind(this),
     error: function(err) {
       console.log('script not deleted', err);
       this.getScripts();
     }.bind(this)
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

 closeModalScript() {
   this.setState({
     scriptmodalIsOpen: false
   });
 }

 closeModalDoctor() {
   this.setState({
     docmodalIsOpen: false
   });
 }


  getScripts() {
    $.ajax({
     type: "POST",
     url: "/api/script/find",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({username: window.localStorage.username}),
     success: function(data) {
       console.log('user scripts from AJAX request', data);
       this.setState({scripts: data});
     }.bind(this),
     error: function(err) {
       console.log('error in ajax request for user scripts', data);
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

  componentDidMount() {
    this.getScripts();
    this.getDocs();
  }

  render() {
    return (
      <div>
      <Navigate />
      <h1> My Profile </h1>
          <div className="allScripts">
      <button onClick={this.openModalScript}> Enter New Prescription </button>
      <button onClick={this.openModalDoctor}> Enter New Doctor </button>

      <Modal
        isOpen={this.state.scriptmodalIsOpen}
        shouldCloseOnOverlayClick={false}
        // onRequestClose={this.closeModalScript}
        >
          <ScriptRemind />
          <button onClick={this.closeModalScript}>Exit</button>

      </Modal>

      <Modal
        isOpen={this.state.docmodalIsOpen}
        shouldCloseOnOverlayClick={false}
        // onRequestClose={this.closeModalDoctor}
        >
          <DoctorEntryView />
          <button onClick={this.closeModalDoctor}>Exit</button>
      </Modal>


      <h2> Prescriptions </h2>

             {
              this.state.scripts.map((script, idx) => {
                return (
                  <ul className="User-Scripts" key={idx}>
                  <div className="single-script">
                    <li> <span className="user-script"> Name: </span> {script.name} </li>
                    <li> <span className="user-script"> Dosage: </span> {script.dosage} </li>
                    <li> <span className="user-script"> Frequency: </span> {script.frequency} </li>
                    <li> <span className="user-script"> Refill Date: </span> {String(new Date(script.refill)).split('').slice(0, 15).join('')} </li>
                  </div>
                 <button onClick={this.deleteReminder.bind(this, idx)} >Delete</button>
                 </ul>
               );
              }, this)
            }
          </div>

          <h2> Your Doctors </h2>

            {
              this.state.doctors.map((doctor, idx) => {
                return (
                  <div className="doctor-view-container" key={idx }>
                  <div className="doctor-name">{doctor.name}</div>
                  <div><span className="doctor-attribute">Phone: </span>{doctor.phone}</div>
                  <div><span className="doctor-attribute">Email: </span>{doctor.email}</div>
                  <div><span className="doctor-attribute">Address: </span>{doctor.address}</div>
                  <div><span className="doctor-attribute">Specialty: </span>{doctor.specialty}</div>
                  <button onClick={this.deleteDoc.bind(this, idx)}> Delete </button>
                  </div>
                );
              }, this)
            }
      </div>
    );
  }

}
