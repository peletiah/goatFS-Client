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
  component: require('../app/App').default,
  childRoutes: [
    { onEnter: redirectToLogin,
      path: '/',
      getComponent: (location, cb) => {
        cb(null, require('../routing/Routing').default)
      },
      indexRoute: {
        getComponent: (location, cb) => {
          cb(null, require('../routing/Routing').default)
        }
      }
    },
    { onEnter: redirectToLogin,
      path: '/routing',
      getComponent: (location, cb) => {
          cb(null, require('../routing/Routing').default)
      }
    },
    { onEnter: redirectToLogin,
      path: '/administration',
      getComponent: (location, cb) => {
          cb(null, require('../administration/Administration').default)
      }
    },
    { onEnter: redirectToLogin,
      path: '/hello',
      getComponent: (location, cb) => {
          cb(null, require('../other/Hello').default)
      }
    },

    { path: '/login',
      getComponent: (location, cb) => {
        cb(null, require('./LoginForm').default)
      }
    },    
    { path: '/test',
      getComponent: (location, cb) => {
        cb(null, require('../other/Test').default)
      }
    }, 
    { path: '*',
      getComponent: (location, cb) => {
          cb(null, require('../app/NotFound').default)
      }
    }  
  ]
}


