import update from 'react/lib/update';

const initialRouteState = {
  id: 0,
  sequences: [] 
}

const routeReducer = function (state = initialRouteState, action) {

  const sequences = state.sequences

  switch (action.type) {
    case 'FETCH_ROUTES_SUCCESS':
      return Object.assign({}, state, { id: action.route.id, sequences: action.route.sequences });

    case 'ALTER_SEQUENCE':
      /* Receives array of sequences from redux-form-validation
      and writes it to state.sequences
      */
      return {id: state.id, sequences: action.modifiedSequences}

    case 'MOVE_SEQUENCE':
      const { dragIndex, hoverIndex } = action
      const dragSequence = sequences[dragIndex]
      // a sequence has been moved to a different position
      // update the route state
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

    case 'RENUMBER_SEQUENCES':
      let i=1
      const newSequences = []
      // renumber the sequences to reflect the new order (e.g. 2,3,1 gets 1,2,3)
      state.sequences.map(function(item) {item.sequence=i, i+=1, newSequences.push(item)})
      return {id: state.id, sequences: newSequences}

    case 'ADD_SEQUENCE':
      // put sequence-numbers in an array and find the 
      // currently highest sequence-number
      var seqArray = [];
      state.sequences.map(item => seqArray.push(item.sequence))
      let highest = Math.max.apply(Math, seqArray)
      // if sequences-Array is empty, we have to set `highest` manually 
      if (!isFinite(highest)) {
        highest=0
      }
      const newSequence = { sequence: highest+=1, data:"", command:"" }
      return update(state, {
        sequences: {
          $push: [newSequence]
        }
        });

    case 'REMOVE_SEQUENCE':
      const index = action.index
      return update(state, {
        sequences: {
          $splice:[
            [index, 1]
          ]
        }
      })



    default:
      return state;
  }
}


export default routeReducer;
