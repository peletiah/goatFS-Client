import store from '../store/Store'
import fetch from 'isomorphic-fetch'



export const FETCH_ROUTE = 'FETCH_ROUTE'

function inspectHttpStatus(response) {
  if (response.status >= 200 && response.status < 300 ) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    console.log(response.status)
    throw error
  }
}

export function fetchRoute(routeId) {
  const csrfToken = store.getState().appState.csrfToken
  return function (dispatch) {
    dispatch(fetchRouteRequest(routeId))
    return fetch(`http://api.goatfs.org:6543/route/${routeId}`, {
                credentials: 'include',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': 'goatfs.org',
                  'X-CSRF-TOKEN': csrfToken
                }
              }
            )
      .then( response => inspectHttpStatus(response) )
      .then( response => response.json() )
      .then( json => dispatch(fetchRouteSuccess(routeId, json) ))
  }
}

export const FETCH_ROUTE_REQUEST = 'FETCH_ROUTE_REQUEST'

export function fetchRouteRequest ( routeId ) {
  return {
    type: FETCH_ROUTE_REQUEST,
    routeId: routeId
  }
}

export const FETCH_ROUTE_SUCCESS = 'FETCH_ROUTE_SUCCESS'

function fetchRouteSuccess( routeId, json ) {
  return {
    type: FETCH_ROUTE_SUCCESS,
    route: json
  }
}

export const ADD_SEQUENCE = 'ADD_SEQUENCE'

export function addSequence() {
  store.dispatch({
    type: ADD_SEQUENCE
  })      
}

export const ALTER_SEQUENCE = 'ALTER_SEQUENCE'

export function alterSequence(index, change, sequence, field) {
  store.dispatch({
  type: ALTER_SEQUENCE,
  index: index,
  modifiedSequence: sequence,
  change: change,
  field: field
  })
  console.log('ALTER',change);
}

export const MOVE_SEQUENCE = 'MOVE_SEQUENCE'

export function moveSequence(dragIndex, hoverIndex) {
  store.dispatch({
    type:MOVE_SEQUENCE,
    hoverIndex: hoverIndex,
    dragIndex: dragIndex,
  })

  store.dispatch({
    type:RENUMBER_SEQUENCES
  })
}


export const RENUMBER_SEQUENCES = 'RENUMBER_SEQUENCES'

export function renumberSequences() {
  type: RENUMBER_SEQUENCES
}

export const REMOVE_SEQUENCE = 'REMOVE_SEQUENCE'

export function removeSequence(index, sequenceId) {
  console.log('delete sequence:',index, sequenceId)
  store.dispatch({
    type:REMOVE_SEQUENCE,
    index: index,
    sequenceId: sequenceId
  })
//TODO merge renumber and remove
  store.dispatch({
    type:'RENUMBER_SEQUENCES'
  })
}

export const ADD_BRIDGE_TARGET = 'ADD_BRIDGE_TARGET'

export function addTarget(index, new_target, sequence) {
  store.dispatch({
  type: ADD_BRIDGE_TARGET,
  index: index,
  new_target: new_target,
  sequence: sequence,
  })
  console.log('create Tag',new_target, sequence, index)
};

//export function fetchRoute(routeId) {
//  const csrfToken = store.getState().appState.csrfToken
//  return function (dispatch) {
//    dispatch(fetchRouteRequest(routeId))
//    return fetch(`http://api.goatfs.org:6543/route/${routeId}`, {
//                credentials: 'include',
//                headers: {
//                  'Accept': 'application/json',
//                  'Content-Type': 'application/json',
//                  'Access-Control-Allow-Origin': 'goatfs.org',
//                  'X-CSRF-TOKEN': csrfToken
//                }
//              }
//            )
//      .then( response => inspectHttpStatus(response) )
//      .then( response => response.json() )
//      .then( json => dispatch(fetchRouteSuccess(routeId, json) ))
//  }
//}


export const SAVE_ROUTE = 'SAVE_ROUTE'

export function saveRoute(routeId) {
  //TODO limit getState() by routeId
  const route = store.getState().route
  const csrfToken = store.getState().appState.csrfToken
  return function (dispatch) {
    return fetch(`http://api.goatfs.org:6543/route/${routeId}`, {
                method: 'PUT',
                headers: {
                  'X-CSRF-TOKEN': csrfToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify (
                  route
                )
              }
            )
      .then( response => inspectHttpStatus(response) )
      .then( dispatch(saveRouteSuccess( routeId ) ))
      .then( dispatch(fetchRoute( routeId )))
  }
}

export const SAVE_ROUTE_SUCCESS = 'SAVE_ROUTE_SUCCESS'

function saveRouteSuccess( routeId ) {
  return {
    type: SAVE_ROUTE_SUCCESS
  }
}
