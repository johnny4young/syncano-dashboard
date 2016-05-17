import CreateActions from '../../../utils/ActionsConstructor.js';

export default CreateActions(
  {
    fetch: {},

    fetchFullBackups: {
      asyncResult: true,
      loading: true,
      children: ['completed', 'failure'],
      method: 'Syncano.Actions.BackupAndRestore.listFullBackups'
    }
  },
  {
    withDialog: true,
    withCheck: true
  }
);
