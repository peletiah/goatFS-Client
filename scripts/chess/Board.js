import React, { Component, PropTypes } from 'react';
import BoardSquare from './BoardSquare';
import Knight from './Knight';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    knightPosition: PropTypes.arrayOf(
      PropTypes.number.isRequired
    ).isRequired
  };

  renderPiece(x, y) {
    const [knightX, knightY] = this.props.knightPosition;
    // if knight-coordinates are identical to square coordinates, 
    // display the Knight-component, otherwise don't

    if (x === knightX && y === knightY) {
      return <Knight />;
    }
  }

  renderSquare(i) {
    const x = i % 8; // Remainder, rest of i / 8
    const y = Math.floor(i / 8) // Math.floor( 45.95) gives  45
    return (
      <div key={i}
           style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquare x={x} y={y}>
          {this.renderPiece(x, y)}
        </BoardSquare>
      </div>
    );
  }

  render() {
    const squares = [];
    for (let i = 0; i < 64; i += 1) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div style={{
        width: '300px',
        height: '300px',
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {squares}
      </div>
    );
  }
}
