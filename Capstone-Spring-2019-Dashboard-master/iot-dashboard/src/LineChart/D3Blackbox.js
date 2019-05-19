import React, { Component } from "react";

/*
	A higher order function to create a react wrapper
	around d3 rendered elements.
*/
export default function D3blackbox(D3render) {
  return class Blackbox extends Component {
    componentDidMount() {
      D3render.call(this);
    }

    componentDidUpdate() {
      D3render.call(this);
    }

    render() {
      const { x = 0, y = 0 } = this.props;
      return <g transform={`translate(${x}, ${y})`} ref="anchor" />;
    }
  };
}
