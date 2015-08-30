import Reflux from 'reflux';
import D from 'd.js';
import _ from 'lodash';

// Utils & Mixins
import Mixins from '../../mixins';

// Stores & Actions
import SessionStore from '../Session/SessionStore';
import SessionActions from '../Session/SessionActions';
import Actions from './AddVersionViewActions';

export default Reflux.createStore({
  listenables: Actions,
  mixins: [
    Mixins.StoreForm,
    Mixins.DialogStore,
    Mixins.WaitForStore,
    Mixins.StoreHelpers
  ],

  types: [
    {
      text: 'stable',
      payload: 'stable'
    },
    {
      text: 'development',
      payload: 'devel'
    }
  ],

  getInitialState() {
    return {
      name: null,
      type: 'devel',
      description: null,
      instance: null,
      instances: null,
      instanceData: {
        views: [],
        classes: [],
        webhooks: [],
        codeboxes: [],
        triggers: [],
        schedules: [],
        channels: []

      },
      exportSpec: {
        views: [],
        classes: {},
        webhooks: [],
        codeboxes: {},
        triggers: {},
        schedules: {},
        channels: {}
      }
    };
  },

  init() {
    this.data = this.getInitialState();
    this.listenToForms();
    this.waitFor(
      SessionActions.setUser,
      Actions.fetchInstances,
      this.refreshData
    );

    this.listenTo(SessionActions.fetchInstance.completed, this.fetchInstanceData);
  },

  refreshData() {
    console.debug('AddVersionViewStore::refreshData');
    Actions.fetchInstances();
  },

  getTypes() {
    return this.types;
  },

  setInstances(instances) {
    console.debug('AddVersionViewStore::setInstances');
    this.data.instances = _.map(_.keys(instances), (key) => instances[key]);
    this.trigger(this.data);
  },

  getInstancesDropdown() {
    let instances = this.data.instances;

    if (!instances) {
      return [{payload: '', text: 'Loading...'}];
    }

    return _.map(instances, (instance) => {
      let instanceText = instance.name;

      if (instance.description) {
        instanceText += ` (${instance.description})`;
      }

      return {
        payload: instance.name,
        text: instanceText
      }
    });
  },

  setInstance(instance) {
    this.data.instance = instance;
    Actions.fetchInstance(instance)
      .then(Actions.fetchInstanceData);
  },
  setInstanceData() {
    this.data.dataReady = true;
    this.trigger(this.data);
  },

  fetchInstanceData() {
    console.debug('AddVersionViewStore::fetchInstanceData');

    this.data.instanceData = this.getInitialState().instanceData;
    this.data.dataReady = 'loading';
    this.trigger(this.data);

    D.all([
      Actions.fetchClasses(),
      Actions.fetchDataViews(),
      Actions.fetchWebhooks(),
      Actions.fetchTriggers(),
      Actions.fetchCodeBoxes(),
      Actions.fetchSchedules(),
      Actions.fetchChannels()
    ])
      .then(this.setInstanceData);
  },

  onFetchClassesCompleted(obj) {
    this.data.instanceData.classes = this.saveListFromSyncano(obj);
  },

  onFetchWebhooksCompleted(obj) {
    this.data.instanceData.webhooks = this.saveListFromSyncano(obj);
  },

  onFetchTriggersCompleted(obj) {
    this.data.instanceData.triggers = this.saveListFromSyncano(obj);
  },

  onFetchSchedulesCompleted(obj) {
    this.data.instanceData.schedules = this.saveListFromSyncano(obj);
  },

  onFetchDataViewsCompleted(obj) {
    this.data.instanceData.views = this.saveListFromSyncano(obj);
  },

  onFetchChannelsCompleted(obj) {
    this.data.instanceData.channels = this.saveListFromSyncano(obj);
  },

  onFetchCodeBoxesCompleted(obj) {
    this.data.instanceData.codeboxes = this.saveListFromSyncano(obj);
  },

  onCreateVersionCompleted() {
    console.debug('AddVersionViewStore::onCreateSolutionCompleted');
    SessionStore.getRouter().transitionTo(
      'solutions-edit',
      SessionStore.getRouter().getCurrentParams()
    );
  },

  onFetchInstancesCompleted(instances) {
    console.debug('SolutionVersionDialogStore::onFetchInstancesCompleted');
    Actions.setInstances(instances);
  }

});

