const initialRouteState = { 
  sequences: [], 
  sortableKey: 0 
}

var routeReducer = function (state = initialRouteState, action) {

  switch (action.type) {
    case 'FETCH_ROUTES_SUCCESS':
      return Object.assign({}, state, { sequences: action.sequences });

    case 'SORT_ROUTES':
      /* 
         receives an array of sequences (sorted by <Sortable/>) and 
         creates state.sequences with sequence.sequence in order
         of the new sorting
      */
      console.log('SORT_ROUTES',action)
      var newSequences = []
      var i=1
      action.sortedSequences.map(function(item) {item.sequence=i, i+=1, newSequences.push(item)})
      console.log(newSequences)
      return Object.assign({}, state, { sequences: newSequences})

    case 'ALTER_SEQUENCE':
      var updateTargetIndex = state.sequences.findIndex(x => x.sequence == action.sequence.sequence)
      var newState = state
      newState.sequences[updateTargetIndex]=action.sequence
      console.log('altered sequence',newState.sequences[updateTargetIndex])
      return newState

    case 'INCREMENT_SORTABLE_KEY':
      var key = state.sortableKey;
      key++;
      return Object.assign({}, state, { sortableKey: key });


    default:
      return state;
  }
}


export default routeReducer;
