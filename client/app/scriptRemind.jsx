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

var date = new Date().toISOString();

export default class ScriptRemindView extends React.Component {
  // _id
  // dosage
  // frequency
  // name
  // refill
  // reminderID
  // reminderTime

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
      "currentDrug": "",
      "dosageAmt": 0,
      "dosageMeasure": 'mg',
      "date": date,
      "reminderTime1": null,
      "reminderTime2": null,
      "reminderTime3": null,
      "scheduleFreq": "1x",
      "scheduleDayWeek": "day",
      "hasTwo": false,
      "hasThree": false,
      "nameIsValid": false,
      "dosageIsValid": false,
      "refillDateIsValid": false,
      "formIsValid": true
    };

  var date = moment(new Date()).format("MM-DD-YYYY")
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

  }

    updateDrugName(event){
      if (event.target.value.length > 0) {
        this.setState({
          currentDrug: event.target.value,
          nameIsValid: true
        });
      } else {
        this.setState({
          currentDrug: event.target.value,
          nameIsValid: false
        });
      }
    }

    handleRefillDate(date) {
      var then = moment(date, "MM-DD-YYYY")
      var now = moment(new Date()).format("MM-DD-YYYY");
      console.log(then.isAfter(now));
      if (then.isAfter(now)) {
        this.setState({
          "date": date,
          "refillDateIsValid": true
        });
      } else {
        this.setState({
          "date": date,
          "refillDateIsValid": false
        });
      }
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
      if (!Number.isNaN(Number(amount.target.value))) {
        this.setState({
          dosageAmt: amount.target.value,
          dosageIsValid: true
        });
      } else {
        this.setState({
          dosageIsValid: false
        });
      }
    }

    handleFrequency(frequency) {
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

    handleReminderTime1(time){
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

      if(!this.state.nameIsValid || !this.state.refillDateIsValid || !this.state.dosageIsValid){
        this.setState({formIsValid: false});
      } else {
        var script = {
          "name": this.state.currentDrug,
          "dosage": this.state.dosageAmt + ' ' + this.state.dosageMeasure,
          "refill": new Date(moment(this.state.date, "MM-DD-YYYY")).toISOString(),
          "frequency": this.state.scheduleFreq + ' per ' + this.state.scheduleDayWeek,
          "reminderTime": [this.state.reminderTime1, this.state.reminderTime2, this.state.reminderTime3],
          "username": window.localStorage.username
        };

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
          });
      }
    }

  render() {
    return (
      <div className='script-form-frame'>
        <div>
          <h3>Prescription name</h3>
          <input
          onChange={this.updateDrugName}
          placeholder='name'
          // placeholder={this.state.currentDrug}
          defaultValue={this.state.currentDrug}
          />
          <h8 className='required'> (required) </h8>
          <div className={this.state.nameIsValid ? "hidden" : "invalid"}> Please enter valid input </div>
        </div>
        <div>
          <h3>Dosage</h3>
          <div>
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
            <div className={this.state.dosageIsValid ? "hidden" : "invalid"}> Please enter valid input </div>
          </div>
        </div>
        <div>
            <h3> Refill Date</h3>
            <div>
              <Calendar format='MM/DD/YYYY' date={this.state.date} onChange= {this.handleRefillDate}/>
              <span className={this.state.date ? "" : "hidden"}></span>
              {/* <span className={this.state.date ? "" : "hidden"}>You selected {this.state.date}</span> */}
            </div>
            <div className={this.state.refillDateIsValid ? "hidden" : "invalid"}> Please enter valid input </div>
        </div>
        <div>
          <h3>Frequency</h3>
          <div>
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
        <div>
           <div className="reminder">
             <h3> Reminder Time 1</h3>
             <Kronos time={this.state.reminderTime1} value='' placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime1}/>
             <h8 className='required'> (required) </h8>
           </div>
           <div className={(this.state.hasTwo ? 'reminder' : 'hidden')}>
             <h3> Reminder Time 2</h3>
             <Kronos time={this.state.reminderTime2} value='' placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime2}/>
             <h8 className='required'> (required) </h8>
           </div>
           <div className={this.state.hasThree ? 'reminder' : 'hidden'}>
             <h3> Reminder Time 3</h3>
             <Kronos time={this.state.reminderTime3} value='' placeholder={"Click to select a time"} onChangeDateTime={this.handleReminderTime3}/>
             <h8 className='required'> (required) </h8>
           </div>
           <div className='clear'>
             <Button bsStyle="info" onClick={this.submitForm}>Remind Me</Button>
             <h6 className={(this.state.formIsValid ? 'hidden' : 'invalid')}> Some of your data is not valid.  Please check above. </h6>
           </div>
        </div>
      </div>
    );
  }
}