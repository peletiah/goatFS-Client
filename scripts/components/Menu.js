/*
  Menu
*/

import React from 'react';
import { Link } from 'react-router';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

@autobind
class Menu extends React.Component {

  constructor() {
    super();

    this.state = {
      menu : []
    }
  }


  componentDidMount() {
    console.log('Fetching Menu from server')
    fetch('http://localhost:6543/menu', {
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': this.props.csrfToken
      }
    }).then(r => r.json())
      .then(data => this.setState({
          menu : data
      }))
      .catch(e => console.log("Error "+e))
    }

  renderMenu(key) {
    console.debug('Rendering Menu Items')
    return(
      <li className="nav-item" key={this.state.menu[key].id}>
        <Link className="nav-link" to={this.state.menu[key].location}>{this.state.menu[key].name}</Link>
      </li>
    )
  }


    render() {

      {console.log('Returning Menu')}
      return (
        <div>
          <nav className="navbar navbar-light bg-faded">
            <a className="navbar-brand" href="/">GoatFS</a>
            <ul className="nav navbar-nav">
            {Object.keys(this.state.menu).map(this.renderMenu)}
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
export default Menu
