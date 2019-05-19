import React, { Component } from 'react'
import SocketLineGraph from './LineChart/SocketLineGraph'

class DataDisplayCard extends Component {
  render() {
    return (
      <div>
          <div>
            {/*test to see how the graph handles grid*/}
            <SocketLineGraph></SocketLineGraph>
          </div>
      </div>
    )
  }
}

export default DataDisplayCard