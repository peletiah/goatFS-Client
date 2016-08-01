import React, { Component } from 'react';
import Board from './Board'
import { observe } from './Game';

export default class Chess extends Component {
  constructor(props) {
    super(props);
    this.unobserve = observe(this.handleChange.bind(this));
  }

  handleChange(knightPosition) {
    const nextState = { knightPosition };
    if (this.state) {
      this.setState(nextState);
    } else {
      this.state = nextState;
    }
  }

  componentWillUnmount() {
    // sets observer to null to stop monitoring for change-events
    this.unobserve();
  }

  render() {
    const { knightPosition } = this.state;
    return(
      <Board knightPosition={knightPosition} />
    )
  }
}
