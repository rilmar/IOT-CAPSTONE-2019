import React, { Component } from 'react'
import { DropdownButton, Container, Row, Col, Dropdown } from 'react-bootstrap'
import * as d3 from "d3";
import DatePicker from 'react-datetime'

import * as DS from '../DataSource.js'
import LineChart from '../LineChart/LineChart.js'
import * as APIProvider from '../APIProvider'

class KPIDataSelectorCard extends Component {
  constructor(props) {
    super(props);
    this.onKPISubmit = this.onKPISubmit.bind(this);
    this.updateKPIDevice = this.updateKPIDevice.bind(this);
    this.updateKPIDataType = this.updateKPIDataType.bind(this);
    this.handleKPIDateOne = this.handleKPIDateOne.bind(this);
    this.handleKPIDateTwo = this.handleKPIDateTwo.bind(this);
    this.updateKPIComparison = this.updateKPIComparison.bind(this);
    this.handleKPICompValue = this.handleKPICompValue.bind(this);
    this.renderComparisonDropdown = this.renderComparisonDropdown.bind(this);
    this.filterGreater = this.filterGreater.bind(this);
    this.filterLesser = this.filterLesser.bind(this);
    this.filterEqual = this.filterEqual.bind(this);

    this.state = {
      deviceID: this.props.deviceID || "device1",
      dataType: this.props.dataType || "temp",
      ds_card_loc_title: "Select Location",
      ds_card_source_title: "Select Source",
      time_start: null,
      time_end: null,
      comparison_title: "Comparison",
      comparison: null,
      comp_value: "",
      comp_value_title: "",
      analysisData: [],
      comparators: ["<", ">", "="]
    }
  }

  onKPISubmit() {
    //TODO make API call here
    if (this.state.time_start !== null && this.state.time_end !== null && this.state.deviceID !== null && this.state.dataType !== null &&
       this.state.comparison !== null &&this.state.comp_value !== "") {
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

        let tmp;
        switch(this.state.comparison) {
          case ">":
            tmp = arr.filter(this.filterGreater)
            break;
          case "<":
          tmp = arr.filter(this.filterLesser)
            break;
          case "=":
            tmp = arr.filter(this.filterEqual)
            break;
          default:
            tmp = arr
        }
        this.setState({ analysisData: tmp })
      }, this.state.deviceID, this.state.dataType, this.state.time_start, this.state.time_end)
    }
    else {
      alert("Please fill out all the inputs!");
    }
  }

  filterGreater(x){
    return x.value > this.state.comp_value
  }

  filterLesser(x){
    return x.value < this.state.comp_value
  }

  filterEqual(x){
    return x.value === this.state.comp_value
  }

  updateKPIDevice(evtKey, evt) {
      this.setState({
        dev: evtKey,
        ds_card_loc_title: DS.names[evtKey],
        dtList: this.props.devices[evtKey]
      }, function () {
        console.log(this.state.dev);
        console.log(this.state.dtList);
      });;
      this.setState({
        dt: null,
        ds_card_source_title: "Select Source"
      });
  }

  updateKPIDataType(evtKey, evt) {
    try {
      this.setState({
        dt: evtKey,
        ds_card_source_title: DS.names[evtKey]
      }, function () {
        console.log(this.state.dt);
      });;
    }
    catch {
      alert("Please select a Device first!");
    }

  }

  handleKPIDateOne(date) {
    try {
      let startDate = date.format('YYYY-MM-DD')
      this.setState({ time_start: startDate })
    }
    catch (err) {
      this.setState({ time_start: null })
      alert("Please enter a date in proper format!");
    }
  }

  handleKPIDateTwo(date) {
    try {
      let endDate = date.format('YYYY-MM-DD')
      this.setState({ time_end: endDate })
    }
    catch (err) {
      this.setState({ time_end: null })
      alert("Please enter a date in proper format!");
    }
  }

  updateKPIComparison(comp) {
    try {
      this.setState({
        comparison: comp,
        comparison_title: comp
      }, function () {
        console.log(this.state.comparison);
        console.log(this.state.comparison_title);
      });;
    }
    catch {
      alert("Something went wrong with the comparison operator");
    }
  }

  handleKPICompValue(event) {
    let compVal = parseFloat(event.target.value);
    if(isNaN(compVal)) {
      this.setState({comp_value: ""})
      this.setState({comp_value_title: event.target.value});
    }
    else {
      this.setState({ comp_value: compVal });
      this.setState({comp_value_title: compVal});
    }
    
  }

  renderComparisonDropdown() {
    return this.state.comparators.map((comp, idx) =>
      <Dropdown.Item key={idx} eventKey={comp}>{comp}</Dropdown.Item>
    )
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
                        <DropdownButton id="dropdown-basic-button" title={this.state.ds_card_loc_title} onSelect={this.updateKPIDevice}>
                          <DS.DevList devices={this.props.devices} />
                        </DropdownButton>
                      </Col>
                      <Col>
                        <DropdownButton disabled={!this.state.dev} id="dropdown-basic-button" title={this.state.ds_card_source_title} onSelect={this.updateKPIDataType}>
                          <DS.DTList dev={this.state.dev} datatypes={this.state.dtList}></DS.DTList>
                        </DropdownButton>
                      </Col>
                    </Row>
                  </Container>
                  <Container>
                    <div className="dateHolder">
                      <p>Time 1:</p>
                      <DatePicker className="date-input" onChange={this.handleKPIDateOne} ></DatePicker>
                    </div>
                    <div className="dateHolder">
                      <p>Time 2:</p>
                      <DatePicker className="date-input" onChange={this.handleKPIDateTwo}></DatePicker>
                    </div>
                  </Container>
                  <Container>
                    <div className="kpi-comparison-holder">
                      <div className="kpi-comparison-dropdown">
                        <DropdownButton id="dropdown-basic-button" title={this.state.comparison_title} onSelect={this.updateKPIComparison}>
                          {this.renderComparisonDropdown()}
                        </DropdownButton>
                      </div>
                      <p>Value:</p>
                      <input className="kpi-value" type="number" id="values"value={this.state.comp_value_title} onChange={this.handleKPICompValue}></input> 
                    </div>
                  </Container>
                  <Container>
                    <div className="subButton">
                      <button className="btn btn-primary submitButton" onClick={this.onKPISubmit}>Submit</button>
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

export default KPIDataSelectorCard