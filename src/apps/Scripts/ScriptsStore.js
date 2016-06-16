import Reflux from 'reflux';
import Promise from 'axios';
import _ from 'lodash';

import { StoreHelpersMixin, CheckListStoreMixin, StoreLoadingMixin, WaitForStoreMixin } from '../../mixins';

import SessionActions from '../Session/SessionActions';
import Actions from './ScriptsActions';

export default Reflux.createStore({
  listenables: Actions,

  mixins: [
    StoreHelpersMixin,
    CheckListStoreMixin,
    StoreLoadingMixin,
    WaitForStoreMixin
  ],

  langMap: {
    nodejs: 'javascript',
    'nodejs_library_v0.4': 'javascript',
    'nodejs_library_v1.0': 'javascript',
    python: 'python',
    'python_library_v4.2': 'python',
    'python_library_v5.0': 'python',
    ruby: 'ruby',
    golang: 'golang',
    php: 'php',
    swift: 'swift'
  },

  runtimeColors: {
    nodejs: { color: '#80BD01', icon: 'language-nodejs' },
    'nodejs_library_v0.4': { color: '#80BD01', icon: 'language-nodejs' },
    'nodejs_library_v1.0': { color: '#80BD01', icon: 'language-nodejs' },
    python: { color: '#FFC107', icon: 'language-python' },
    'python_library_v4.2': { color: '#FFC107', icon: 'language-python' },
    'python_library_v5.0': { color: '#FFC107', icon: 'language-python' },
    golang: { color: '#95DCF4', icon: 'language-golang' },
    ruby: { color: '#ED4545', icon: 'language-ruby' },
    swift: { color: '#FC8737', icon: 'language-swift' },
    php: { color: '#6C7EB7', icon: 'language-php' },
    default: { color: '#244273', icon: 'xml' }
  },

  getInitialState() {
    return {
      items: [],
      triggers: [],
      schedules: [],

      currentScriptId: null,

      AddDialogVisible: true,
      availableRuntimes: null,
      label: '',
      payload: '{"112":111}',
      description: '',
      selectedRuntimeIndex: 0,
      traces: [],
      isLoading: true
    };
  },

  init() {
    this.data = this.getInitialState();
    this.waitFor(
      SessionActions.setUser,
      SessionActions.setInstance,
      this.refreshData
    );
    this.setLoadingStates();
    this.listenTo(Actions.setCurrentScriptId, this.fetchTraces);
  },

  fetchTraces() {
    console.debug('ScriptsStore::fetchTraces');
    if (this.data.currentScriptId === null) {
      return;
    }
    Actions.fetchScriptTraces(this.data.currentScriptId);
  },

  getItems() {
    return this.data.items;
  },

  getEditorMode(script) {
    return this.langMap[script.runtime_name];
  },

  getRuntimeColorIcon(runtimeName) {
    const runtime = this.runtimeColors[runtimeName] ? runtimeName : 'default';

    return this.runtimeColors[runtime];
  },

  getScriptsDropdown() {
    const { items } = this.data;

    return _.map(items, (item) => {
      return {
        payload: item.id,
        text: item.label
      };
    });
  },

  getScriptById(id) {
    const { items } = this.data;

    return _.find(items, ['id', id]);
  },

  getScriptIndex(id) {
    let scriptIndex = null;

    this.data.items.some((item, index) => {
      if (item.id.toString() === id.toString()) {
        scriptIndex = index;
        return true;
      }
    });
    return scriptIndex;
  },

  refreshData() {
    console.debug('ScriptsStore::refreshData');
    Promise.all([
      Actions.fetchScripts(),
      Actions.fetchTriggers(),
      Actions.fetchSchedules()
    ]).then(() => {
      this.data.isLoading = false;
      this.trigger(this.data);
    });
  },

  saveScripts(sockets) {
    console.debug('ScriptsStore::onFetchSocketsCompleted');
    Actions.setScripts(sockets.scripts);
  },

  setScripts(items) {
    this.data.items = items;
    this.trigger(this.data);
  },

  setScriptTraces(items) {
    this.data.traces = Object.keys(items).sort().map((key) => items[key]);
    this.trigger(this.data);
  },

  onSetCurrentScriptId(scriptId) {
    console.debug('ScriptsStore::onSetCurrentScriptId', scriptId);
    this.data.currentScriptId = scriptId;
    this.trigger(this.data);
  },

  onRemoveScriptsCompleted() {
    console.debug('ScriptsStore::onRemoveScriptsCompleted');
    this.data.hideDialogs = true;
    this.refreshData();
  },

  onFetchScriptsCompleted(scripts) {
    console.debug('ScriptsStore::onFetchScriptsCompleted');
    Actions.setScripts(scripts);
  },

  onFetchTriggersCompleted(triggers) {
    console.debug('ScriptsStore::onFetchTriggersCompleted');
    this.setItems(triggers, 'triggers');
  },

  onFetchSchedulesCompleted(schedules) {
    console.debug('ScriptsStore::onFetchSchedulesCompleted');
    this.setItems(schedules, 'schedules');
  },

  setItems(items, itemsType) {
    this.data[itemsType] = Object.keys(items).map((key) => items[key]);
  },

  onRunScript() {
    console.debug('ScriptsStore::onRunScript');
    this.trigger(this.data);
  },

  onRunScriptCompleted(trace) {
    console.debug('ScriptsStore::onRunScriptCompleted');
    this.data.lastTrace = trace;
    Actions.fetchScriptTrace(this.data.currentScriptId, trace.id);
  },

  onFetchScriptTraceCompleted(trace) {
    console.debug('ScriptsStore::onFetchScriptTrace');
    if (trace.status === 'pending') {
      const { currentScriptId } = this.data;

      setTimeout(() => {
        Actions.fetchScriptTrace(currentScriptId, trace.id);
      }, 300);
    } else {
      this.data.lastTraceResult = trace.result;
    }
    this.trigger(this.data);
  },

  onFetchScriptTracesCompleted(items) {
    console.debug('ScriptsStore::onFetchScriptTraces');
    Actions.setScriptTraces(items);
  }
});
