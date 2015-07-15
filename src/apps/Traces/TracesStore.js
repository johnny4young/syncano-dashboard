var Reflux              = require('reflux'),

    // Utils & Mixins
    CheckListStoreMixin = require('../../mixins/CheckListStoreMixin'),

    // Stores & Actions
    SessionStore        = require('../Session/SessionStore'),
    AuthStore           = require('../Account/AuthStore'),
    TracesActions       = require('./TracesActions');

var TracesStore = Reflux.createStore({
  listenables: TracesActions,

  getInitialState: function() {
    return {
      items     : [],
      objectId  : null,
      isLoading : true,
      payload   : ''
    }
  },

  init: function() {

    this.data = {
      items: []
    };

    // We want to know when we are ready to download data for this store,
    // it depends on instance we working on
    this.listenTo(SessionStore, this.refreshData);
  },

  refreshData: function() {
    console.debug('TracesStore::refreshData');

    if (SessionStore.instance) {
      if (this.data.objectId) {
        TracesActions.getTraces(this.data.objectId);
      }
    }
  },

  onSetCurrentObjectId: function(ObjectId) {
    console.debug('TracesStore::onSetCurrentObjectId', ObjectId);
    this.data.objectId = ObjectId;
    this.trigger(this.data)
  },

  onGetTracesCompleted: function(tracesObj) {
    console.debug('TracesStore::onGetCodeBoxTraces', tracesObj);

    this.data.items = Object.keys(tracesObj).map(function(item) {
      return tracesObj[item];
    });
    this.data.isLoading = false;
    this.trigger(this.data);
  }

});

module.exports = TracesStore;
