var React       = require('react'),
    State       = require('react-router').State,
    
    HeaderMixin = require('../Header/HeaderMixin');

module.exports = React.createClass({

  displayName: 'Webhooks',

  mixins: [
    HeaderMixin,
    State
  ],

  headerMenuItems: function() {
    var params = {instanceName: this.getParams().instanceName};
    return [
      {
        label: 'Data Browser', 
        route: 'data-objects', 
        params: params
      }, {
        label: 'Classes', 
        route: 'classes', 
        params: params},
      {
        label: 'API Keys', 
        route: 'api-keys', 
        params: params
      }, {
        label: 'Admins', 
        route: 'admins', 
        params: params
      }, {
        label: 'Users', 
        route: 'users', 
        params: params
      }, {
        label: 'CodeBoxes', 
        route: 'codeboxes', 
        params: params
      }, {
        label: 'Webhooks', 
        route: 'webhooks', 
        params: params,
      }, {
        label: 'Tasks', 
        route: 'tasks', 
        params: params
      }];
  },

  render: function () {
    return (
      <div>Webhooks</div>
    );
  }

});