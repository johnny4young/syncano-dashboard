var React                       = require('react'),
    Router                      = require('react-router'),
    Route                       = Router.Route,
    NotFoundRoute               = Router.NotFoundRoute,

    // Pages
    App                         = require('./pages/app.react'),
    Dashboard                   = require('./pages/dashboard.react'),
    NotFound                    = require('./pages/notfound.react'),

    // Account
    AccountLogin                = require('./apps/Account/AccountLogin.react'),
    AccountSignup               = require('./apps/Account/AccountSignup.react'),
    AccountActivate             = require('./apps/Account/AccountActivate.react'),
    AccountPasswordReset        = require('./apps/Account/AccountPasswordReset.react'),
    AccountPasswordResetConfirm = require('./apps/Account/AccountPasswordResetConfirm.react'),

    // Instances
    Instances                   = require('./apps/Instances/Instances.react'),

    // Examples
    Examples                    = require('./examples/Examples.react');


module.exports = (
  <Route name="app" handler={App} path="/">
    <Route name="login" handler={AccountLogin}/>
    <Route name="signup" handler={AccountSignup} />
    <Route name="activate" handler={AccountActivate} path="/activate/:uid-:token" />
    <Route name="password-reset" handler={AccountPasswordReset} path="/password/reset" />
    <Route name="password-reset-confirm" handler={AccountPasswordResetConfirm} path="/password/reset/:uid-:token" />

    <Route name="dashboard" handler={Dashboard} path="/">
      <Route name="instance-list" handler={Instances} path="/instances" />
    </Route>

    <Route name="examples" handler={Examples}/>
    <NotFoundRoute handler={NotFound} />
  </Route>
)