import Reflux from 'reflux';

// Utils & Mixins
import Mixins from '../../mixins';

//Stores & Actions
import AdminsActions from './AdminsActions';
import AdminsInvitationsActions from './AdminsInvitationsActions';

export default Reflux.createStore({
  listenables : [
    AdminsActions,
    AdminsInvitationsActions
  ],
  mixins      : [
    Mixins.StoreForm,
    Mixins.DialogStore
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

  getInitialState() {
    return {
      email : null,
      role  : ''
    };
  },

  init() {
    this.listenToForms();
  },

  getRoles() {
    return this.roleMenuItems;
  },

  onCreateInvitationCompleted() {
    console.debug('AdminDialogStore::onCreateInvitationCompleted');
    this.dismissDialog();
    AdminsInvitationsActions.fetchInvitations();
  },

  onUpdateAdminCompleted() {
    console.debug('AdminDialogStore::onUpdateAdminCompleted');
    this.dismissDialog();
    AdminsActions.fetchAdmins();
  }
});
