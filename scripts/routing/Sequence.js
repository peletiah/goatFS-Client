import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';




const renderField = field => (
  <span>
      <input { ...field.input }/>
      {field.touched && field.error && <span>{ field.error }</span>}
  </span>
)

const renderSpan = field => (
  <span className="sequence-order">
    {field.input.value}
  </span>
)


const sequenceSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
}


const Close = ({index, handleRemoveSequence }) => (
        <button type="button" className="close" aria-label="Close" onClick={ handleRemoveSequence.bind(null, index) } >
          <span aria-hidden="true">&times;</span>
        </button>
)



const sequenceTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && clientOffset.y < hoverBoundingRect.top) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && clientOffset.y > hoverBoundingRect.bottom) {
      return;
    }

    // Time to actually perform the action
    props.handleMoveSequence(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;  
  }
}

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function collectDropTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isDraggingTarget: monitor.isOver()
  }
}

@DropTarget(ItemTypes.SEQUENCE, sequenceTarget,collectDropTarget)
@DragSource(ItemTypes.SEQUENCE, sequenceSource, collectDragSource)
class Sequence extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    sequenceField: PropTypes.any.isRequired,
    handleMoveSequence: PropTypes.func.isRequired,
    handleRemoveSequence: PropTypes.func.isRequired
  };

  render() {
    const { sequenceField,
            handleRemoveSequence,
            index,
            isDragging,
            isDraggingTarget,
            connectDragSource,
            connectDropTarget
          } = this.props

    return connectDragSource(connectDropTarget(
      <div className="sequence" 
           style={{ 
             opacity: isDraggingTarget ? 0.4 : 1,
             border: isDraggingTarget ? '1px #444 dashed' : 'None',
             cursor: 'move'
           }}>
        <Field
          name={`${sequenceField}.sequence`}
          type="text"
          component={renderSpan} />
        <div className="action">
          <Field
            name={`${sequenceField}.command`}
            type="text"
            size="8"
            component={renderField}
            placeholder="command"/>
          <Field
            name={`${sequenceField}.data`}
            type="text"
            size="35"
            component={renderField}
            placeholder="data"/>
          </div>
        <Close
          index = { index }
          handleRemoveSequence = { handleRemoveSequence }
        />
      </div>
    ));
  }
}

export default Sequence;
