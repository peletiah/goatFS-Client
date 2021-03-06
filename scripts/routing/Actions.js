import { store } from '../store/Store'
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

export function fetchRoutes() {
  const csrfToken = store.getState().appState.csrfToken
  return function (dispatch) {
    dispatch(fetchRoutesRequest())
    return fetch(`http://api.goatfs.org:6543/routes/`, {
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
      .then( json => dispatch(fetchRoutesSuccess(json) ))
  }
}


export const FETCH_ROUTES_REQUEST = 'FETCH_ROUTES_REQUEST'

export function fetchRoutesRequest() {
  return {
    type: FETCH_ROUTES_REQUEST
  }
}

export const FETCH_ROUTES_SUCCESS = 'FETCH_ROUTES_SUCCESS'

function fetchRoutesSuccess( json ) {
  return {
    type: FETCH_ROUTES_SUCCESS,
    routes: json
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
      .then( json => dispatch(fetchRouteSuccess(json) ))
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

function fetchRouteSuccess( route ) {
  return {
    type: FETCH_ROUTE_SUCCESS,
    route: route 
  }
}

export const ADD_SEQUENCE = 'ADD_SEQUENCE'

export function addSequence(routeId) {
  store.dispatch({
    type: ADD_SEQUENCE,
    routeId: routeId
  })      
}

export const ALTER_SEQUENCE = 'ALTER_SEQUENCE'

export function alterSequence(index, change, sequence, field, routesIndex) {
  store.dispatch({
  type: ALTER_SEQUENCE,
  index: index,
  modifiedSequence: sequence,
  change: change,
  field: field,
  routesIndex: routesIndex
  })
}

export const MOVE_SEQUENCE = 'MOVE_SEQUENCE'

export function moveSequence(dragIndex, hoverIndex, routesIndex) {
  store.dispatch({
    type:MOVE_SEQUENCE,
    hoverIndex: hoverIndex,
    dragIndex: dragIndex,
    routesIndex: routesIndex
  })

  store.dispatch({
    type:RENUMBER_SEQUENCES,
    routesIndex: routesIndex
  })
}


export const RENUMBER_SEQUENCES = 'RENUMBER_SEQUENCES'

export function renumberSequences() {
  type: RENUMBER_SEQUENCES
}

export const REMOVE_SEQUENCE = 'REMOVE_SEQUENCE'

export function removeSequence(routesIndex, index, sequenceId) {
  console.log('delete sequence:',index, sequenceId)
  store.dispatch({
    type:REMOVE_SEQUENCE,
    routesIndex: routesIndex,
    index: index,
    sequenceId: sequenceId
  })

  store.dispatch({
    type:'RENUMBER_SEQUENCES',
    routesIndex: routesIndex
  })
}

export const ADD_BRIDGE_TARGET = 'ADD_BRIDGE_TARGET'

export function addTarget(routesIndex, index, new_target, sequence) {
  store.dispatch({
    type: ADD_BRIDGE_TARGET,
    routesIndex: routesIndex,
    index: index,
    new_target: new_target,
    sequence: sequence,
  })
  console.log('create Tag',new_target, sequence, index)
};



export const SAVE_ROUTE = 'SAVE_ROUTE'

export function saveRoute(routeId, routesIndex) {
  //TODO limit getState() by routeId
  const route = store.getState().routes[routesIndex]
  console.log("save route",route)
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
      .then( response => response.json() )
      .then( json => {
        console.log(routesIndex, routeId, json)
        dispatch(saveRouteSuccess(routesIndex, routeId, json))
      })
  }
}

export const SAVE_ROUTE_SUCCESS = 'SAVE_ROUTE_SUCCESS'

function saveRouteSuccess(routesIndex, routeId, route ) {
  return {
    type: SAVE_ROUTE_SUCCESS,
    routesIndex: routesIndex,
    routeId: routeId,
    route: route 
  }
}
