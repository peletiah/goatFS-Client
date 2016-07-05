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
  component: require('../components/App').default,
  childRoutes: [
    { path: '/test',
      getComponent: (location, cb) => {
        cb(null, require('../components/Test').default)
      }
    },
    { path: '/userslist',
      getComponent: (location, cb) => {
        cb(null, require('../components/Userslist').default)
      }
    },
    { onEnter: redirectToLogin,
      path: '/',
      getComponent: (location, cb) => {
        cb(null, require('../components/Hello').default)
      },
      indexRoute: {
        getComponent: (location, cb) => {
          cb(null, require('../components/Hello').default)
        }
      }
    },
    { onEnter: redirectToLogin,
      path: '/hello',
      getComponent: (location, cb) => {
          cb(null, require('../components/Hello').default)
      }
    },

    { onEnter: redirectToLogin,
      path: '/routing',
      getComponent: (location, cb) => {
          cb(null, require('../components/Routing').default)
      }
    },

    { onEnter: redirectToLogin,
      path: '/administration',
      getComponent: (location, cb) => {
          cb(null, require('../components/Administration').default)
      }
    },
    { path: '/login',
      getComponent: (location, cb) => {
        cb(null, require('../components/LoginForm').default)
      }
    },    
    { path: '*',
      getComponent: (location, cb) => {
          cb(null, require('../components/NotFound').default)
      }
    }    
  ]
}


