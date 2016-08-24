import React from 'react';
import Modal from 'react-modal';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
    };
  }

  componentDidMount(){
    console.log(this.props)
  }



  render() {
    return (
      // var srcURL = "https://www.google.com/maps/embed/v1/search?key=AIzaSyCnPK2o-dXX9hTQdMA4dTXIezhxyIzfRB0&q=pharmacy+near+" + {this.state.zipcode}
      // if inputzipcode state is 0 then use the users zipcode, otherwise use the inputzipcode
      <div className="map-container">
        <iframe
        width="95%"
        height="400"
        // frameborder="0"
        // style="border:0"
        src={"https://www.google.com/maps/embed/v1/search?key=AIzaSyCnPK2o-dXX9hTQdMA4dTXIezhxyIzfRB0&q=pharmacy+near+"+this.props.zipcode}>
        </iframe>
      </div>
    );
  }
}
