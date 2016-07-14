import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';


const knightSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

@DragSource(ItemTypes.KNIGHT, knightSource, collect)
export default class Knight extends Component {
    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired
    };

    componentDidMount() {
        const img = new Image();
        img.src = '/build/css/images/horse.png'
        img.onload = () => this.props.connectDragPreview(img);
    }

    render() {
      const { connectDragSource, isDragging } = this.props;
      return connectDragSource(
        <div style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move'
        }}>
          ♘
        </div>
      );
    }
}

