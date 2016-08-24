import React, { Component } from 'react';
import FilteredMultiSelect from 'react-filtered-multiselect';
import $ from 'jquery';
import Navigate from './navigate.jsx';
import Modal from 'react-modal';
import SymptomEntryModal from './symptomEntryModal.jsx';
import {Button, ButtonToolbar } from 'react-bootstrap';
import BrainView from './brainView.jsx';



 var SYMPTOMS = [
  {id: 1, name: 'Dizziness'},
  {id: 2, name: 'Faintness'},
  {id: 3, name: 'Headaches'},
  {id: 4, name: 'Bags/dark circles around eyes'},
  {id: 5, name: 'Blurred/tunnel vision'},
  {id: 6, name: 'Swollen, reddened, sticky eyelids'},
  {id: 7, name: 'Watery/itchy eyes'},
  {id: 8, name: 'Drainage from ear'},
  {id: 9, name: 'Earaches, ear infections'},
  {id: 10, name: 'Itchy ears'},
  {id: 11, name: 'Excessive mucus'},
  {id: 12, name: 'Hay fever'},
  {id: 13, name: 'Sinus problems'},
  {id: 14, name: 'Sneezing attacks'},
  {id: 15, name: 'Stuffy nose'},
  {id: 16, name: 'Canker sores'},
  {id: 17, name: 'Chronic coughing'},
  {id: 18, name: 'Frequent need to clear throat'},
  {id: 19, name: 'Sore throat, hoarseness'},
  {id: 20, name: 'Swollen/discolored tongue, gums, lips'},
  {id: 21, name: 'Acne'},
  {id: 22, name: 'Excessive sweating'},
  {id: 23, name: 'Flushing'},
  {id: 24, name: 'Hair loss'},
  {id: 25, name: 'Hives, rashes, dry skin'},
  {id: 26, name: 'Asthma'},
  {id: 27, name: 'Bronchitis'},
  {id: 28, name: 'Chest congestion'},
  {id: 29, name: 'Difficulty breathing'},
  {id: 30, name: 'Shortness of breath'},
  {id: 31, name: 'Joints/Muscle'},
  {id: 32, name: 'Stiffness/limitation of movement'},
  {id: 33, name: 'Feeling of weakness'},
  {id: 34, name: 'Pain/aches in joints'},
  {id: 35, name: 'Pain/aches in muscles'},
  {id: 36, name: 'Apathy, lethargy'},
  {id: 37, name: 'Fatigue, sluggishness'},
  {id: 38, name: 'Hyperactivity'},
  {id: 39, name: 'Restlessness'},
  {id: 40, name: 'Insomnia'},
  {id: 41, name: 'Confusion'},
  {id: 42, name: 'Difficulty making decisions'},
  {id: 43, name: 'Learning disabilities'},
  {id: 44, name: 'Poor concentration'},
  {id: 45, name: 'Poor memory'},
  {id: 46, name: 'Poor physical coordination'},
  {id: 47, name: 'Slurred speech'},
  {id: 48, name: 'Stuttering/stammering'},
  {id: 49, name: 'Anxiety, fear, nervousness'},
  {id: 50, name: 'Depression'},
  {id: 51, name: 'Mood swings'},
  {id: 52, name: 'Lack of Energy/Activity'},
  {id: 53, name: 'Binge eating/drinking'},
  {id: 54, name: 'Craving certain foods'},
  {id: 55, name: 'Excessive weight'},
  {id: 56, name: 'Underweight'},
  {id: 57, name: 'Water retention'},
  {id: 58, name: 'Belching, passing gas'},
  {id: 59, name: 'Bloating'},
  {id: 60, name: 'Constipation'},
  {id: 61, name: 'Diarrhea'},
  {id: 62, name: 'Heartburn'},
  {id: 63, name: 'Intestinal/stomach pain'},
  {id: 64, name: 'Nausea, vomiting'},
  {id: 65, name: 'Genital itch/discharge'},
  {id: 66, name: 'Hot flashes/night sweats'},
  {id: 67, name: 'Loss of libido'},
  {id: 68, name: 'Painful menstrual cycle'},
  {id: 69, name: 'Premenstrual syndrome'},
  {id: 70, name: 'Short/long menstruation'},
  {id: 71, name: 'Early onset of menopause'},
  {id: 72, name: 'Fertility issues'},
  {id: 73, name: 'Difficulty starting/stopping urination'},
  {id: 74, name: 'Difficulty getting/maintaining erection'},
  {id: 75, name: 'Loss of libido'},
  {id: 76, name: 'Fertility issues'},
  {id: 77, name: 'Chest pain'},
  {id: 78, name: 'Frequent illness'},
  {id: 79, name: 'Frequent/urgent urination'},
  {id: 80, name: 'Irregular/skipped heartbeat'},
  {id: 81, name: 'Rapid/pounding heartbeat'},
  {id: 82, name: 'Numbness/tingling in hands'}
];

export default class SymptomEntryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalStyles: {
        overlay : {
          position          : 'fixed',
          top               : 0,
          left              : 0,
          right             : 0,
          bottom            : 0,
          backgroundColor   : 'rgba(255, 255, 255, 0.75)'
        },
        content : {
          position                   : 'absolute',
          top                        : '10%',
          left                       : '10%',
          right                      : '30%',
          bottom                     : '30%',
          border                     : '4px solid #ccc',
          background                 : '#fff',
          overflow                   : 'auto',
          WebkitOverflowScrolling    : 'touch',
          borderRadius               : '4px',
          outline                    : 'none',
          padding                    : '20px'

        }
      },
      selectedSymptoms: [],
      recs: [],
      symptomsWereSubmitted: false,
      modalIsOpen: false,
      // zipcode: this.props.zipcode,
      brainState: {output: []}
    };
    this.handleDeselect = this.handleDeselect.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.submitSymptoms = this.submitSymptoms.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleRecData = this.handleRecData.bind(this);
    this.exitModal = this.exitModal.bind(this);
    this.setBrainState = this.setBrainState.bind(this);
    this.clearSymptoms = this.clearSymptoms.bind(this);
  };

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/api/brain/print',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(this.setBrainState)
  }

  clearSymptoms() {
    this.setState({selectedSymptoms: []});
  }

  setBrainState(state) {
    this.setState({brainState: state});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  exitModal() {
    this.setState({selectedSymptoms: []});
    this.setState({recs: []});
    this.closeModal();
  }

  handleDeselect(index) {
    var selectedSymptoms = this.state.selectedSymptoms.slice();
    selectedSymptoms.splice(index, 1);
    this.setState({ selectedSymptoms });
  };

  handleRecData(recData) {
    console.log(recData)
    this.setState({recs: recData});
    this.openModal();
  }

  handleSelectionChange(selectedSymptoms) {
    this.setState({ selectedSymptoms });
  };

  submitSymptoms() {
    console.log('you chose: ', this.state.selectedSymptoms);
    this.setState({symptomsWereSubmitted: true});
    $.ajax({
      type: 'POST',
      url: '/api/brain/recommend',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        username: window.localStorage.getItem("username"),
        symptoms: this.state.selectedSymptoms}),
      success: this.handleRecData,
      error: function(err) {
        console.log('Congrats you are superhuman', err);
      }
    })
  };

  render() {
    var { selectedSymptoms } = this.state;

    return (
      <div className="symptom-container">
        <div className={!this.state.symptomsWereSubmitted ? "" : "hidden"}>
          <div className='symptom-select-header'>
            <h4>Please select your symptoms from the list below.</h4>
            <div className='modal-button-close' onClick={this.props.closeFn}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
          </div>
          <FilteredMultiSelect
            classNames={{
              buttonActive: 'symptom-select-button--active',
              button: 'symptom-select-button--inactive',
              filter: 'symptom-select-filter',
              select: 'symptom-select-select'
            }}
            onChange={this.handleSelectionChange}
            options={SYMPTOMS}
            selectedOptions={selectedSymptoms}
            textProp='name'
            size={20}
            valueProp='id' />
          <div className="selected-symptoms-container">
            {selectedSymptoms.length === 0 && <p>(nothing selected yet)</p>}
            {selectedSymptoms.length > 0 && <ul className="selected-symptoms">
              {selectedSymptoms.map((symptom, i) =>
              <Button key={symptom.id} bsStyle="primary" bsSize='small' onClick={this.handleDeselect.bind(null, i)}>
                <div>
                  {`${symptom.name} `}  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </div>
              </Button>)}
            </ul>}
            <div className='symptom-submit-buttons'>
              <div className='clear-symptoms'>
                <Button bsStyle="danger"  bsSize="sm" onClick={this.clearSymptoms}>Clear all</Button>
              </div>
              <div className='submit-symptoms'>
                <Button bsStyle="success"  bsSize="sm" onClick={this.submitSymptoms}>Submit!</Button>
             </div>
           </div>
          </div>
        </div>
        <div className={this.state.symptomsWereSubmitted && !this.state.modalIsOpen ? "" : "hidden"}>
          <BrainView brainState={this.state.brainState} />
        </div>
        <div className={"brain-container " + this.state.modalIsOpen ? "" : "hidden"}>
          <SymptomEntryModal closeFn={this.props.closeFn} zipcode={this.props.zipcode} brainState={this.state.brainState} symptoms={this.state.selectedSymptoms} recommendations={this.state.recs} />
        </div>
      </div>
    );
  }
}
