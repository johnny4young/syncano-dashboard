import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import {InstanceTabsMixin} from '../../mixins';
import HeaderMixin from '../Header/HeaderMixin';

// Stores and Actions
import Actions from './TemplatesActions';
import Store from './TemplatesStore';

// Components
import {Container, Socket} from 'syncano-components';
import {InnerToolbar} from '../../common';

// Local components
import TemplatesList from './TemplatesList';
import TemplateDialog from './TemplateDialog';


export default React.createClass({

  displayName: 'Templates',

  mixins: [
    Router.State,
    Router.Navigation,
    Reflux.connect(Store),
    InstanceTabsMixin,
    HeaderMixin
  ],

  componentDidMount() {
    console.info('Templates::componentDidMount');
    this.fetch();
  },

  showTemplateDialog() {
    Actions.showDialog();
  },

  fetch() {
    Actions.fetch();
  },

  render() {
    return (
      <div>
        <TemplateDialog />

        <InnerToolbar title="Template Sockets">
          <Socket.CodeBox
            tooltipPosition="bottom-left"
            onTouchTap={this.showTemplateDialog}/>
        </InnerToolbar>

        <Container>
          <TemplatesList
            name="Template Sockets"
            isLoading={this.state.isLoading}
            items={this.state.items}
            hideDialogs={this.state.hideDialogs}
            emptyItemHandleClick={this.showCodeBoxDialog}
            emptyItemContent="Create a Template Socket"/>
        </Container>

      </div>
    );
  }
});
