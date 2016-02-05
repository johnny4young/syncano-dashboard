import Reflux from 'reflux';

// Utils & Mixins
import {StoreFormMixin, DialogStoreMixin} from '../../mixins';

// Stores & Actions
import Actions from './TemplatesActions';
import SnippetsActions from '../Snippets/SnippetsActions';
import SnippetsStore from '../Snippets/SnippetsStore';

export default Reflux.createStore({
  listenables: Actions,
  mixins: [
    StoreFormMixin,
    DialogStoreMixin
  ],

  getInitialState() {
    return {
      label: '',
      signal: '',
      class: '',
      snippets: [
        {
          payload: '',
          text: 'Loading...'
        }
      ]
    };
  },

  init() {
    this.listenToForms();
    this.listenTo(SnippetsActions.setSnippets, this.getSnippetDropdown);
  },

  getSnippetDropdown() {
    console.debug('DataViewDialogStore::getSnippetDropdown');
    let snippets = SnippetsStore.getSnippetsDropdown();

    if (snippets.length === 0) {
      snippets = [{payload: '', text: 'No Snippets, add one first'}];
    }
    this.trigger({snippets});
  },

  onCreateCodeBoxCompleted() {
    console.debug('CodeBoxDialogStore::onCreateCodeBoxCompleted');
    this.dismissDialog();
    Actions.fetchCodeBoxes();
  },

  onUpdateCodeBoxCompleted() {
    console.debug('CodeBoxDialogStore::onUpdateCodeBoxCompleted');
    this.dismissDialog();
    Actions.fetchCodeBoxes();
  }
});
