import React, { Component } from 'react';
import Calendar from 'react-input-calendar'
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Dropdown from 'react-drop-down';
import { Link } from 'react-router';
import Navigate from './navigate.jsx';
import Kronos from 'react-kronos';
import moment from 'moment';
import Modal from 'react-modal'
import {Button, ButtonToolbar } from 'react-bootstrap';

export default class EditScriptRemindModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "currentDrug": this.props.data.name || "None",
      "dosageAmt": this.props.data.dosage ? this.props.data.dosage.split(" ")[0] : 0,
      "dosageMeasure": this.props.data.dosage ? this.props.data.dosage.split(" ")[1] : 'mg',
      "date": this.props.data.refill || date,
      "reminderTime1": this.props.data.reminderTime[0] !== null ? this.props.data.reminderTime[0] : null,
      "reminderTime2": this.props.data.reminderTime[1] !== null ? this.props.data.reminderTime[1] : null,
      "reminderTime3": this.props.data.reminderTime[2] !== null ? this.props.data.reminderTime[2] : null,
      "scheduleFreq": this.props.data.frequency ? this.props.data.frequency.slice(0,2) : "1x",
      "scheduleDayWeek": this.props.data.frequency ? this.props.data.frequency.split(" ")[this.props.data.frequency.length -1] : "day",
      "invalidName": false,
      "invalidReminderTime": false,
      "hasTwo": false,
      "hasThree": false
    };
  var date = new Date();
  this.updateDrugName = this.updateDrugName.bind(this);
  this.submitForm = this.submitForm.bind(this);
  this.handleFrequency = this.handleFrequency.bind(this);
  this.handleDoseAmount = this.handleDoseAmount.bind(this);
  this.handleRefillDate = this.handleRefillDate.bind(this);
  this.handleDoseMeasurement = this.handleDoseMeasurement.bind(this);
  this.handleScheduleDayWeek = this.handleScheduleDayWeek.bind(this);
  this.handleReminderTime1 = this.handleReminderTime1.bind(this);
  this.handleReminderTime2 = this.handleReminderTime2.bind(this);
  this.handleReminderTime3 = this.handleReminderTime3.bind(this);
  // this.clearData = this.clearData.bind(this);

  }

  componentDidMount() {
    this.changeFrequency();
  }
  //
  changeFrequency() {
    if(this.props.data.reminderTime[1] !== null && !this.props.data.reminderTime[2]) {
      this.setState({
        hasTwo: true
      })
    }else if(this.props.data.reminderTime[2] !== null){
      this.setState({
        hasTwo: true,
        hasThree: true
      })
    }else if(this.props.data.reminderTime[0] !== null) {
      this.setState({
        hasTwo: true
      })
    }

    // this.setState({
    //   scheduleFreq: freq
    // });
  }
    // clearData(){
    //   this.setState({
    //     "currentDrug": "None",
    //     "dosageAmt": 0,
    //     "dosageMeasure": 'mg',
    //     "date": date,
    //     "reminderTime1": null,
    //     "reminderTime2": null,
    //     "reminderTime3": null,
    //     "scheduleFreq": "1x",
    //     "scheduleDayWeek": "day",
    //     "invalidName": false,
    //     "invalidReminderTime": false,
    //     "hasTwo": false,
    //     "hasThree": false
    //   })
    // }


    updateDrugName(event){
      this.setState({
          currentDrug: event.target.value,
          invalidName: true
        });
    }

    handleRefillDate(date) {
      console.log("actual date format", date);
      console.log("selected date", date);
      this.setState({
        "date": date
      });

    }

    handleScheduleDayWeek(dayWeek){
        this.setState({
          "scheduleDayWeek": dayWeek
        });
    }

    handleDoseMeasurement(measure) {
      this.setState({
        dosageMeasure: measure.target.value
      });

    }

    handleDoseAmount(amount) {
      this.setState({
        dosageAmt: amount.target.value
      });

    }

    handleFrequency(e) {
      console.log("current state", this.state);
      var frequency = e ? e.target.value : this.props.data.frequency;
      // console.log("handleFreq called with", frequency.target.value);
      console.log('handleFreq prop data', this.props.data.reminderTime)
      if(e.target.value === '2x'){
        this.setState({
          hasTwo: true,
          hasThree: false
        })
      }
      if(e.target.value === '3x'){
        this.setState({
          hasTwo: true,
          hasThree: true
        })
      }
      if(e.target.value === '1x'){
        this.setState({
          hasTwo: false,
          hasThree: false
        })
      }
      this.setState({
        scheduleFreq: frequency
      });
    }

    handleReminderTime1(time){
      console.log(' this is the format of time !!!!!!', time);
      this.setState({
        reminderTime1: new Date(moment(time).format()).toISOString()
      })
    }
    handleReminderTime2(time){
      this.setState({
        reminderTime2: new Date(moment(time).format()).toISOString()
      })
    }handleReminderTime3(time){
      this.setState({
        reminderTime3: new Date(moment(time).format()).toISOString()
      })
    }

    submitForm () {

      if(!this.state.invalidName && !this.state.invalidReminderTime){
        alert("Please enter a prescription name and reminder time")
      }
      else if(!this.state.invalidName){
        alert("Please enter a prescription name");
      }
      // else if(!this.state.invalidReminderTime){
      //   alert("Please enter a reminder time");
      // }
      else {
        var script = {
          "name": this.state.currentDrug,
          "dosage": this.state.dosageAmt + ' ' + this.state.dosageMeasure,
          "refill": new Date(moment(this.state.date).format()).toISOString(),
          "frequency": this.state.scheduleFreq + ' per ' + this.state.scheduleDayWeek,
          "reminderTime": [this.state.reminderTime1, this.state.reminderTime2, this.state.reminderTime3],
          "username": window.localStorage.username
        };
        console.log("submitForm called for: ", script);
          // console.log("deleteReminder called!!");
          var id = this.props.data._id;
          console.log("reminderID", id);
          $.ajax({
           type: "POST",
           url: "/api/reminder/delete",
           dataType: 'json',
           headers: {
             "Content-Type": "application/json"
           },
           data: JSON.stringify({ "reminderID": id }),
           success:
           $.ajax({
             type: 'POST',
             url: '/api/reminder/add',
             dataType: 'json',
             headers: {
               'Content-Type': 'application/json'
             },
             data: JSON.stringify(script),
             success: this.props.closeFn(),
             error: this.props.closeFn()
           }),
           error: console.log('error')
         });
       }
    }

  render() {
    return (
      <div>
        <h1> Edit Prescription Reminder </h1>
        <div>
          <div className="script-form-frame">
            <h3> Current Drug: {this.state.currentDrug} </h3>
            <div  className="script-form-fields">
              <input
              onChange={this.updateDrugName}
              defaultValue={this.state.currentDrug}
              // placeholder='Name'
              />
              <h8 className='required'> (required) </h8>
            </div>
          </div>
          <div className="script-form-frame">
            <h3>Dosage</h3>
            <div className="script-form-fields">
              <input
              className='dosageInput'
              onChange={this.handleDoseAmount}
              defaultValue={this.state.dosageAmt}
              // placeholder='Dosage (e.g. if "Take 1 tablet", type "1")'
              />
              <select className="dropdown-replacement" value={this.state.dosageMeasure} onChange={this.handleDoseMeasurement}>
                <option>mg</option>
                <option>mL</option>
                <option>tablet</option>
              </select>
            </div>
          </div>
          <div className="script-form-frame">
              <h3> Refill Date</h3>
              <div  className="script-form-fields">
                <Calendar format='MM/DD/YYYY' date={this.state.date} onChange= {this.handleRefillDate}/>
                <span className={this.state.date ? "" : "hidden"}></span>
                {/* You selected {this.state.date} */}
              </div>
          </div>
          <div className="script-form-frame">
            <h3>Frequency</h3>
            <div className="script-form-fields">
              <select className="dropdown-replacement" value={this.state.scheduleFreq} onChange={this.handleFrequency}>
                <option>1x</option>
                <option>2x</option>
                <option>3x</option>
              </select>
                per
              <select className="dropdown-replacement" value={this.state.scheduleDayWeek} onChange={this.handleScheduleDayWeek}>
                <option>day</option>
                <option>week</option>
              </select>
            </div>
          </div>
          <div className="script-form-frame">
            <div className="reminder">
              <h3> Reminder Time 1</h3>
              <Kronos time={this.state.reminderTime1} defaultValue={this.state.reminderTime1} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime1}/>
              <h8 className='required'> (required) </h8>
            </div>
            <div className={(this.state.hasTwo ? 'reminder' : 'hidden')}>
              <h3> Reminder Time 2</h3>
              <Kronos time={this.state.reminderTime2} defaultValue={this.state.reminderTime2} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime2}/>
              <h8 className='required'> (required) </h8>
            </div>
            <div className={this.state.hasThree ? 'reminder' : 'hidden'}>
              <h3> Reminder Time 3</h3>
              <Kronos time={this.state.reminderTime3} defaultValue={this.state.reminderTime3} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime3}/>
              <h8 className='required'> (required) </h8>
            </div>
            <div className='clear'>
              <Button bsStyle="info" onClick={this.submitForm}> Remind Me </Button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
