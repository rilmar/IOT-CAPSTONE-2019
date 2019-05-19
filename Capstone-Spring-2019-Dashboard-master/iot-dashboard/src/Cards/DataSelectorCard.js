import React, { Component } from 'react'
import { DropdownButton, Container, Row, Col } from 'react-bootstrap'
import * as d3 from "d3";
import DatePicker from 'react-datetime'

import * as DS from '../DataSource.js'
import LineChart from '../LineChart/LineChart.js'
import * as APIProvider from '../APIProvider'

class DataSelectorCard extends Component {
  constructor(props) {
    super(props);
    this.updateDevice = this.updateDevice.bind(this);
    this.updateDataType = this.updateDataType.bind(this);
    this.handleDateOne = this.handleDateOne.bind(this);
    this.handleDateTwo = this.handleDateTwo.bind(this);
    this.onAnalysisSubmit = this.onAnalysisSubmit.bind(this);
    this.state = {
      ds_card_loc_title: "Select Location",
      ds_card_source_title: "Select Source",
      time_start: null,
      time_end: null,
      analysisData: [],
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deviceID){
      this.updateDevice(nextProps.deviceID, null)
    }
    if(nextProps.dataType){
      this.updateDataType(nextProps.dataType, null)
    }
  }

  updateDevice(evtKey, evt) {
    this.setState({
      deviceID: evtKey,
      ds_card_loc_title: DS.names[evtKey],
      dtList: this.props.devices[evtKey]
    }, function () {
      console.log(this.state.deviceID);
      console.log(this.state.dtList)
    });;
    this.setState({
      dt: null,
      ds_card_source_title: "Select Source"
    });
  }

  updateDataType(evtKey, evt) {
    this.setState({
      dataType: evtKey,
      ds_card_source_title: DS.names[evtKey]
    }, function () {
      console.log(this.state.dataType);
    });;

  }

  handleDateOne(date) {
    try {
      let startDate = date.format('YYYY-MM-DD')
      this.setState({ time_start: startDate })
    }
    catch (err) {
      this.setState({ time_start: null })
      alert("Please enter a date in proper format!");
    }
  }

  handleDateTwo(date) {
    try {
      let endDate = date.format('YYYY-MM-DD')
      this.setState({ time_end: endDate })
    }
    catch (err) {
      this.setState({ time_end: null })
      alert("Please enter a date in proper format!");
    }
  }

  onAnalysisSubmit() {
    //TODO make API call here
    if (this.state.time_start !== null && this.state.time_end !== null && this.state.deviceID !== null && this.state.dataType !== null) {
      if (this.state.time_start > this.state.time_end) {
        this.setState({ mid: this.state.time_start })
        this.setState({ time_start: this.state.time_end })
        this.setState({ time_end: this.state.mid })
      }

      APIProvider.getAnalysisData((err, data) => {
        let arr = []
        data.forEach((item, index) => {
          let newData = {
            value: Number(item.value),
            date: d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(item.time)
          }
          arr.push(newData)
        })
        console.log(arr)
        this.setState({ analysisData: arr })
      }, this.state.deviceID, this.state.dataType, this.state.time_start, this.state.time_end)
    }
    else {
      alert("Please fill out all the inputs!");
    }
  }

  render() {
    return (
      <div>
          <div>
            <div className="row">
              <div className="col-sm-4">
                <div className="cardTabNonHome" height="400">
                  <Container>
                    <Row>
                      <Col>
                        <DropdownButton id="dropdown-basic-button" title={this.state.ds_card_loc_title} onSelect={this.updateDevice}>
                          <DS.DevList devices={this.props.devices} />
                        </DropdownButton>
                      </Col>
                      <Col>
                        <DropdownButton disabled={!this.state.deviceID} id="dropdown-basic-button" title={this.state.ds_card_source_title} onSelect={this.updateDataType}>
                          <DS.DTList dev={this.state.deviceID} datatypes={this.state.dtList}></DS.DTList>
                        </DropdownButton>
                      </Col>
                    </Row>
                  </Container>
                  <Container>
                    <div className="dateHolder">
                      Time 1: <DatePicker className="date-input" onChange={this.handleDateOne}></DatePicker>
                    </div>
                    <div className="dateHolder">
                      Time 2: <DatePicker className="date-input" onChange={this.handleDateTwo}></DatePicker>
                    </div>
                  </Container>
                  <Container>
                    <div className="subButton">
                      <button className="btn btn-primary submitButton" onClick={this.onAnalysisSubmit}>Submit</button>
                    </div>
                    <br></br>
                  </Container>
                </div>
              </div>

              <div className="col-sm-8">
                <div className="cardTabNonHome">
                  <Container>
                    <LineChart width="800" height="550" dateFormat="%d" data={this.state.analysisData} />
                  </Container>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default DataSelectorCard