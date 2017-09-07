import update from 'immutability-helper';
import ItemTypes from './ItemTypes';
import {
  ADD_SEQUENCE, ALTER_SEQUENCE, MOVE_SEQUENCE, RENUMBER_SEQUENCES,
  REMOVE_SEQUENCE, ADD_BRIDGE_TARGET, FETCH_ROUTES_REQUEST, FETCH_ROUTES_SUCCESS, 
  FETCH_ROUTE_REQUEST, FETCH_ROUTE_SUCCESS, SAVE_ROUTE_SUCCESS
} from './Actions'


const initialRouteState = [
  {
    id: 0,
    sequences: [],
    removedSequences: []
  }
]

function getIndex(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1;
}

export { getIndex}

const routeReducer = function (state = initialRouteState, action) {

  switch (action.type) {


    case FETCH_ROUTES_REQUEST: 
      return state

    case FETCH_ROUTES_SUCCESS:
      console.log('Successfully fetched routes',action)
      return action.routes 

    case FETCH_ROUTE_REQUEST: 
      return state

    case FETCH_ROUTE_SUCCESS:
      console.log('Successfully fetched route',action)
			var routeIndex = getIndex(action.route.id,state,'id')
			if ( routeIndex == -1)
			{
				return [action.route]
			}
			
     	return update(state, {
		 			[routeIndex]: {$set: action.route}			
     	 		});

    case ADD_SEQUENCE:
      // put sequence-numbers in an array and find the 
      // currently highest sequence-number
      console.log("ADD SEQUENCE")
      const routeIndex = getIndex(action.routeId,state,'id')
      var seqArray = [];
      state[routeIndex].sequences.map(item => seqArray.push(item.sequence))
      let highest = Math.max.apply(Math, seqArray)
      // if sequences-Array is empty, we have to set `highest` manually 
      if (!isFinite(highest)) {
        highest=0
      }
      //TODO change default-values of new sequence
      const newSequence = { sequence: highest+=1, sequence_id: -1, timeout: ItemTypes.DEFAULT_TIMEOUT, cmdData:[], command: { application_catalog_id: -1, command: "bridge", data_template: ""} }
      return update(state, {
        [routeIndex]: {
          sequences: {
            $push: [newSequence]
          }
        }
      });

    case ALTER_SEQUENCE:
      // A Sequence has been modified
      var updatedSequence
      if (action.field == 'command')
        {
          updatedSequence = Object.assign({}, action.modifiedSequence, {command: action.change});
        }
      else if (action.field == 'cmdData')
        {
          updatedSequence = Object.assign({}, action.modifiedSequence, {cmdData: action.change});
        };
      //$splice: replace one item in state.sequences at action.index
      return update(state, {
        sequences: {
          $splice: 
            [[action.index,1,updatedSequence]]
        }
      });

    case MOVE_SEQUENCE:
      // A sequence has been moved to a different position
      const { dragIndex, hoverIndex } = action
      const dragSequence = sequences[dragIndex]
      const hoverSequence = sequences[hoverIndex]
      
      return update(state, 
        { sequences:
          {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragSequence]
            ]
          }
        }
      );

    case RENUMBER_SEQUENCES:
      let i=1
      const newSequences = []
      // renumber the sequences to reflect the new order (e.g. 2,3,1 gets 1,2,3)
      state.sequences.map(function(item) {item.sequence=i, i+=1, newSequences.push(item)})
      return update( state, { sequences: {$set: newSequences} } );


    case REMOVE_SEQUENCE:
      const index = action.index
      return update(state, {
        sequences: {
          $splice:[
            [index, 1]
          ]
        },
        removedSequences: {
          $push: [action.sequenceId]
        }
      });

    case ADD_BRIDGE_TARGET:
      // append new "endpoint"-target to "bridge"-sequence
      action.sequence.cmdData.push({
                            type:"endpoint", 
                            id: -1, 
                            target: action.new_target
                          }); 
      //$splice: replace one item in state.sequences at action.index
      return update(state, {
        sequences: 
        {
          $splice: [[action.index,1,action.sequence]]
        }      
      });

    case SAVE_ROUTE_SUCCESS:
      console.log('SAVE_ROUTE_SUCCESS:',action.route)
      return Object.assign({}, state, { 
        id: action.route.id, 
        sequences: action.route.sequences 
      });

    default:
      return state;
  }
}

export default routeReducer;
