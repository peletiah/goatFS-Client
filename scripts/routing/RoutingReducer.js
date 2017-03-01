import update from 'immutability-helper';

const initialRouteState = {
  id: 0,
  sequences: [] 
}

const routeReducer = function (state = initialRouteState, action) {

  const sequences = state.sequences

  switch (action.type) {
    case 'FETCH_ROUTES_SUCCESS':
      return Object.assign({}, state, { 
        id: action.route.id, 
        sequences: action.route.sequences, 
        availableExtensions: action.route.availableExtensions, 
        applicationCatalog: action.route.applicationCatalog 
      });

    case 'ALTER_SEQUENCE':
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

    case 'MOVE_SEQUENCE':
      // A sequence has been moved to a different position
      const { dragIndex, hoverIndex } = action
      const dragSequence = sequences[dragIndex]
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
      return update( state, { sequences: {$set: newSequences} } );

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
      const newSequence = { sequence: highest+=1, cmdData:"", command: { id:0, command: "bridge", data_template: ""} }
      console.log("Adding Sequence to state (Reducer)")
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
