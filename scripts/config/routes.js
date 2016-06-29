function redirectToLogin(nextState, replace) {
  //TODO this check only works when loggedin exists and is true
  //if (localStorage.loggedin !== 'true') {
  //  replace({
  //    pathname: '/login',
  //    state: { nextPathname: nextState.location.pathname }
  //  })
  //}
}

function redirectToHome(nextState, replace) {
  if (auth.loggedIn()) {
    replace('/')
  }
}

export default {
  component: require('../components/App'),
  childRoutes: [
    { path: '/test',
      getComponent: (location, cb) => {
        cb(null, require('../components/Test'))
      }
    },
    { onEnter: redirectToLogin,
      path: '/',
      getComponent: (location, cb) => {
        cb(null, require('../components/Hello'))
      },
      indexRoute: {
        getComponent: (location, cb) => {
          cb(null, require('../components/Hello'))
        }
      }
    },
    { onEnter: redirectToLogin,
      path: '/hello',
      getComponent: (location, cb) => {
          cb(null, require('../components/Hello'))
      }
    },

    { onEnter: redirectToLogin,
      path: '/routing',
      getComponent: (location, cb) => {
          cb(null, require('../components/Routing'))
      }
    },

    { onEnter: redirectToLogin,
      path: '/administration',
      getComponent: (location, cb) => {
          cb(null, require('../components/Administration'))
      }
    },
    { path: '/login',
      getComponent: (location, cb) => {
        cb(null, require('../components/LoginForm'))
      }
    },    
    { path: '*',
      getComponent: (location, cb) => {
          cb(null, require('../components/NotFound'))
      }
    }    
  ]
}


