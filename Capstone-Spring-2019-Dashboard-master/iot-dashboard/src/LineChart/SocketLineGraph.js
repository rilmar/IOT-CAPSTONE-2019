import React, {Component} from 'react';
import LineChart from './LineChart.js'
import * as d3 from "d3";
import * as socketProvider from '../WebSocketProvider'

class SocketLineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
          endpoint: process.env.REACT_APP_TELEMETRY_URL,
          data:[],
          deviceID: this.props.deviceID || "device1", //default for development sake
          dataType: this.props.dataType || "temp", //default for development sake
          datalength: this.props.datalength || 50,
        }
    }

    componentDidMount() {
      socketProvider.subscribeToTelemetry((err, telemetry) => {
        let newData = this.state.data
        if(newData.length > this.state.datalength) {
          newData.shift();
        }
        let d = {
            value: telemetry.value, 
            date: d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(telemetry.time)
        };
        newData.push(d);
        this.setState({data: newData});
      }, this.state.deviceID, this.state.dataType)
    }

    render() {
      return (
        <div className="App">
          <LineChart width="300" height="300" dateFormat="%S" data={this.state.data} />
        </div>
      );
    }
}

export default SocketLineGraph;