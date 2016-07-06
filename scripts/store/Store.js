import { createStore, applyMiddleware, combineReducers } from 'redux'

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
    case 'UPDATE_SEQUENCE':
      console.log(action.sequence.sequence)
      console.log(state.sequences)
      console.log(state.sequences[2].sequence)
      var updateTargetIndex = state.sequences.findIndex(x => x.sequence == action.sequence.sequence)
      console.log("updateTargetIndex ",updateTargetIndex)
      var newState = state
      newState.sequences[updateTargetIndex]=action.sequence
      console.log('newState',state.sequences)
      return state
    case 'INCREMENT_SORTABLE_KEY':
      console.log('state.sortableKey',state.sortableKey)
      var key = state.sortableKey
      return Object.assign({}, state, { sortableKey: ++key });
    default:
      return state;
  }
}


var menuReducer = function (state = initialMenuState, action) {
  console.log('Calling menuReducer with', action.type)

  switch (action.type) {
    case 'FETCH_MENU_SUCCESS':
        return Object.assign({}, state, { menuitems: action.menuitems });
    default:
      return state;
  }
}

const reducers = combineReducers({
  routeState: routeReducer,
  menuState: menuReducer
});

const store = createStore(reducers);

export default store;
