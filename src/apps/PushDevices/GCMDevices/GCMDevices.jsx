import React from 'react';
import Reflux from 'reflux';

import Store from './GCMDevicesStore';
import Actions from './GCMDevicesActions';

import Devices from '../Devices';
import GCMDialog from './GCMDeviceDialog';

export default React.createClass({

  displayName: 'GCMDevices',

  mixins: [
    Reflux.connect(Store)
  ],

  componentWillMount() {
    Actions.fetch();
  },

  render() {
    return (
      <div>
        <GCMDialog />
        <Devices
          listItemIcon="android"
          getChekcedItems={Store.getCheckedItems}
          actions={Actions}
          emptyItemHandleClick={Actions.showDialog}
          emptyItemContent="Add GCM Device"
          hideDialogs={this.state.hideDialogs}
          isLoading={this.state.isLoading}
          items={this.state.items}/>
      </div>
    );
  }
});