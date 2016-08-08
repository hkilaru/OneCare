import React, { Component } from 'react';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import DoctorListView from './doctorListView.jsx';

  var DOCTORS = [
    {id: 1, name: 'Allergology'},
    {id: 2, name: 'Andrology'},
    {id: 3, name: 'Anesthesia'},
    {id: 4, name: 'Angiology‎'},
    {id: 5, name: 'Cardiology‎'},
    {id: 6, name: 'Dentistry‎'},
    {id: 7, name: 'Dermatology‎'},
    {id: 8, name: 'Emergency medicine‎'},
    {id: 9, name: 'Endocrinology‎'},
    {id: 10, name: 'Family medicine‎'},
    {id: 11, name: 'Gastroenterology‎'},
    {id: 12, name: 'General practice‎'},
    {id: 13, name: 'Geriatrics‎'},
    {id: 14, name: 'Gynaecology‎'},
    {id: 15, name: 'Hematology‎'},
    {id: 16, name: 'Hepatology‎'},
    {id: 17, name: 'Immunology‎'},
    {id: 18, name: 'Internal medicine‎'},
    {id: 19, name: 'Nephrology‎'},
    {id: 20, name: 'Neurology‎'},
    {id: 21, name: 'Obstetrics‎'},
    {id: 22, name: 'Oncology‎'},
    {id: 23, name: 'Ophthalmology‎'},
    {id: 24, name: 'Ear, nose, and Throat'},
    {id: 25, name: 'Palliative medicine‎'},
    {id: 26, name: 'Pediatrics‎'},
    {id: 27, name: 'Podiatry‎'},
    {id: 28, name: 'Psychiatric'},
    {id: 29, name: 'Pulmonology‎'},
    {id: 30, name: 'Radiology‎'},
    {id: 31, name: 'Rheumatology‎'},
    {id: 32, name: 'Sleep medicine‎'},
    {id: 33, name: 'Surgery‎'},
    {id: 34, name: 'Toxicology‎'},
    {id: 35, name: 'Urology‎'}
  ]


export default class DoctorEntryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      address: "",
      specialty: "",
      validPhone: false,
      validSpecialty: false
    }
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
      alert("Please enter a valid name and specialty")
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
      var toSubmit = { "username": window.localStorage.username, "doc": {
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        address: this.state.address,
        specialty: this.state.specialty
      }}

      $.ajax({
        type: "POST",
        url: "/api/doctor/add",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify(toSubmit),
        success: function(res) {
          console.log(res, "has been added");
          DoctorListView.getDocs();
        },
        error: function(err) {
          console.error("Doctor not registered: ", err);
        }
      });
    }
  }
  render() {
    return (
      <div className="doctor-input">
      <Navigate />
      <h2>Input a new doctor</h2>
        <form className="doctor-entry-form">
          <div>Name</div><input id="name" type="text" onChange={this.handleChange} />
          <div>Phone</div><input id="phone" type="text" onChange={this.handleChange}></input><h6 className={(this.state.validPhone ? 'hidden' : 'invalid')}> Phone number must be 11 digits</h6><br />
          <div>Email</div><input id="email" type="text" onChange={this.handleChange}></input><br />
          <div>Address</div><input id="address" type="text" onChange={this.handleChange}></input><br />
          <div>Specialty</div><select id="specialty" onChange={this.handleChange}>
            <option>::Select Specialty::</option>
            {
              DOCTORS.map((doctor) => {
                return (
                  <option key={doctor.id} >{doctor.name}</option>
                )
              })
            }
          </select>
          <button onClick={this.submitNewDoctor}>Submit!</button>
        </form>
        <hr />
      </div>
    )
  }
}
