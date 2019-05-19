import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react'
import LiveDataDisplayCard from './Cards/LiveDataDisplayCard'
import DataSelectorCard from './Cards/DataSelectorCard'
import KPIDataSelectorCard from './Cards/KPIDataSelectorCard'
import * as APIProvider from './APIProvider'

class ControlledTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deviceMap: [],
      devices: {},
      key: "home",
      device: "", 
      dataType: "",
    }
    this.generateHomeCards = this.generateHomeCards.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.switchTabCallback = this.switchTabCallback.bind(this)
    this.generateAnalysisTab = this.generateAnalysisTab.bind(this)
  }

  componentDidMount() {
    APIProvider.getDeviceMap((err, devMap) => {
      let x = devMap.records[0];
      this.setState({ devices: x })

      //comes in format {device: [dt1, dt2]}
      //convert to {deviceID: device, dataType: []} for easier rendering in jsx
      let tempData = []
      for (var key in x) {
        if (x.hasOwnProperty(key)) {
          tempData.push({
            deviceID: key,
            dataTypes: x[key]
          })
        }
      }
      this.setState({ deviceMap: tempData })
    })
  }

  switchTabCallback(tab, device, dataType) {
    this.setState({
      device: device, 
      dataType: dataType,
    }, () => {this.handleSelect(tab)})
  }

  generateHomeCards() {
    return this.state.deviceMap.map((c, id) => (
      <div key={id} className="card-row">
        {c.dataTypes.map((dat, idx) => (
          <LiveDataDisplayCard key={idx} deviceID={c.deviceID} dataType={dat} callback={this.switchTabCallback}></LiveDataDisplayCard>
        ))}
      </div>
    ))
  }

  generateAnalysisTab() {
    return <DataSelectorCard devices={this.state.devices} deviceID={this.state.device} dataType={this.state.dataType}></DataSelectorCard>
  }

  handleSelect(key) {
    this.setState({key: key});
  }



  render() {
    return (
      <Tabs id="controlled-tab" activeKey={this.state.key} onSelect={this.handleSelect}>
        <Tab eventKey="home" title="Home" >
          {/*page contents*/}
          <div className="cardContainer">
            {this.generateHomeCards()}
          </div>
        </Tab>
        <Tab eventKey="analysis" title="Analysis">
          {/*page contents*/}
          <div className="">
            {this.generateAnalysisTab()}
          </div>
        </Tab>
        <Tab eventKey="performanceAssessment" title="Performance Assessment">
          {/*page contents*/}
          {/*test to see how the graph handles grid*/}
          <div className="">
            <KPIDataSelectorCard devices={this.state.devices}></KPIDataSelectorCard>
          </div>

        </Tab>
        <Tab eventKey="export" title="Export" disabled>
          {/*page contents*/}
          <p>You wont see this.</p>
        </Tab>
      </Tabs>

    )
  }
}

export default ControlledTabs