import React from 'react';

import ChannelsActions from '../Channels/ChannelsActions';
import DataViewsActions from '../Data/DataViewsActions';
import CodeBoxesActions from '../CodeBoxes/CodeBoxesActions';
import TriggersActions from '../Triggers/TriggersActions';
import SchedulesActions from '../Schedules/SchedulesActions';

import {Socket} from 'syncano-components';
import Popover from '../PushNotifications/ConfigPushNotificationsPopover';

export default React.createClass({
  displayName: 'SocketsEmpty',

  getStyles() {
    return {
      container: {
        margin: '20px auto'
      },
      title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 600
      },
      subtitle: {
        textAlign: 'center',
        fontSize: 20,
        padding: '20px 0 40px 0'
      },
      listContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      socketDescription: {
        paddingTop: 5,
        color: '#9B9B9B'
      }
    };
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.container}>
        <div style={styles.title}>
          Start building your app here
        </div>
        <div style={styles.subtitle}>
          Pick a functionality you need and start building your API
        </div>
        <Socket.EmptyListItem
          addTooltip="Create a Data View"
          handleAdd={DataViewsActions.showDialog}
          socketName="Data"
          title="Add Data">
          <div style={styles.socketDescription}>
            Place your objects and manage data templates on Syncano.
          </div>
        </Socket.EmptyListItem>
        <Socket.EmptyListItem
          addTooltip="Create a Channel"
          handleAdd={ChannelsActions.showDialog}
          socketName="Channel"
          title="Manage Channels">
          <div style={styles.socketDescription}>
            Get real-time updates to keep your data synchronized.
          </div>
        </Socket.EmptyListItem>
        <Socket.EmptyListItem
          addTooltip="Create a CodeBox"
          handleAdd={CodeBoxesActions.showDialog}
          socketName="CodeBox"
          title="Write CodeBoxes™">
          <div style={styles.socketDescription}>
            Run scripts on our servers and use them for business logic.
          </div>
        </Socket.EmptyListItem>

        <Socket.EmptyListItem
          addTooltip="Configure a Push Notification"
          handleAdd={this.refs.popover ? this.refs.popover.toggle : null}
          socketName="Push"
          title="Send Push Notifications">
          <div style={styles.socketDescription}>
            Instantly message your mobile users with timely and relevant content.
          </div>
        </Socket.EmptyListItem>

        <Popover ref="popover"/>

        <Socket.EmptyListItem
          addTooltip="Create a Trigger"
          handleAdd={TriggersActions.showDialog}
          socketName="Trigger"
          title="Configure Triggers">
          <div style={styles.socketDescription}>
            Execute a CodeBox™ when your data is created, updated or deleted.
          </div>
        </Socket.EmptyListItem>
        <Socket.EmptyListItem
          addTooltip="Create a Schedule"
          handleAdd={SchedulesActions.showDialog}
          socketName="Schedule"
          title="Create Schedules">
          <div style={styles.socketDescription}>
            Plan events and run codeboxes at desired times.
          </div>
        </Socket.EmptyListItem>
      </div>
    );
  }
});
