import React, {Component} from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import ScriptRemind from './scriptRemind.jsx';
import DoctorEntryView from './doctorEntryView.jsx';
import SymptomEntry from './symptomEntry.jsx';
import SymptomEntryModal from './symptomEntryModal.jsx';
import EditScriptRemindModal from './editScript.jsx';
import Map from './map.jsx';
import _ from 'lodash';
import { Modal, Button, ButtonToolbar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import EditDoctorModal from './editDoctor.jsx';
import {ScrollBox, ScrollAxes, FastTrack} from 'react-scroll-box';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      scripts: [],
      zipcode: null,
      inputZip: null,
      editScript: null,
      editDoctor: null,
      editModalDoctorIsOpen: false,
      scriptmodalIsOpen: false,
      docmodalIsOpen: false,
      mapmodalIsOpen: false,
      symptomModalIsOpen: false,
      brainModalIsOpen: false,
      editModalIsOpen: false,
      notesOpen: false,
      openNotes: {
        doctor: '',
        notes: []
      },
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
    this.openEditModalScript = this.openEditModalScript.bind(this);
    this.closeEditModalScript = this.closeEditModalScript.bind(this);
    this.doctorNotes = this.doctorNotes.bind(this);
    this.getZip = this.getZip.bind(this);
    this.openEditModalDoctor = this.openEditModalDoctor.bind(this);
    this.closeEditModalDoctor = this.closeEditModalDoctor.bind(this);

  }

  deleteDoc(idx){
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
    var id = this.state.scripts[index]._id;
    $.ajax({
     type: "POST",
     url: "/api/reminder/delete",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({ "reminderID": id }),
     success: function(data) {
       console.log(data);
       var newScripts = this.state.scripts.filter((script) => {
         if (script._id === data._id) {
           return false;
         } else {
           return true;
         }
       });
       this.setState({scripts: newScripts});
     }.bind(this),
     error: function(err) {
      console.error(err);
     }.bind(this)
   });
  }

  openModalScript() {
    console.log("open modal script called");
    console.log('this is the editscript', this.state.editScript);
    this.setState({
      scriptmodalIsOpen: true
    });
  }

  openEditModalScript(idx) {
    var script = this.state.scripts[idx];
    this.setState({
      editScript: script
    }, function(){
      console.log('this is the script modal sent over', script);
    });
    this.setState({
      editModalIsOpen: true
    });
  }

  closeEditModalScript() {
    this.setState({
      editModalIsOpen: false
    });
  }

  openEditModalDoctor(idx) {
    var doctor = this.state.doctors[idx];
    this.setState({
      editDoctor: doctor
    }, function() {
      console.log('this is the doctor model being sent over', doctor);
    });
    this.setState({
      editModalDoctorIsOpen: true
    });
  }

  closeEditModalDoctor(){
    this.setState({
      editModalDoctorIsOpen: false
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
    }, function() {console.log(this.state.zipcode)});
  }

  openModalBrain() {
    this.setState({
      brainModalIsOpen: true
    });
  }

 closeModalScript() {
   this.setState({
     scriptmodalIsOpen: false
   }, this.getScripts);
 }

  closeModalDoctor() {
    this.setState({
      docmodalIsOpen: false
    }, this.getDocs);
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
    console.log("get scripts called");
    $.ajax({
     type: "POST",
     url: "/api/script/find",
     dataType: 'json',
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify({username: window.localStorage.username}),
     success: function(data) {
       var sorted  = _.sortBy(data, 'refill'); //sorts scripts by refill date
       this.setState({scripts: sorted});
     }.bind(this),
     error: function(err) {
       console.error('error in ajax request for user scripts', err);
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
        this.setState({
          doctors: docs
        });
      }.bind(this),
      error: function(err) {
        console.error('I can\'t pill you...not today', err);
      }
    });
  }

  doctorNotes(doctor) {
    this.setState({
      notesOpen: !this.state.notesOpen
    })

    var url = '/api/note/getAll/'+doctor._id;
    $.ajax({
      type: 'GET',
      url: url,
      headers: {
        "content-type": "application/json"
      },
      success: function(data) {
        //update current notes on db.
        $.ajax({
          type: 'PUT',
          url: url,
          data: JSON.stringify({seen: true}),
          headers: {
            "content-type": "application/json"
          },
          success: function() {console.log('notes marked as seen')},
          error: function() {console.log('notes not marked as seen')}
        })
        //change currrent notes to clicked doctor.
        if (this.state.openNotes.doctor === doctor._id) {
          this.setState({openNotes: {
            doctor: '',
            notes: []
          }});
        } else {
          data = data.sort((a, b) => {
            if (a.seen && !b.seen) {
              return 1;
            } else if (!a.seen && b.seen) {
              return -1;
            } else {
              return 0;
            }
          })
          this.setState({openNotes: {
            doctor: doctor._id,
            notes: data
          }})
        }
      }.bind(this),
      error: function(err) {
        console.error("Couldn't get doctor's notes: ", err);
      }
    });
  }

  hideNote(note) {
    var url = '/api/note/edit/'+note._id;
    //toggle note.hidden in database
    $.ajax({
      type: 'PUT',
      url: url,
      data: JSON.stringify({hidden: true}),
      headers: {
        "content-type": "application/json"
      },
      success: (data) => {console.log("note deleted: ", data)},
      error: (err) => {console.error("error in AJAX call: ", err)}
    })
    //hide div on DOM
    var newNotes = this.state.openNotes.notes.filter((curNote) => {
       return curNote !== note;
    })
    this.setState({openNotes: {
      doctor: this.state.openNotes.doctor,
      notes: newNotes
    }})
  }

  getZip() {
    $.ajax({
      type: 'POST',
      url: '/api/user/zip',
      headers: {
        "content-type": "application/json"
      },
      data: JSON.stringify({"username": window.localStorage.username}),
      success: function(zipcode) {
        console.log("USER zipcode", zipcode);
        this.setState({
          zipcode: zipcode
        });
      }.bind(this),
      error: function(err) {
        console.log('Could not retrieve user zipcode', err);
      }
    });
  }

  componentDidMount() {
    this.getScripts();
    this.getDocs();
    this.getZip();
  }

  render() {
    return (
      <div className='profile-container'>
        <Navigate />
        <div>
          <Modal show={this.state.scriptmodalIsOpen}>
              <div className="modal-button-close-container">
                <h2>Input new prescription</h2>
                <div className='modal-button-close' onClick={this.closeModalScript}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
              </div>
              <ScriptRemind
              closeFn={this.closeModalScript} />
              {/* <Button onClick={this.closeModalScript}>Exit</Button> */}

          </Modal>
        </div>
        <Modal show={this.state.docmodalIsOpen} bsSize='small'>
            <div className="modal-button-close-container white">
              <h2>Input new doctor</h2>
              <div className='modal-button-close' onClick={this.closeModalDoctor}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <DoctorEntryView
            closeFn={this.closeModalDoctor} />
        </Modal>

        {/* <Modal show={this.state.mapmodalIsOpen} style={this.state.modalStyles}> */}
        <Modal show={this.state.mapmodalIsOpen}>
            <div className="modal-button-close-container">
            <h2>Pharmacies near {this.state.inputZip}</h2>
              <div className='modal-button-close' onClick={this.closeModalMap}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <Map zipcode={this.state.inputZip} />
        </Modal>

        <Modal show={this.state.symptomModalIsOpen} style={this.state.modalStyles}>
            {/* <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalSymptom}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div> */}
            <SymptomEntry
            zipcode={this.state.zipcode}
            closeFn={this.closeModalSymptom} />
        </Modal>

        <Modal show={this.state.brainModalIsOpen} bsSize='small'>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeModalBrain}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <SymptomEntryModal
            brainState
            symptoms
            recommendations
            closeFn={this.closeModalDoctor}/>
        </Modal>

        <Modal show={this.state.editModalIsOpen} bsSize='small'>
            <div className="modal-button-close-container">
              <div className='modal-button-close' onClick={this.closeEditModalScript}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
            </div>
            <EditScriptRemindModal
            data={this.state.editScript}
            closeFn={this.closeEditModalScript} />
            {/* <Button onClick={this.closeEditModalScript}>Exit</Button> */}
        </Modal>

        <Modal show={this.state.editModalDoctorIsOpen} bsSize='small'>
          <div className="modal-button-close-container">
            <div className='modal-button-close' onClick={this.closeEditModalDoctor}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
          </div>
          <EditDoctorModal
          data={this.state.editDoctor}
          closeFn={this.closeEditModalDoctor} />
          {/* <Button onClick={this.closeEditModalScript}>Exit</Button> */}

        </Modal>

      <div className="scripts-doctors">
      <div className='scripts-container'>
      <div className='scripts-header'>
        <div className='scripts-title shadow'> Prescriptions </div>
        <div className='find-pharm'>
          <input className='zipcode-input' placeholder='Zipcode' type="text" onChange={(event) => {this.setState({inputZip: event.target.value})}}/>
            <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip"> Find a nearby pharmacy</Tooltip>}>
              <div className='shadow-box'>
                <Button bsStyle='info' onClick={this.openModalMap}> <div> <i className="fa fa-search" aria-hidden="true"></i> Pharmacy </div> </Button>
              </div>
            </OverlayTrigger>
        </div>
        <div className='add-btn shadow'>
          <i className="fa fa-plus-circle white add" onClick={this.openModalScript} aria-hidden="true"></i>
        </div>
      </div>
             {
              this.state.scripts.map((script, idx) => {
                return (
                  <div className="scripts-view-container" key={idx}>
                    <div className="script-top-bar">
                      <div className="doc-top-first-half">
                        <p className="script-name"> {script.name}</p>
                        <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip"> Click to edit card</Tooltip>}>
                          <div className='edit-icon midnight-blue-text'>
                            <i className="fa fa-pencil-square-o pencil" aria-hidden="true" onClick={this.openEditModalScript.bind(this,idx)}></i>
                          </div>{/* <a target="_blank" href={"https://simple.wikipedia.org/wiki/" + script.name}>(get more info)</a>*/}
                        </OverlayTrigger>
                      </div>
                      <div className='midnight-blue-text close-x'>
                        <i className="fa fa-times" aria-hidden="true" onClick={this.deleteScript.bind(this, idx)}></i>
                      </div>
                    </div>
                    <div className='script-attribute'>
                      <i className="fa fa-heart red" aria-hidden="true"></i> Dosage: {script.dosage}
                    </div>
                    <div className='script-attribute'>
                      <i className="fa fa-bell gold" aria-hidden="true"></i> Reminder: {script.frequency}
                    </div>
                    <div className='script-attribute'>
                      <i className="fa fa-calendar royal-blue" aria-hidden="true"></i> Refill: {String(new Date(script.refill)).split('').slice(0, 15).join('')}
                    </div>
                 </div>
               );
              }, this)
            }
            <div onClick={this.openModalScript} className={this.state.scripts.length === 0 ? "scripts-empty" : "hidden"}>
              Click to save a prescription reminder
            </div>
          </div>
        <div className='doctors-container'>
        <div className='doctors-header'>
          <div className='doctors-title shadow'> Doctors </div>
          <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip"> Feeling sick? OneCare can recommend a specialist </Tooltip>}>
            <div className='rec-btn shadow-box'>
              <Button bsStyle="info" bsSize='small' onClick={this.openModalSymptom}> <div> <i className="fa fa-stethoscope" aria-hidden="true"></i> Recommend </div></Button>
            </div>
          </OverlayTrigger>
          <div className='add-btn shadow'>
            <i className="fa fa-plus-circle white add" onClick={this.openModalDoctor} aria-hidden="true"></i>
          </div>
        </div>
              {
                this.state.doctors.map((doctor, idx) => {
                  return (
                      <div className=" doctor-view-container" key={idx}>
                        <div className="doc-info">
                            <div className="doctor-top-bar">
                              <div className="doc-top-first-half">
                                <p className='doctor-name'>{doctor.name}</p>
                                <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip"> Click to edit card</Tooltip>}>
                                <div className='edit-icon midnight-blue-text'>
                                  <i className="fa fa-pencil-square-o pencil" aria-hidden="true" onClick={this.openEditModalDoctor.bind(this,idx)}></i>
                                </div>
                                </OverlayTrigger>
                              </div>
                              <div className='delete-doc midnight-blue-text close-x'>
                                <i className="fa fa-times" aria-hidden="true" onClick={this.deleteDoc.bind(this, idx)}></i>
                              </div>
                            </div>
                            <div className='doctor-attribute'>
                              <i className="fa fa-phone phone-green" aria-hidden="true"></i> {doctor.phone}
                            </div>
                            <div className='doctor-attribute'>
                              <div className="email-specialist-container">
                                <div>
                                  <i className="fa fa-envelope envelope" aria-hidden="true"></i>  {doctor.email}
                                </div>
                              </div>
                            </div>
                            <div className='doctor-footer'>
                              <div className='doctor-attribute'>
                                <i className="fa fa-map-marker red" aria-hidden="true"></i>  {doctor.address}
                              </div>
                              <div className='doctor-attribute'>
                                <div className='specialty-tag'>
                                  <i className="fa fa-stethoscope" aria-hidden="true"></i> {doctor.specialty}
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className='show-notes'>
                            <OverlayTrigger placement='top' overlay={<Tooltip id="tooltip"> Click to view doctor's notes</Tooltip>}>
                              <div className={this.state.notesOpen ? 'hidden': 'note-icon'}>
                                <i className="fa fa-angle-double-down midnight-blue-text" aria-hidden="true" onClick={this.doctorNotes.bind(this, doctor)}></i>
                              </div>
                            </OverlayTrigger>
                            <div className={this.state.notesOpen ? 'note-icon': 'hidden'}>
                              <i className="fa fa-angle-double-up midnight-blue-text" aria-hidden="true" onClick={this.doctorNotes.bind(this, doctor)}></i>
                            </div>
                          </div>
                          <div className={this.state.openNotes.doctor === doctor._id ? "doctor-notes-container" : "hidden"}>
                          {this.state.openNotes.notes
                            .filter((note) => (
                              !note.hidden
                            ))
                            .map((note, idx) => (
                            <div key={idx} className={"doctor-notes-entry" + (note.seen ? "" : " phone-green")}>
                              <span className="note-delete midnight-blue-text"><i className="fa fa-trash" aria-hidden="true" onClick={this.hideNote.bind(this, note)}></i></span>
                              {note.body}
                            </div>
                            )
                          )}
                          </div>
                      </div>
                    );
                }, this)
              }
              <div onClick={this.openModalDoctor} className={this.state.doctors.length === 0 ? "doctors-empty" : "hidden"}>Click to save a new doctor</div>
          </div>
      </div>
      </div>
    );
  }
}
