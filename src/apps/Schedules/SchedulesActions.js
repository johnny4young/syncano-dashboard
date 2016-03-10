import CreateActions from '../../utils/ActionsConstructor.js';

export default CreateActions(
  {
    fetch: {},
    setSchedules: {},
    fetchSchedules: {
      asyncResult: true,
      loading: true,
      children: ['completed', 'failure'],
      method: 'Syncano.Actions.Schedules.list'
    },
    createSchedule: {
      asyncResult: true,
      asyncForm: true,
      children: ['completed', 'failure'],
      method: 'Syncano.Actions.Schedules.create'
    },
    updateSchedule: {
      asyncResult: true,
      asyncForm: true,
      children: ['completed', 'failure'],
      method: 'Syncano.Actions.Schedules.update'
    },
    removeSchedules: {
      loading: true,
      closingDialogs: true,
      asyncResult: true,
      children: ['completed', 'failure'],
      method: 'Syncano.Actions.Schedules.remove'
    }
  },
  {
    withCheck: true,
    withDialog: true
  }
);
