import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'

const sequenceSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
}


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

const renderOrder = field => (
  <span className="sequence-order">
    {field.input.value}
  </span>
)

class renderSequenceForm extends Component {
  render() {
    const { formType, input, data, handleModifySequence, changeHandler, blurHandler, index } = this.props

    if (formType == 'DropDownList') {
      return (
				<div className="action">
      		<DropdownList
      		  value = { input.value.command }
      		  data = { data }
      		  onChange = { 
							event => { 
								changeHandler('routingForm', input.name+'.command', event); 
								handleModifySequence(index, value, input.value, 'command'); 
							} 
						}
      		/>
    		</div>
      )
    }

    else if (formType == 'Input') {
			return (
				<div className="action rw-widget">
      		<input 
      			type="text" 
      			value={ input.value.cmdData }
      			onChange = { 
							event => {
      			    changeHandler('routingForm', input.name+'.cmdData', event.target.value);
      			  }
      			}
      			onBlur = { 
      			  event => {
      			    blurHandler('routingForm', input.name+'.cmdData', event.target.value); 
      			    handleModifySequence(index, event.target.value, input.value, 'cmdData'); 
      			  }
      			}
      		/>
      	</div>
			)
		}

    else if (formType == 'Multiselect') {
      return (
  			<div className="action">
				  <Multiselect 
				  	value = { ( typeof input.value.cmdData === 'string') ? [input.value.cmdData] : input.value.cmdData || [] } 
            onChange = { 
							event => { 
								changeHandler('routingForm', input.name+'.cmdData', event); 
								handleModifySequence(index, event, input.value, 'cmdData'); 
							} 
						}
				  	data = { data }
				  />
			  </div>
      )
		}
		else {
			return (
				<div>
					Error: No FormType defined
				</div>
			)
		}
  }
}


class renderDropdownList extends Component {
	render()  {
    const { formType, defaultValue, input, data, handleModifySequence, changeHandler, blurHandler, index } = this.props
		console.log( 'data', data )
		console.log( 'defaultValue', defaultValue )
		return (
			<div className="action">
				<Multiselect
					textField = 'name'
					valueField = 'id'
					data = {data}
					defaultValue = { [] }
					onChange = {
						event => {
							console.log(input.name, event)
						}
					}
				/>
			</div>
		)
	}
};

const Close = ({index, handleRemoveSequence }) => (
        <button type="button" className="close" aria-label="Close" onClick={ handleRemoveSequence.bind(null, index) } >
          <span aria-hidden="true">&times;</span>
        </button>
)

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

    var users = [
      {id:"1",name:"John",extension:"200"},
      {id:"2",name:"Rüdiger", extension:"357"},
      {id:"3",name:"Brumsti",extension:"345"},
      {id:"4",name:"Anna",extension:"300"}
    ]

		var colors = [
		  { id: 0, name: 'orange'},
		  { id: 1, name: 'purple'},
		  { id: 2, name: 'red' },
		  { id: 3, name: 'blue' },
		];

    return connectDragSource( connectDropTarget (
      <div 
        className="sequence" 
        style={{ 
             opacity: isDraggingTarget ? 0.4 : 1,
             border: isDraggingTarget ? '1px #444 dashed' : 'None',
             cursor: 'move'
        }}>

        <Field
          name={`${sequenceField}.sequence`}
          type="text"
          component={renderOrder}
        />

          <Field
						formType = 'DropDownList'
            name={`${sequenceField}`}
            component={renderSequenceForm}
            data = { commands }
						handleModifySequence = { handleModifySequence }
            changeHandler = { changeHandler }
            index = { index }
          />
        
          {sequenceFormArray.command != "bridge" &&           
            <Field
							formType = 'Input'
              name={`${sequenceField}`}
              component={renderSequenceForm}
              data = { sequenceFormArray.cmdData }
					  	handleModifySequence = { handleModifySequence }
              changeHandler = { changeHandler }
              blurHandler = { blurHandler }
              index = { index }
            />
          }

          {sequenceFormArray.command == "bridge" &&           
          <Field
						formType = 'Multiselect'
            name={`${sequenceField}`}
            component={renderSequenceForm}
            data= { users }
            valueField = 'id'
            textField = 'name'
						handleModifySequence = { handleModifySequence }
            changeHandler = { changeHandler }
            index = { index }
          />}

			<Field
          name="favoriteColor"
          component={renderDropdownList}
          valueField="id"
          textField="extension"
          data={users}
					defaultValue = {[users[1],users[3]]}
			/>
{/*
				<Multiselect
      		valueField='id' 
					textField='name'
      		data={colors}
				/>
*/}

        <Close
          index = { index }
          handleRemoveSequence = { handleRemoveSequence }
        />
      </div>
    ));
  }
}

export default Sequence;
