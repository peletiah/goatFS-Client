import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'


class renderDropdownList extends Component {
  render() {
		const { input, data, handleModifySequence, changeHandler, index } = this.props

    //console.log('Dropdown')
    //console.log(input)
    console.log(data)

  return (
    <div>
      <DropdownList
        value = { input.value.command }
        data = { data }
        onChange = { value => { changeHandler('routingForm',input.name+'.command',value); handleModifySequence(index, value, input.value, 'command'); } }
      />
    </div>
  )
  }
}

class renderMultiselect extends Component {
	render() {
		const { input, data, handleModifySequence, changeHandler, index } = this.props
  
    //test if data is already an array
    //TODO cleaner data-values from api
    if ( typeof input.value.cmdData === 'string' ) {
      var value = [input.value.cmdData]
    } else {
      var value = input.value.cmdData
    }

		return (
			<div>
				<Multiselect 
					value = { value || [] } 
          onChange = { value => { console.log('bli',value); changeHandler('routingForm',input.name+'.cmdData',value); handleModifySequence(index, value, input.value, 'cmdData'); } }
					data = { data }
					placeholder = 'User/Extension'
				/>
			</div>
		)
	}
}


class renderField extends Component {
	render() {
		console.log(this.props)
		return(
		  <div>
		    <label>{this.props.placeholder}</label>
		    <div>
		      <input {...this.props}/>
		      {this.props.touched && this.props.error && <span>{this.props.error}</span>}
		    </div>
		  </div>
		)
	}
}

class renderInput extends Component {
	render() {
		const { input, handleModifySequence, changeHandler, blurHandler, index } = this.props

    console.log('bla',input.name)

		return (
			<div>
          <input 
          type="text" 
          value={ input.value.cmdData }
          onBlur = { value => { console.log('blo',input.value.cmdData); blurHandler('routingForm', input.name+'.cmdData', input.value.cmdData)}}
          />
			</div>
		)
	}
}


const renderOrder = field => (
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
    handleRemoveSequence: PropTypes.func.isRequired,
    sequenceFormArray: PropTypes.any.isRequired
  };

    render() {
    const { sequenceField,
						handleModifySequence,
            handleRemoveSequence,
            index,
            isDragging,
            isDraggingTarget,
            connectDragSource,
            connectDropTarget,
            sequenceFormArray,
            changeHandler,
            blurHandler
          } = this.props

    var commands = [
        'set',
        'bridge',
        'playback'
      ]


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
          component={renderOrder} />

        <div className="action">
          <Field
            name={`${sequenceField}`}
            value={`${sequenceField}.command`}
            component={renderDropdownList}
            data = {commands}
            defaultValue={'log'}
						handleModifySequence = { handleModifySequence }
            changeHandler = { changeHandler }
            index = { index }
          />
        </div>
        
        <div className="action">

          {sequenceFormArray.command == "bridge" &&           
          <Field
            name={`${sequenceField}`}
            component={renderMultiselect}
            data={['John - 200','Anna - 300','Rüdiger - 357','Brumsti - 345','asdf - 654','ghj - 565','giogjoisfjgs - 5463456345','htrhtrhererhtrhtr - 5464545645645','fgfdgfdgdgsdfgsdf - 534534534534']}
            defaultValue={['John - 200']}
						handleModifySequence = { handleModifySequence }
            changeHandler = { changeHandler }
            index = { index }
          />}

          {sequenceFormArray.command != "bridge" &&           
            <Field
              name={`${sequenceField}`}
              component={renderInput}
					  	handleModifySequence = { handleModifySequence }
              blurHandler = { blurHandler }
              changeHandler = { changeHandler }
              index = { index }
            />
          }


          { sequenceFormArray.command != "bridge" && 
            <div className="rw-widget rw-multiselect">
              <Field
                name={`${sequenceField}.id`}
                component={renderField}
                type="text"
              />
            </div> }

            
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
