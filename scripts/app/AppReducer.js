import update from 'react/lib/update';

const initialAppState = {
  csrfToken: ''
}

const appReducer = function (state = initialAppState, action) {
  const csrfToken = state.csrfToken

  switch (action.type) {
    case 'SET_CSRF_TOKEN':
      return Object.assign({}, state, { csrfToken: action.csrfToken });

    default:
      return state;
  }
}

export default appReducer;
