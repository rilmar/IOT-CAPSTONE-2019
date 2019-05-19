import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap';

/*
Sample functions to access different parts of the historical data.
These functions were mainly used for prototype work.
*/

// Mapping of variables to nicer descriptions for display on graphs
export const names = {
	"device1": "Device 1",
  "device2": "Device 2",
  "device3": "Device 3",
	"temp": "Temperature",
  "wind": "Wind",
  "humidity": "Humidity"
};

// Grab the list of devices from the database
// Render a list of those devices in the dropdown component
export class DevList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      devices: this.props.devices,
      deviceList: []
    };
  }

  render() {
    this.state.deviceList.sort();
    return(
      Object.keys(this.props.devices).map((device, idx) =>
        <Dropdown.Item key={idx} eventKey={device}>{names[device]}</Dropdown.Item>)
    )
  }

}

// Return the datatypes for a particular device
// Render a list of those datatypes in the dropdown component
export class DTList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      datatypes: this.props.datatypes || [],
    };
  }

  render() {
    this.state.datatypes.sort();
    return(
      this.props.datatypes.map((datatype, idx) =>
        <Dropdown.Item key={idx} eventKey={datatype}>{names[datatype]}</Dropdown.Item>)
    )
  }

}
