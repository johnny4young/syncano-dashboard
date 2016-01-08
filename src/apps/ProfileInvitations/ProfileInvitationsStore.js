import Reflux from 'reflux';
import _ from 'lodash';

import {CheckListStoreMixin, StoreLoadingMixin, WaitForStoreMixin} from '../../mixins';

import SessionActions from '../Session/SessionActions';
import SessionStore from '../Session/SessionStore';
import InstancesActions from '../Instances/InstancesActions';
import Actions from './ProfileInvitationsActions';

export default Reflux.createStore({
  listenables: Actions,

  mixins: [
    CheckListStoreMixin,
    StoreLoadingMixin,
    WaitForStoreMixin
  ],

  getInitialState() {
    return {
      items: [],
      isLoading: true
    };
  },

  init() {
    this.data = this.getInitialState();
    this.waitFor(
      SessionActions.setUser,
      this.refreshData
    );
    this.setLoadingStates();
  },

  refreshData() {
    console.debug('ProfileInvitationsStore::refreshData');
    Actions.fetchInvitations();
  },

  getInviations(empty) {
    return this.data.items || empty || null;
  },

  setInvitations(items) {
    this.data.items = items;
    this.trigger(this.data);
  },

  onFetchInvitationsCompleted(items) {
    let invKey = SessionStore.getRouter().getCurrentQuery().invitation_key || null;
    let isInvitedByEmail = _.some(items._items, 'key', invKey);

    if (invKey !== null && isInvitedByEmail) {
      Actions.acceptInvitations(invKey);
      return;
    }

    console.debug('ProfileInvitationsStore::onFetchInvitationsCompleted');
    Actions.setInvitations(items._items);
  },

  onFetchInvitationsFailure() {
    console.debug('ProfileInvitationsStore::onFetchInvitationsFailure');
    this.trigger(this.data);
  },

  onAcceptInvitationsCompleted() {
    let invKey = SessionStore.getRouter().getCurrentQuery().invitation_key || null;

    if (invKey === localStorage.getItem('invitationKey')) {
      localStorage.removeItem('invitationKey');
    }

    InstancesActions.fetch();
    this.data.hideDialogs = true;
    this.trigger(this.data);
    this.refreshData();
  },

  onAcceptInvitationsFailure() {
    this.refreshData();
  },

  onDeclineInvitationsCompleted() {
    this.refreshData();
  },

  onDeclineInvitationsFailure() {
    this.refreshData();
  }
});
