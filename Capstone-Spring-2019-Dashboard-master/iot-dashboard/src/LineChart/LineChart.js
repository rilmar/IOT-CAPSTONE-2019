import React, { Component } from "react";
import * as d3 from "d3";
import D3blackbox from "./D3Blackbox";
import './lineChart.scss'

class LineChart extends Component {
  constructor(props) {
    super(props);

    const marginTop = 20,
      marginRight = 20,
      marginLeft = 50,
      marginBottom = 30,
      width = this.props.width - marginLeft - marginRight,
      height = this.props.height - marginTop - marginBottom;

    this.state = {
      marginTop,
      marginRight,
      marginLeft,
      marginBottom,
      width,
      height
    };

    this.dateFormat = this.props.dateFormat

    this.x = d3.scaleTime().rangeRound([0, width]);
    this.y = d3.scaleLinear().rangeRound([height, 0]);
    this.line = d3
      .line()
      .x(d => this.x(d.date))
      .y(d => this.y(d.value));
    // Always update d3 with new props.
    this.updateD3(props.data);
  }

  // Always update d3 with new props.
  componentWillReceiveProps(props) {
    this.updateD3(props.data);
  }

  updateD3(data) {
    this.x.domain(
      d3.extent(data, d => {
        return d.date;
      })
    );

    this.y.domain(
      d3.extent(data, d => {
        return d.value;
      })
    );
  }

  getAxisBottom(x) {
    const dateFormat = this.props.dateFormat
    return D3blackbox(function() {
      d3.select(this.refs.anchor).call(
        d3.axisBottom(x).tickFormat(x => d3.timeFormat(dateFormat)(x)));
        d3.axisBottom(x).ticks(d3.timeSecond.every(15));
    });
  }

  getAxisLeft(y) {
    return D3blackbox(function() {
      d3.select(this.refs.anchor).call(d3.axisLeft(y));
    });
  }

  render() {
    const fill = this.props.fill || "none";
    const stroke = this.props.stroke || "#209e91";
    const strokeLinejoin = this.props.strokeLinejoin || "round";
    const strokeLinecap = this.props.strokeLinecap || "round";
    const strokeWidth = this.props.strokeWidth || "1.5";

    const AxisBottom = this.getAxisBottom(this.x);
    const AxisLeft = this.getAxisLeft(this.y);
    return (
      <svg width={this.props.width} height={this.props.height}>
        <g
          transform={`
            translate(
              ${this.state.marginLeft},
              ${this.state.marginTop}
            )`}
        >
          <g transform={`translate(0,${this.state.height})`}>
            <AxisBottom />
          </g>

          <g>
            <AxisLeft />
            <text
              fill="#292929"
              transform="rotate(-90)"
              y="6"
              dy="0.71em"
              textAnchor="end"
            >
            </text>
          </g>
          <path
            fill={fill}
            stroke={stroke}
            strokeLinejoin={strokeLinejoin}
            strokeLinecap={strokeLinecap}
            strokeWidth={strokeWidth}
            d={this.line(this.props.data)}
          />
        </g>
      </svg>
    );
  }
}

export default LineChart;