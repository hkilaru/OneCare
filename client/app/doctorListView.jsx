// for some reason calling DoctorListView.getDocs() would close the modal on doctor entryview and rerender and update
// the homepage

// need to investigate why this is so

//
//
//
// import React, { Component } from 'react';
// import DoctorView from './doctorView.jsx'
// import Navigate from './navigate.jsx';
//
//
// export default class DoctorListView extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       doctors: []
//     };
//     this.getDocs = this.getDocs.bind(this);
//   }
//
//
//   getDocs() {
//
//     $.ajax({
//       type: 'POST',
//       url: '/api/doctors/get',
//       headers: {
//         "content-type": "application/json"
//       },
//       data: JSON.stringify({"username": window.localStorage.username}),
//       success: function(docs) {
//         console.log("DOCTORS", docs);
//         this.setState({
//           doctors: docs
//         });
//       }.bind(this),
//       error: function(err) {
//         console.log('I can\'t pill you...not today', err);
//       }
//     });
//   }
//
//
//   componentDidMount() {
//     this.getDocs();
//   }
//
//   render() {
//     var { doctors } = this.state;
//     return (
//
//       <div className="doctor-list-view">
//         {
//          doctors.map((doctor, idx) => {
//           return (<DoctorView key={idx} id={doctor._id} name={doctor.name} phone={doctor.phone} email={doctor.email} address={doctor.address} specialty={doctor.specialty} />)
//          }, this)
//         }
//       </div>
//     );
//   }
//
// }
