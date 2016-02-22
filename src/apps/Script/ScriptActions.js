import CreateActions from '../../utils/ActionsConstructor.js';

export default CreateActions({
  setCurrentScriptTraces: {},
  setCurrentScriptId: {},
  setCurrentScript: {},
  fetch: {},

  runScriptWithUpdate: {
    asyncResult: true,
    loading: true,
    children: ['completed', 'failure'],
    method: 'Syncano.Actions.Scripts.runWithUpdate'
  },

  fetchScript: {
    asyncResult: true,
    loading: true,
    children: ['completed', 'failure'],
    method: 'Syncano.Actions.Scripts.get'
  },

  updateScript: {
    asyncResult: true,
    asyncForm: true,
    children: ['completed', 'failure'],
    method: 'Syncano.Actions.Scripts.update'
  },

  runScript: {
    asyncResult: true,
    loading: true,
    children: ['completed', 'failure'],
    method: 'Syncano.Actions.Scripts.run'
  },

  fetchScriptTraces: {
    asyncResult: true,
    loading: true,
    children: ['completed', 'failure'],
    method: 'Syncano.Actions.Scripts.listTraces'
  }
});