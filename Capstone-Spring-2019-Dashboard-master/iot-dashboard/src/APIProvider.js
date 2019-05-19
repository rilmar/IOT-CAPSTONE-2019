/*
Functions to access different parts of the historical data.
*/

const base_url = process.env.REACT_APP_TELEMETRY_URL ? process.env.REACT_APP_TELEMETRY_URL + '/api/data' : '/api/data';

// Access the device map to pass to front end components for dropdown rendering
// Data is a hashmap with the format: {device: [datatype1, datatype2]}
export function getDeviceMap(callback) {
  simpleAPICall('/devMap', callback)
}

export function getDeviceList(callback) {
  simpleAPICall('/devList', callback)
}

function simpleAPICall(endpoint, callback) {
  fetch(base_url+endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }).then(resp => {
    if (resp.ok) {
      resp.json().then(data => {
        callback(null, data)
      });
    } else {
      resp.then(err => {
        alert("Failed to fetch API: " + endpoint, err);
      });
    }
  }).catch(err => {
    alert('Error in API ' + endpoint, err);
  });
}

// Receive the data requested
// Query parameters include: device, datatype, start time, and end time
export function getAnalysisData(callback, deviceID, dataType, start, end){
  fetch(base_url + '?device=' + deviceID + "&datatype=" + dataType + 
      "&start=" + start + "&end=" + end, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(resp => {
      if (resp.ok) {
        resp.json().then(data => {
          let d = data.records
          callback(null, d)
        });
      } else {
        resp.then(err => {
          alert("Failed to fetch data:", err);
        });
      }
    }).catch(err => {
      alert('Error fetching analysis data: ', err);
    });
}

  // loadDatatypes() {
  //   fetch(base_url, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     }
  //   }).then(resp => {
  //     if (resp.ok) {
  //       resp.json().then(data => {
  //         let dtArray = [];
  //         let dev = this.props.dev;
  //         if (dev) {
  //           console.log(data)
  //           data.records.forEach(device => {
  //             if (device['device'] === dev) {
  //               dtArray = Object.keys(device['datatype'][0]);
  //             }
  //           });
  //         }
  //         this.setState({datatypes: dtArray});
  //       });
  //     } else {
  //       resp.then(err => {
  //         alert("Failed to fetch datatypes:", err);
  //       });
  //     }
  //   }).catch(err => {
  //     alert('Error in loadDatatypes: ', err);
  //   });
  // }