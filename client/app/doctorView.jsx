import React, { Component } from 'react';

export default class DoctorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://www.google.com/search?q=" + this.props.name + "&btnI"
    }
    this.deleteDoc = this.deleteDoc.bind(this);
  }

   // <a target="_blank" href={"http://www.google.com/search?q=" + this.props.name + "&btnI"}>(get more info)</a>

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


  render() {
    return (
      <div className="doctor-view-container-rec">
        <div className="doctor-name black"> {this.props.name}</div>
        <div className="doctor-attribute black"><i className="fa fa-phone phone-green" aria-hidden="true"></i> {this.props.phone}</div>
        <div className="doctor-attribute black"><i className="fa fa-envelope envelope black" aria-hidden="true"></i> {this.props.email}</div>
        <div className="doctor-attribute black"><i className="fa fa-map-marker red" aria-hidden="true"></i> {this.props.address}</div>
        <div className="doctor-attribute black"><i className="fa fa-stethoscope black" aria-hidden="true"></i> {this.props.specialty}</div>
      </div>
    );
  }
}
