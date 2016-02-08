import React from 'react';
import Router from 'react-router';

// Stores and Action
import SnippetsActions from '../apps/Snippets/SnippetsActions';

export default React.createClass({

  displayName: 'SnippetsPage',

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Router.State,
    Router.Navigation
  ],

  componentDidMount() {
    console.debug('SnippetsPage::componentDidMount');
    SnippetsActions.fetch();
  },

  render() {
    return <Router.RouteHandler />;
  }
});
