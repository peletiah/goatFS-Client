import store from '../store/Store'
import fetch from 'isomorphic-fetch'
import cookie from 'react-cookie'

export const SET_CSRF_TOKEN = 'SET_CSRF_TOKEN'

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

export function setCSRFToken() {
	console.log('Checking for csrf-cookie')
	store.dispatch({
		type: SET_CSRF_TOKEN,
		csrfToken: cookie.load('csrf')
	})
	console.log('csrfToken is '+store.getState().appState.csrfToken)
}
