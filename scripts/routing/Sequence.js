import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import DropdownList from 'react-widgets/lib/DropdownList'
import Combobox from 'react-widgets/lib/Combobox'
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
    props.moveSequence(dragIndex, hoverIndex);

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

const renderSequenceOrder = field => (
  <span className="sequence-order">
    {field.input.value}
  </span>
)


var targetSortList = React.createClass({
  render() {
    const item = this.props.item
    var typeIcon;
    var sectionName;


    if (item == "user") {
        typeIcon = <i className='fa fa-male'></i>
        sectionName = <span>{ ItemTypes.USER_DIRECTORY }</span>
    } else if ( item == 'endpoint' ) {
      typeIcon = <i className='fa fa-sign-out'></i>
      sectionName = <span>{ ItemTypes.EXTERNAL_NUMBER }</span>
    } else if ( item == 'extension' ) {
      typeIcon = <i className='fa fa-arrow-right'></i>
      sectionName = <span>{ ItemTypes.EXTENSION }</span>
    };

    return (
      <span>
      {typeIcon} {sectionName}
      </span>
    );

  }
})

var TagItem = React.createClass({
  render() {
    var target = this.props.item
    var typeIcon;
    if (target.type == "user") {
        typeIcon = <i className='fa fa-male'></i>
    } else if ( target.type == 'endpoint' ) {
      typeIcon = <i className='fa fa-sign-out'></i>
    } else if ( target.type == 'extension' ) {
      typeIcon = <i className='fa fa-arrow-right'></i>
    };

    return (
      <span className = 'Select-value-label'>
        { typeIcon} {target.target }
      </span>);
  }
})

class renderSequenceForm extends Component {
  render() {
    const { formType, 
            input, 
            cmdData, 
            data, 
            alterSequence, 
            changeHandler, 
            blurHandler,
            addTarget,
            index 
          } = this.props

    if (formType == 'Combobox') {
      return (
				<div className="action">
      		<Combobox
      		  value = { input.value.command }
            textField = 'command'
            valueField = 'id'
      		  data = { data }
            suggest = { true } 
      		  onChange = { 
							event => { 
								changeHandler('routingForm', input.name+'.command', event); 
								alterSequence(index, event, input.value, 'command'); 
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
            placeholder = { input.value.command.data_template } 
      			onChange = { 
							event => {
      			    changeHandler('routingForm', input.name+'.cmdData', event.target.value);
      			  }
      			}
      			onBlur = { 
      			  event => {
      			    blurHandler('routingForm', input.name+'.cmdData', event.target.value); 
      			    alterSequence(index, event.target.value, input.value, 'cmdData'); 
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
            textField       = 'target'
            valueField      = 'id'
            data            = { data }
            value    = { cmdData || [] }
            placeholder     = { input.value.command.data_template } 
						tagComponent    = { TagItem }
						itemComponent   = { TagItem }
            groupBy         = 'type'
            groupComponent  = { targetSortList }
            onCreate        = {(
              new_target => addTarget(index, new_target, input.value) 
            )}
            onChange        = { 
              event => { 
              	changeHandler('routingForm', input.name+'.cmdData', event); 
              	alterSequence(index, event, input.value, 'cmdData'); 
              } 
            }
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


const Close = ({ removeSequence, index, sequenceId  }) => (
        <button type="button" className="close" aria-label="Close" onClick={ removeSequence.bind(null, index, sequenceId) } >
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
    moveSequence: PropTypes.func.isRequired,
    removeSequence: PropTypes.func.isRequired,
    addTarget: PropTypes.func.isRequired,
  };

    render() {
    const { sequenceField,
						alterSequence,
            removeSequence,
						addTarget,
            index,
            isDragging,
            isDraggingTarget,
            connectDragSource,
            connectDropTarget,
            sequenceFormArray,
            availableExtensions, 
            applicationCatalog,
            changeHandler,
            blurHandler
          } = this.props

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
          component={renderSequenceOrder}
        />

          <Field
						formType             = 'Combobox'
            name                 = { `${sequenceField}` }
            component            = { renderSequenceForm }
            data                 = { applicationCatalog }
						alterSequence        = { alterSequence }
            changeHandler        = { changeHandler }
            index                = { index }
          />
        
          {sequenceFormArray && sequenceFormArray.command.command != "bridge" &&           
            <Field
							formType             = 'Input'
              name                 = { `${sequenceField}` }
              component            = { renderSequenceForm }
              data                 = { sequenceFormArray.cmdData }
					  	alterSequence        = { alterSequence }
              changeHandler        = { changeHandler }
              blurHandler          = { blurHandler }
              index                = { index }
            />
          }

          {sequenceFormArray && sequenceFormArray.command.command == "bridge" &&           
          <Field
						formType             = 'Multiselect'
            name                 = { `${sequenceField}` }
            component            = { renderSequenceForm }
            data                 = { availableExtensions }
            cmdData              = { sequenceFormArray.cmdData }
						alterSequence        = { alterSequence }
            changeHandler        = { changeHandler }
            addTarget            = { addTarget }
            index                = { index }
          />
          }

        {sequenceFormArray &&
        <Close
          index                = { index }
          sequenceId           = { sequenceFormArray.sequence_id }
          removeSequence = { removeSequence }
        />
        }


      </div>
    ));
  }
}

export default Sequence;
