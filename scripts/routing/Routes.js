/*
  Routes
*/

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Route from './Route'
import { fetchRoutes } from './Actions';

const RouteListItem = ({
    route
  }) => (
  <li className="list-group-item">
    <Link className="list-group-item-action" to={`/route/${route.id}`}>
      Route {route.id}
    </Link>
  </li>
)

class Routes extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchRoutes } = this.props;
    fetchRoutes()
  };

  


  render() {
    const { routes } = this.props
    if (routes) {
      return(
        <div>
          <button type="button">Add Route</button>
          <ul className="list-group">
            {routes.map((route, index) => 
              <RouteListItem
                key={route.id}
                route = { route }
                index = { index }
              />
            )}
          </ul>
        </div>
      )
    } 
    else 
    {
      return (
        <div>
          blublu
        </div>
      )
    }
  }
};

// connect listens to changes in store
// if something changed, it calls mapStateToProps
// which filters filters the slice of the store we are
// interested in this component ("store.routes" in this case)
// connect then returns the component plus the
// store-data we are interested in
// https://learn.co/lessons/map-state-to-props-readme
const mapStateToProps = (store) => ({
  routes: store.routes
})


// mapDispatchToProps receives the dispatch-function
// from the store and bindActionCreators wraps the action
// creator ('fetchRoutes') into the dispatch-function,
// which then can be called directly in componentDidMount()
// https://learn.co/lessons/map-dispatch-to-props-readme
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchRoutes: fetchRoutes
      }, dispatch);
};

Routes = connect(mapStateToProps, mapDispatchToProps)(Routes)

export default Routes;
