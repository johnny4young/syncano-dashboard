var Reflux                   = require('reflux'),

    // Utils & Mixins
    CheckListStoreMixin      = require('../../mixins/CheckListStoreMixin'),
    StoreFormMixin           = require('../../mixins/StoreFormMixin'),
    WaitForStoreMixin        = require('../../mixins/WaitForStoreMixin'),

    //Stores & Actions
    SessionActions           = require('../Session/SessionActions'),
    AdminsInvitationsActions = require('./AdminsInvitationsActions'),
    AdminsActions            = require('./AdminsActions');

var AdminsStore = Reflux.createStore({
  listenables : AdminsActions,
  mixins      : [
    CheckListStoreMixin,
    StoreFormMixin,
    WaitForStoreMixin
  ],

  roleMenuItems: [
    {
      payload : 'read',
      text    : 'read'
    },
    {
      payload : 'write',
      text    : 'write'
    },
    {
      payload : 'full',
      text    : 'full'
    }
  ],

  getInitialState: function() {
    return {
      items     : [],
      isLoading : true
    }
  },

  init: function() {
    this.data = this.getInitialState();
    this.waitFor(
      SessionActions.setUser,
      SessionActions.setInstance,
      this.refreshData
    );
    this.listenToForms();
  },
  refreshData: function() {
    console.debug('AdminsStore::refreshData');
    AdminsActions.fetchAdmins();
    AdminsInvitationsActions.fetchInvitations();
  },

  setAdmins: function(items) {
    console.debug('AdminsStore::setAdmins');

    this.data.items = Object.keys(items).map(function(key) {
      return items[key];
    });

    this.trigger(this.data);
  },

  getRoles: function() {
    return this.roleMenuItems;
  },

  onFetchAdmins: function() {
    console.debug('AdminsStore::onFetchAdmins');
    this.data.isLoading = true;
    this.trigger(this.data);
  },

  onFetchAdminsCompleted: function(items) {
    console.debug('AdminsStore::onFetchAdminsCompleted');
    this.data.isLoading = false;
    AdminsActions.setAdmins(items);
  },

  onUpdateAdminCompleted: function() {
    console.debug('AdminsStore::onUpdateAdminCompleted');
    this.data.hideDialogs = true;
    this.trigger(this.data);
    this.refreshData();
  },

  onRemoveAdminsCompleted: function() {
    console.debug('AdminsStore::onRemoveAdminsCompleted');
    this.data.hideDialogs = true;
    this.trigger(this.data);
    this.refreshData();
  },

});

module.exports = AdminsStore;
