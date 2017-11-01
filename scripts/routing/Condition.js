import React, { Component, PropTypes } from 'react';


class Condition extends Component {

  render() {
    return(
      <div className="conditions">
        <div className="condition row">
          <span className="item item-directory"></span>
        </div>
        <div className="condition row">
          <span className="item item-clock"></span>
          <span className="item item-calendar"></span>
        </div>
        <div className="condition row">
          <span className="item item-calendar"></span>
          <span className="item item-clock"></span>
          <span className="item item-directory"></span>
        </div>
      </div>
        )
  }
}

export default Condition;
