import React, { Component } from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import Modal from "react-modal";

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
      validPhone: false,
      validSpecialty: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitNewDoctor = this.submitNewDoctor.bind(this);
  }

  handleChange(event) {
    var stateVal = event.target.id;
    if (stateVal === "name") {
      this.setState({name: event.target.value, validName:true});
    } else if (stateVal === "phone") {
      this.setState({phone: event.target.value, validPhone: event.target.value.match(/\d/g).length===11
        });
    } else if (stateVal === "email") {
      this.setState({email: event.target.value});
    } else if (stateVal === "address") {
      this.setState({address: event.target.value});
    } else if (stateVal === "specialty") {
      this.setState({specialty: event.target.value, validSpecialty:true});
    }
  }

  submitNewDoctor(e) {
    e.preventDefault();
    if(!this.state.name.length && !this.state.validPhone && !this.state.validSpecialty){
      alert("Please correct the following fields: name, phone, specialty");
    }
    else if(!this.state.validPhone && !this.state.validSpecialty){
      alert("Please enter a valid phone and specialty");
    }
    else if(!this.state.name.length && !this.state.validSpecialty) {
      alert("Please enter a valid name and specialty");
    }
    else if(!this.state.name.length && !this.state.validPhone){
      alert("Please enter a valid name and phone");
    }
    else if(!this.state.name.length) {
      alert("Please enter a name");
    }
    else if(!this.state.validPhone) {
      alert("Please enter a valid phone");
    }
    else if(!this.state.validSpecialty) {
      alert("Please enter a specialty");
    }
     else {
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
        <h2>Input a new doctor!</h2>
        <form className="doctor-entry-form">
          <div>Name</div><input id="name" type="text" onChange={this.handleChange} />
          <div>Phone</div><input id="phone" type="text" onChange={this.handleChange}></input><h6 className={(this.state.validPhone ? 'hidden' : 'invalid')}> Phone number must be 11 digits</h6><br />
          <div>Email</div><input id="email" type="text" onChange={this.handleChange}></input><br /><h6 className="invalid"> (Your doctor will receive notification that you have registered with them!) </h6><br />
          <div>Address</div><input id="address" type="text" onChange={this.handleChange}></input><br />
          <div>Specialty</div><select id="specialty" onChange={this.handleChange}>
            <option>::Select Specialty::</option>
            {
              DOCTORS.map((doctor) => {
                return (
                  <option key={doctor.id} >{doctor.name}</option>
                );
              })
            }
          </select>
          <button onClick={this.submitNewDoctor}>Submit!</button>
        </form>
      </div>
    );
  }
}
