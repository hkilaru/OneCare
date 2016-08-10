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

export default class ScriptRemindView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
      "currentDrug": "None",
      "dosageAmt": 0,
      "dosageMeasure": 'mg',
      "date": date,
      "reminderTime": [],
      "scheduleFreq": "1x",
      "scheduleDayWeek": "day",
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
  this.handleReminderTime = this.handleReminderTime.bind(this);

  }

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

    handleFrequency(frequency) {
      console.log("current state", this.state);
      console.log("handleFreq called with", frequency.target.value);
      if(frequency.target.value === '2x'){
        this.setState({
          hasTwo: true,
          hasThree: false
        })
      }
      if(frequency.target.value === '3x'){
        this.setState({
          hasTwo: true,
          hasThree: true
        })
      }
      if(frequency.target.value === '1x'){
        this.setState({
          hasTwo: false,
          hasThree: false
        })
      }
      this.setState({
        scheduleFreq: frequency.target.value
      });
    }

    handleReminderTime(time){
      console.log("to IRON MAN format", new Date(moment(time).format()).toISOString());
      var reminderTimes = this.state.remiderTime.slice();
      reminderTimes.push(new Date(moment(time).format()).toISOString());
      console.log("reminder times array!!", reminderTimes);
      this.setState({
        "reminderTime": reminderTimes,
        "invalidReminderTime": true
      });
    }

    submitForm () {

      if(!this.state.invalidName && !this.state.invalidReminderTime){
        alert("Please enter a prescription name and reminder time")
      }
      else if(!this.state.invalidName){
        alert("Please enter a prescription name");
      }
      else if(!this.state.invalidReminderTime){
        alert("Please enter a reminder time");
      }
      else {
        var script = {
          "name": this.state.currentDrug,
          "dosage": this.state.dosageAmt + ' ' + this.state.dosageMeasure,
          "refill": this.state.date,
          "frequency": this.state.scheduleFreq + ' per ' + this.state.scheduleDayWeek,
          "reminderTime": this.state.reminderTime,
          "username": window.localStorage.username
        };
        console.log("submitForm called for: ", script);


        $.ajax({
            type: 'POST',
            url: '/api/reminder/add',
            dataType: 'json',
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(script),
            success: function(data){
              alert("Your prescription was saved.");
              console.log('A reminder was set for: ', data);
            },
            error: function(err){
              alert("Your prescription was saved.");
              console.log('Reminder not set: ', err);
            }
          });
      }
    }

  render() {
    return (
      <div>
        <div>
          <h1> Set a Prescription Reminder </h1>
          <h2> Current Drug: {this.state.currentDrug} </h2>
          <input
          onChange={this.updateDrugName}
          placeholder='Name'
          />
          <h8 className='required'> (required) </h8>
        </div>
        <div>
          <input
          className='dosageInput'
          onChange={this.handleDoseAmount}
          placeholder='Dosage (e.g. if "Take 1 tablet", type "1")'
          />

          <select className="dropdown-replacement" value={this.state.dosageMeasure} onChange={this.handleDoseMeasurement}>
            <option>mg</option>
            <option>mL</option>
            <option>tablet</option>
          </select>
      </div>
        <div>
            <h1> Refill Date</h1>
            <div>
              <Calendar format='MM/DD/YYYY' date={this.state.date} onChange= {this.handleRefillDate}/>
              <h3> You selected {this.state.date} </h3>
            </div>
        </div>
        <div>
          <select className="dropdown-replacement" value={this.state.scheduleFreq} onChange={this.handleFrequency}>
            <option>1x</option>
            <option>2x</option>
            <option>3x</option>
          </select>
          <h3> per </h3>
          <select className="dropdown-replacement" value={this.state.scheduleDayWeek} onChange={this.handleScheduleDayWeek}>
            <option>day</option>
            <option>week</option>
          </select>
        </div>
        <div>
        <div className="reminder">
          <h2> Reminder Time 1</h2>
          <Kronos time={this.state.reminderTime} value={''} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime}/>
          <h8 className='required'> (required) </h8>
        </div>
        <div className={(this.state.hasTwo ? 'reminder' : 'hidden')}>
          <h2> Reminder Time 2</h2>
          <Kronos time={this.state.reminderTime} value={''} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime}/>
          <h8 className='required'> (required) </h8>
        </div>
        <div className={this.state.hasThree ? 'reminder' : 'hidden'}>
          <h2> Reminder Time 3</h2>
          <Kronos time={this.state.reminderTime} value={''} placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime}/>
          <h8 className='required'> (required) </h8>
        </div>
        </div>
        <div className='clear'>
          <button className= "remindBtn" onClick={this.submitForm}> Remind Me </button>
        </div>

      </div>

    );
  }
}
