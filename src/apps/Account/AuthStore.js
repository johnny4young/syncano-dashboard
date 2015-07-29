import Reflux from 'reflux';
import analytics from '../../segment';
import StoreFormMixin from '../../mixins/StoreFormMixin';
import SessionActions from '../Session/SessionActions';
import SessionStore from '../Session/SessionStore';
import Actions from './AuthActions';
import AuthConstans from './AuthConstants';

export default Reflux.createStore({
  listenables: Actions,
  
  mixins: [StoreFormMixin],

  getInitialState() {
    return {
      email           : null,
      password        : null,
      confirmPassword : null
    };
  },

  init() {
    this.data = this.getInitialState();
    this.listenTo(SessionStore, this.checkSession);
    this.listenToForms();
  },

  onActivate() {
    this.trigger({
      status: 'Account activation in progress...'
    });
  },

  onActivateCompleted(payload) {
    this.trigger({
      status: 'Account activated successfully. You\'ll now be redirected to Syncano Dashboard.'
    });
    this.onPasswordSignInCompleted(payload);
    setTimeout(function() {
      SessionStore.getRouter().transitionTo(AuthConstans.LOGIN_REDIRECT_PATH);
    }, 3000);
  },

  onActivateFailure() {
    this.trigger({
      status: 'Invalid or expired activation link.'
    });
  },

  onPasswordSignUpCompleted(payload) {
    analytics.track('Sign up Dashboard', {
      authBackend: 'password'
    });
    this.onPasswordSignInCompleted(payload);
  },

  onPasswordSignInCompleted(payload) {
    SessionActions.login(payload);
  },

  onPasswordResetCompleted() {
    this.trigger({
      email    : null,
      feedback : 'Check your inbox.'
    });
  },

  onPasswordResetConfirmCompleted(payload) {
    this.onPasswordSignInCompleted(payload);
    SessionStore.getRouter().transitionTo('password-update');
  },

  checkSession(Session) {
    if (Session.isAuthenticated()) {
      this.trigger(this.data);
    }
  },

  onSocialLoginCompleted(payload) {
    console.debug('AuthStore::onSocialLoginCompleted', payload);
    analytics.track('Sign up Dashboard', {
      authBackend: payload.network
    });
    this.onPasswordSignInCompleted(payload);
  }
});
