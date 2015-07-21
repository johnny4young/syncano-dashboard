import Reflux from 'reflux';

// Utils & Mixins
import Mixins from '../../mixins';

//Stores & Actions
import GroupsActions from './GroupsActions';

let GroupDialogStore = Reflux.createStore({
  listenables : GroupsActions,

  mixins      : [
    Mixins.StoreForm,
    Mixins.DialogStore,
    Mixins.StoreLoading
  ],

  getInitialState() {
    return {
      isLoading : false,
      label     : null
    };
  },

  init() {
    this.data = this.getInitialState();
    this.listenToForms();
    this.setLoadingStates();
  },

  onCreateGroupCompleted() {
    console.debug('GroupDialogStore::onCreateGroupCompleted');
    this.dismissDialog();
    GroupsActions.fetchGroups();
  },

  onUpdateGroupCompleted() {
    console.debug('GroupDialogStore::onUpdateGroupCompleted');
    this.dismissDialog();
    GroupsActions.fetchGroups();
  }

});

module.exports = GroupDialogStore;
