import React, { Component } from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';

  var DOCTORS = [
    {id: 1, name: 'Allergologist'},
    {id: 2, name: 'Andrologist'},
    {id: 3, name: 'Anesthesiologist'},
    {id: 4, name: 'Angiologist‎'},
    {id: 5, name: 'Cardiologist'},
    {id: 6, name: 'Dentist'},
    {id: 7, name: 'Dermatologist‎'},
    {id: 8, name: 'Emergency Medicine‎ Specialist'},
    {id: 9, name: 'Endocrinology‎'},
    {id: 10, name: 'Family Medicine‎ Specialist'},
    {id: 11, name: 'Gastroenterologist‎'},
    {id: 12, name: 'General practitioner'},
    {id: 13, name: 'Geriatrician'},
    {id: 14, name: 'Gynaecologist'},
    {id: 15, name: 'Hematologist'},
    {id: 16, name: 'Hepatologyist'},
    {id: 17, name: 'Immunologist‎'},
    {id: 18, name: 'Internal Medical Specialist'},
    {id: 19, name: 'Nephrologist‎'},
    {id: 20, name: 'Neurologist'},
    {id: 21, name: 'Obstetrician'},
    {id: 22, name: 'Oncologist'},
    {id: 23, name: 'Ophthalmologist'},
    {id: 24, name: 'Ear, Nose, and Throat Doctor'},
    {id: 25, name: 'Palliative Medical Expert'},
    {id: 26, name: 'Pediatrician‎'},
    {id: 27, name: 'Podiatrist'},
    {id: 28, name: 'Psychiatrist'},
    {id: 29, name: 'Pulmonologist'},
    {id: 30, name: 'Radiologist'},
    {id: 31, name: 'Rheumatologist‎'},
    {id: 32, name: 'Expert in Sleep Medicine‎'},
    {id: 33, name: 'Surgeon‎'},
    {id: 34, name: 'Toxicologist'},
    {id: 35, name: 'Urologist'}
  ];


export default class DoctorEntryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
      name: "",
      phone: "",
      email: "",
      address: "",
      specialty: "",
      //validation
      phoneIsValid: false,
      specialtyIsValid: false,
      nameIsValid: false,
      emailIsValid: false,
      formIsValid: true
    };
    this.submitNewDoctor = this.submitNewDoctor.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleSpecialty = this.handleSpecialty.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
  }

  handlePhone(e) {
    this.setState({phone: e.target.value});
    if (e.target.value.match(/\d/g).length===11) {
      this.setState({phoneIsValid: true});
    } else {
      this.setState({phoneIsValid: false});
    }
  }

  handleSpecialty(e) {
    this.setState({specialty: e.target.value})
    if (e.target.value !== "::Select Specialty::") {
      this.setState({specialtyIsValid: true});
    } else {
      this.setState({specialtyIsValid: false});
    }
  }

  handleName(e) {
    this.setState({name: e.target.value})
    if (e.target.value.length > 2) {
      this.setState({nameIsValid: true});
    } else {
      this.setState({nameIsValid: false});
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

  handleAddress(e) {
    this.setState({address: e.target.value})
  }

  submitNewDoctor(e) {
    e.preventDefault();
    if(!this.state.nameIsValid || !this.state.phoneIsValid || !this.state.emailIsValid || !this.state.specialtyIsValid){
      this.setState({formIsValid: false})
    } else {
      var toSubmit = { "username": window.localStorage.username, "first_last": window.localStorage.first_last, "userID": window.localStorage.userID, "doc": {
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        address: this.state.address,
        specialty: this.state.specialty
      }};

      $.ajax({
        type: "POST",
        url: "/api/doctor/add",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify(toSubmit),
        success: this.props.closeFn(),
        error: this.props.closeFn()
      });
    }
  }
  render() {
    return (
      <div className="script-form-frame">
        {/* <Navigate /> */}
        <div className="doctor-entry-form">
          <div>Name</div><input id="name" type="text" onChange={this.handleName} />
          <div className={this.state.nameIsValid ? "hidden" : "invalid"}> Name must be at least 2 characters </div>
          <div>Phone</div><input id="phone" type="text" onChange={this.handlePhone}></input><br />
          <div className={this.state.phoneIsValid ? "hidden" : "invalid"}> Phone numbers must be 11 digits long </div>
          <div>Email</div><input id="email" type="text" onChange={this.handleEmail}></input><br />
          <div className={this.state.emailIsValid ? "hidden" : "invalid"}> Please enter a valid email </div>
          <h6 className="invalid"> (Your doctor will receive an email from OneCare) </h6>
          <div>Address</div><input id="address" type="text" onChange={this.handleAddress}></input><br />
          <div>Specialty</div><select id="specialty" onChange={this.handleSpecialty}>
            <option>None Selected</option>
            {
              DOCTORS.map((doctor) => {
                return (
                  <option key={doctor.id} >{doctor.name}</option>
                );
              })
            }
          </select>
          <div className={this.state.specialtyIsValid ? "hidden" : "invalid"}> Select a specialty </div>
          <Button bsStyle='info' onClick={this.submitNewDoctor}>Save Doctor</Button>
          <h6 className={(this.state.formIsValid ? 'hidden' : 'invalid')}> Some of your data is invalid.  Please check above. </h6>
        </div>
      </div>
    );
  }
}
