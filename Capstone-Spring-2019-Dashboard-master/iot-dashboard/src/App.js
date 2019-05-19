import React, { Component } from 'react'
import './App.scss'
import './react-datetime.scss'

import ControlledTabs from './Tabs'

const base_url = process.env.REACT_APP_TELEMETRY_URL ? process.env.REACT_APP_TELEMETRY_URL + '/api/data' : '/api/data';

class App extends Component {
  state = {
    devices: [],
    datatypes: [],
  }

  componentDidMount(){
    this.loadDevices()
    //this.loadDatatypes() //need to create a device map
  }

  /**
   * We may want to create an API call that gives a full map of everything, device and datatypes 
   * and then floats that information throughout the entire application
   */

  loadDevices(){
    fetch(base_url+'/devList', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(resp => {
      if (resp.ok) {
        resp.json().then(data => {
          let devArray = [];
          data.records.forEach(device => {
            devArray.push(device);
          });
          this.setState({devices: devArray});
        });
      } else {
        resp.then(err => {
          alert("Failed to fetch devices:", err);
        });
      }
    }).catch(err => {
      alert('Error in loadDevices: ', err);
    });
  }

  loadDatatypes() {
    fetch(base_url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(resp => {
      if (resp.ok) {
        resp.json().then(data => {
          let dtArray = [];
          let dev = this.props.dev;
          if (dev) {
            data.records.forEach(device => {
              if (device['device'] === dev) {
                dtArray = Object.keys(device['datatype'][0]);
              }
            });
          }
          this.setState({datatypes: dtArray});
          console.log(dtArray)
          console.log("----")
        });
      } else {
        resp.then(err => {
          alert("Failed to fetch datatypes:", err);
        });
      }
    }).catch(err => {
      alert('Error in loadDatatypes: ', err);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ControlledTabs></ControlledTabs>
        </header>
      </div>
    );
  }
}

export default App;

