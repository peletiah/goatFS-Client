const initialMenuState = {
  menuitems: []
}

var menuReducer = function (state = initialMenuState, action) {

  switch (action.type) {
    case 'FETCH_MENU_SUCCESS':
        return Object.assign({}, state, { menuitems: action.menuitems });
    default:
      return state;
  }
}


export default menuReducer;
