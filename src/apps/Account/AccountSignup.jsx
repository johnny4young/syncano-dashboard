import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import FormMixin from '../../mixins/FormMixin';

// Stores and Actions
import SessionStore from '../Session/SessionStore';
import SessionActions from '../Session/SessionActions';
import Store from './AuthStore';
import Actions from './AuthActions';
import Constants from './AuthConstants';

// Components
import MUI from 'syncano-material-ui';
import Common from '../../common';
import Container from '../../common/Container/AccountContainer';

export default React.createClass({

  displayName: 'AccountSignup',

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.connect(Store),
    Router.State,
    Router.Navigation,
    FormMixin
  ],

  statics: {
    willTransitionTo(transition) {
      if (SessionStore.isAuthenticated()) {
        transition.redirect(Constants.LOGIN_REDIRECT_PATH, {}, {});
      }
    }
  },

  validatorConstraints: {
    email: {
      presence: true,
      email: {
        message: '^Invalid email address'
      }
    },
    password: {
      presence: true
    }
  },

  componentWillUpdate() {
    // I don't know if it's good place for this but it works
    if (SessionStore.isAuthenticated()) {
      let queryNext = this.getQuery().next || null;
      let lastInstance = localStorage.getItem('lastInstance') || null;

      if (queryNext !== null) {
        this.replaceWith(queryNext);
      } else if (lastInstance !== null) {
        this.replaceWith('instance', {instanceName: lastInstance});
      } else {
        SessionStore
          .getConnection()
          .Instances
          .list()
          .then((instances) => {
            if (instances.length > 0) {
              let instance = instances._items[0];

              localStorage.setItem('lastInstance', instance.name);
              this.replaceWith('instance', {instanceName: instance.name});
            } else {
              this.replaceWith('sockets');
            }
          })
          .catch(() => {
            this.replaceWith('sockets');
          });
      }
    }

    let invKey = this.getQuery().invitation_key || null;

    if (invKey !== null && SessionActions.getInvitationFromUrl() !== invKey) {
      SessionActions.setInvitationFromUrl(invKey);
    }
  },

  getBottomContent() {
    return (
      <p className="vm-0-b text--center">
        By signing up you agree to our
        <a href="http://www.syncano.com/terms-of-service/"
           target="_blank">
        Terms of Use and Privacy Policy
        </a>.
      </p>
    );
  },

  handleSuccessfullValidation(data) {
    SessionStore.setSignUpMode();

    Actions.passwordSignUp({
      email: data.email,
      password: data.password
    });
  },

  render() {
    return (
      <Container bottomContent={this.getBottomContent()}>
        <div className="account-container__content__header vm-3-b">
          <p className="vm-2-b">Start Building Now</p>
          <small>
            Simply enter your email, create a password and you're in!<br />
            No credit card required.
          </small>
        </div>
        {this.renderFormNotifications()}
        <form
          onSubmit={this.handleFormValidation}
          className="account-container__content__form"
          acceptCharset="UTF-8"
          method="post">
          <MUI.TextField
            ref="email"
            valueLink={this.linkState('email')}
            errorText={this.getValidationMessages('email').join(' ')}
            name="email"
            className="text-field"
            autoComplete="email"
            hintText="Email"
            fullWidth={true}/>

          <MUI.TextField
            ref="password"
            valueLink={this.linkState('password')}
            errorText={this.getValidationMessages('password').join(' ')}
            type="password"
            name="password"
            className="text-field vm-4-b"
            autoComplete="password"
            hintText="My password"
            fullWidth={true}/>

          <MUI.RaisedButton
            type="submit"
            label="Create my account"
            labelStyle={{fontSize: '16px'}}
            fullWidth={true}
            style={{boxShadow: 'none', height: '48px'}}
            primary={true}/>
        </form>
        <Common.SocialAuthButtonsList mode="signup"/>

        <div className="account-container__content__footer">
          <ul className="list--flex list--horizontal">
            <li>
              <p>
                <span>Already have an account? </span>
                <Router.Link
                  to="login"
                  query={this.getQuery()}>
                  Login
                </Router.Link>
              </p>
            </li>
          </ul>
        </div>
      </Container>
    );
  }
});