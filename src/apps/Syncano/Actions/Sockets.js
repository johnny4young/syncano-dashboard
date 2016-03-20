import _ from 'lodash';

export default {
  list(params = {}) {
    _.defaults(params, {ordering: 'desc'});
    const promises = [
      this.Connection.DataViews.list(params),
      this.Connection.WebHooks.list(params),
      this.Connection.Triggers.list(params),
      this.Connection.Schedules.list(params),
      this.Connection.Channels.list(params),
      // this.Connection.PushNotifications.GCM.get(),
      // this.Connection.PushNotifications.APNS.get(),
      // this.Connection.PushNotifications.Devices.list('gcm'),
      // this.Connection.PushNotifications.Devices.list('apns'),
      this.Connection.CodeBoxes.list(params),
      this.Connection.Classes.list(params)
    ];

    this.Promise.all(promises)
      .then((sockets) => {
        return {
          data: sockets[0],
          scriptEndpoints: sockets[1],
          triggers: sockets[2],
          schedules: sockets[3],
          channels: sockets[4],
          scripts: sockets[5],
          classes: sockets[6]
          // gcmPushNotifications: sockets[7],
          // apnsPushNotifications: sockets[8],
          // gcmDevices: sockets[9],
          // apnsDevices: sockets[10],
        };
      })
      .then(this.completed)
      .catch(this.failure);
  }
};
