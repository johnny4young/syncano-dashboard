import React from 'react';
import {State, Navigation} from 'react-router';
import Reflux from 'reflux';

import Mixins from '../../mixins';
import HeaderMixin from '../Header/HeaderMixin';

import Actions from './SchedulesActions';
import Store from './SchedulesStore';
import SnippetsActions from '../Snippets/SnippetsActions';

import SchedulesList from './SchedulesList';
import ScheduleDialog from './ScheduleDialog';
import {Container, InnerToolbar, Socket} from '../../common';

export default React.createClass({

  displayName: 'ScheduleSockets',

  mixins: [
    State,
    Navigation,

    Reflux.connect(Store),
    Mixins.Dialogs,
    Mixins.InstanceTabs,
    HeaderMixin
  ],

  componentWillMount() {
    Actions.fetch();
    SnippetsActions.fetch();
  },

  showScheduleDialog() {
    Actions.showDialog();
  },

  render() {
    return (
      <div>
        <ScheduleDialog />

        <InnerToolbar title="Schedule Sockets">
          <Socket.Schedule
            tooltipPosition="bottom-left"
            onTouchTap={this.showScheduleDialog}/>
        </InnerToolbar>

        <Container>
          <SchedulesList
            name="Schedules"
            isLoading={this.state.isLoading}
            items={this.state.items}
            hideDialogs={this.state.hideDialogs}
            emptyItemHandleClick={this.showScheduleDialog}
            emptyItemContent="Create a Schedule Socket"/>
        </Container>
      </div>
    );
  }
});