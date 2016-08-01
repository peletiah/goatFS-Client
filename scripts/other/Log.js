/*
  Log
  <Log />
*/

import React from 'react';
import autobind from 'autobind-decorator';

@autobind
class Log extends React.Component {
  render() {
    var details = this.props.details;
    if (undefined != details) {
      return (
        <div>
          <h3>
            {details.topic}
          </h3>
          <p>{details.author}</p>
          <p>{details.created}</p>
          <p>{details.content}</p>
          <p>{details.trackpoint_count}</p>
          <p>{details.end_time}</p>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
};

export default Log;
