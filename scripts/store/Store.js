import { createStore, applyMiddleware, combineReducers } from 'redux'
import {reducer as formReducer} from 'redux-form';


const initialRouteState = {
  sequences: [],
  sortableKey: 0
}

const initialMenuState = {
  menuitems: []
}


var routeReducer = function (state = initialRouteState, action) {
  console.log('Calling routeReducer with', action.type)

  switch (action.type) {
    case 'FETCH_ROUTES_SUCCESS':
      return Object.assign({}, state, { sequences: action.sequences });

    case 'SORT_ROUTES':
      /* 
         receives an array of sequences (sorted by <Sortable/>) and 
         creates state.sequences with sequence.sequence in order
         of the new sorting
      */
      var newSequences = []
      var i=1
      action.sortedSequences.map(function(item) {item.sequence=i, i+=1, newSequences.push(item)})
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


var menuReducer = function (state = initialMenuState, action) {

  switch (action.type) {
    case 'FETCH_MENU_SUCCESS':
        return Object.assign({}, state, { menuitems: action.menuitems });
    default:
      return state;
  }
}

const reducers = combineReducers({
  routeState: routeReducer,
  menuState: menuReducer,
  form: formReducer
});

const store = createStore(reducers);

export default store;
