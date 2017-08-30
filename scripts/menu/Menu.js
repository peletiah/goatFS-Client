/*
  Menu
*/

import React from 'react';
import { Link } from 'react-router-dom';
import store from '../store/Store'
import autobind from 'autobind-decorator'

@autobind
class Menu extends React.Component {

  constructor() {
    super();

    this.state = {
      menu : []
    }
  }
/*TODO: Don't save menu in state, as it remains unchanged (see https://facebook.github.io/react/docs/thinking-in-react.html#step-3-identify-the-minimal-but-complete-representation-of-ui-state) */

  componentDidMount() {
    const csrfToken = store.getState().appState.csrfToken
    fetch('http://api.goatfs.org:6543/menu', {
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': csrfToken
      }
    }).then(r => r.json())
      .then(data => this.setState({
          menu : data
      }))
      .catch(e => console.log("Error "+e))
    }

  menuItems(key) {
    return(
      <li className="nav-item" key={this.state.menu[key].id}>
        <Link className="nav-link" to={this.state.menu[key].location}>
          {this.state.menu[key].name}
        </Link>
      </li>
    )
  }


    render() {
      return (
        <div>
          <nav className="navbar navbar-light bg-faded">
            <a className="navbar-brand" href="/">GoatFS</a>
            <ul className="nav navbar-nav">
              {Object.keys(this.state.menu).map(this.menuItems)}
            </ul>
            <form className="form-inline pull-xs-right">
              <input className="form-control" type="text" placeholder="Search"/>
              <button className="btn btn-success-outline" type="submit">Search</button>
            </form>
          </nav>
        </div>
      )
    }

};

export default Menu;
