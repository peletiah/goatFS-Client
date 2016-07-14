import React, { Component, PropTypes } from 'react';
import Square from './Square';
import { canMoveKnight, moveKnight } from './Game';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const squareTarget = {
  canDrop(props) {
    return canMoveKnight(props.x, props.y);
  },

  drop(props) {
    moveKnight(props.x, props.y);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

@DropTarget(ItemTypes.KNIGHT, squareTarget, collect)
export default class BoardSquare extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };

  renderOverlay(color) {
    return(
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }} />
    );
  }

  render() {
    const { x, y, connectDropTarget, isOver, canDrop } = this.props;
    // black is true when sum of square position is an 
    // odd number (i.e. Every other square gets black)
    const black = (x + y) % 2 === 1;

    return connectDropTarget(
      <div style={{ position: 'relative', width: '100%', height: '100%'}}>
      {console.log(black)}
      <Square black={black}>
        {this.props.children}
      </Square>
      {isOver && !canDrop && this.renderOverlay('red')}
      {!isOver && canDrop && this.renderOverlay('yellow')}
      {isOver && canDrop && this.renderOverlay('green')}
    </div>
    );
  }
}
