import React from 'react';

import Actions from '../DevicesActions';

import DeviceDialog from '../DeviceDialog';

export default React.createClass({

  displayName: 'APNDeviceDialog',

  render() {
    return (
      <div>
        <DeviceDialog
          handleAddSubmit={Actions.createGCMDevice}
          handleEditSubmit={Actions.updateGCMDevice}/>
      </div>
    );
  }
});
