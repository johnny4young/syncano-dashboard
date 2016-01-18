import Reflux from 'reflux';
import D from 'd.js';

import {CheckListStoreMixin, StoreLoadingMixin, WaitForStoreMixin}from '../../mixins';

import SessionActions from '../Session/SessionActions';
import Actions from './SnippetsActions';

export default Reflux.createStore({
  listenables: Actions,

  mixins: [
    CheckListStoreMixin,
    StoreLoadingMixin,
    WaitForStoreMixin
  ],

  langMap: {
    python: 'python',
    nodejs: 'javascript',
    ruby: 'ruby',
    golang: 'golang',
    php: 'php',
    swift: 'swift'
  },

  runtimeColors: {
    nodejs: {color: '#80BD01', icon: 'language-nodejs'},
    python: {color: '#FFC107', icon: 'language-python'},
    golang: {color: '#95DCF4', icon: 'language-golang'},
    ruby: {color: '#ED4545', icon: 'language-ruby'},
    swift: {color: '#FC8737', icon: 'language-swift'},
    php: {color: '#6C7EB7', icon: 'language-php'},
    default: {color: '#244273', icon: 'xml'}
  },

  getInitialState() {
    return {
      items: [],
      triggers: [],
      schedules: [],

      currentSnippetId: null,

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
    this.listenTo(Actions.setCurrentSnippetId, this.fetchTraces);
  },

  fetchTraces() {
    console.debug('SnippetsStore::fetchTraces');
    if (this.data.currentSnippetId === null) {
      return;
    }
    Actions.fetchSnippetTraces(this.data.currentSnippetId);
  },

  getItems() {
    return this.data.items;
  },

  getEditorMode(snippet) {
    return this.langMap[snippet.runtime_name];
  },

  getRuntimeColorIcon(runtimeName) {
    let runtime = this.runtimeColors[runtimeName] ? runtimeName : 'default';

    return this.runtimeColors[runtime];
  },

  getSnippetsDropdown() {
    return this.data.items.map((item) => {
      return {
        payload: item.id,
        text: item.label
      };
    });
  },

  getCurrentSnippet() {
    if (!this.data.currentSnippetId) {
      return null;
    }

    let currentItem = null;

    this.data.items.some((item) => {
      if (item.id.toString() === this.data.currentSnippetId.toString()) {
        currentItem = item;
        return true;
      }
    });
    return currentItem;
  },

  getSnippetById(id) {
    let snippet = null;

    this.data.items.some((item) => {
      if (item.id.toString() === id.toString()) {
        snippet = item;
        return true;
      }
    });
    return snippet;
  },

  getSnippetIndex(id) {
    let snippetIndex = null;

    this.data.items.some((item, index) => {
      if (item.id.toString() === id.toString()) {
        snippetIndex = index;
        return true;
      }
    });
    return snippetIndex;
  },

  refreshData() {
    console.debug('SnippetsStore::refreshData');
    D.all([
      Actions.fetchSnippets(),
      Actions.fetchTriggers(),
      Actions.fetchSchedules()
    ]).then(() => {
      this.data.isLoading = false;
      this.trigger(this.data);
    });
  },

  setSnippets(items) {
    this.data.items = items;
    this.trigger(this.data);
  },

  setSnippetTraces(items) {
    this.data.traces = Object.keys(items).sort().map((key) => items[key]);
    this.trigger(this.data);
  },

  onSetCurrentSnippetId(snippetId) {
    console.debug('SnippetsStore::onSetCurrentSnippetId', snippetId);
    this.data.currentSnippetId = snippetId;
    this.trigger(this.data);
  },

  onRemoveSnippetsCompleted() {
    console.debug('SnippetsStore::onRemoveSnippetsCompleted');
    this.data.hideDialogs = true;
    this.refreshData();
  },

  onFetchSnippetsCompleted(snippets) {
    console.debug('SnippetsStore::onFetchSnippetsCompleted');
    Actions.setSnippets(snippets._items);
  },

  onFetchTriggersCompleted(triggers) {
    console.debug('SnippetsStore::onFetchTriggersCompleted');
    this.setItems(triggers, 'triggers');
  },

  onFetchSchedulesCompleted(schedules) {
    console.debug('SnippetsStore::onFetchSchedulesCompleted');
    this.setItems(schedules, 'schedules');
  },

  setItems(items, itemsType) {
    this.data[itemsType] = Object.keys(items).map((key) => items[key]);
  },

  onRunSnippet() {
    console.debug('SnippetsStore::onRunSnippet');
    this.trigger(this.data);
  },

  onRunSnippetCompleted(trace) {
    console.debug('SnippetsStore::onRunSnippetCompleted');
    this.data.lastTrace = trace;
    Actions.fetchSnippetTrace(this.data.currentSnippetId, trace.id);
  },

  onFetchSnippetTraceCompleted(trace) {
    console.debug('SnippetsStore::onFetchSnippetTrace');
    if (trace.status === 'pending') {
      let snippetId = this.data.currentSnippetId;

      setTimeout(() => {
        Actions.fetchSnippetTrace(snippetId, trace.id);
      }, 300);
    } else {
      this.data.lastTraceResult = trace.result;
    }
    this.trigger(this.data);
  },

  onFetchSnippetTracesCompleted(items) {
    console.debug('SnippetsStore::onFetchSnippetTraces');
    Actions.setSnippetTraces(items);
  }
});
