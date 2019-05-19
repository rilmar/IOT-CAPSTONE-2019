import React, { Component } from 'react'
import {Container, Row} from 'react-bootstrap'
import SocketLineGraph from '../LineChart/SocketLineGraph'
import Names from '../Names'

class LiveDataDisplayCard extends Component {
  constructor(props) {
    super(props);
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleCallback() {
    if(this.props.callback) {
      this.props.callback("analysis", this.props.deviceID, this.props.dataType)
    }
  }

  render() {
    return (
      <div>
          <div className='cardTab' onClick={() => {this.handleCallback()}}>
            <Container>
              <Row>
                {Names[this.props.deviceID]}
              </Row>
              <Row>
                {Names[this.props.dataType]}
              </Row>
            </Container>
            <SocketLineGraph deviceID={this.props.deviceID} dataType={this.props.dataType}></SocketLineGraph>
          </div>
      </div>
    )
  }
}

export default LiveDataDisplayCard