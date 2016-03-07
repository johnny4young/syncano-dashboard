import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import Radium from 'radium';

import SessionActions from '../../apps/Session/SessionActions';
import SessionStore from '../../apps/Session/SessionStore';
import InstancesStore from '../../apps/Instances/InstancesStore';
import InstanceDialogActions from '../../apps/Instances/InstanceDialogActions';

import {Utils, FontIcon, List, ListItem, IconMenu} from 'syncano-material-ui';
import {ColumnList, Color, Show} from 'syncano-components';

export default Radium(React.createClass({
  displayName: 'HeaderInstancesDropdown',

  contextTypes: {
    router: React.PropTypes.func.isRequired,
    muiTheme: React.PropTypes.object
  },

  mixins: [
    Reflux.connect(InstancesStore),
    Router.Navigation,
    Router.State,
    Utils.Styles
  ],

  componentDidMount() {
    console.info('HeaderInstancesDropdown::componentDidMount');
    InstancesStore.fetch();
  },

  getStyles() {
    return {
      root: {
        height: 56,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 24,
        backgroundColor: '#F2F2F2'
      },
      dropdownInstanceIcon: {
        left: 20,
        minWidth: 32,
        height: 32,
        fontSize: 18,
        lineHeight: '18px',
        display: '-webkit-inline-flex; display: inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        color: '#fff',
        backgroundColor: 'green',
        margin: '8px 16px 8px 0'
      },
      addInstanceList: {
        minWidth: 320,
        paddingBottom: 0,
        paddingTop: 0
      },
      addInstanceIcon: {
        backgroundColor: '#BDBDBD',
        color: '#FFF',
        fontSize: 24
      },
      dropdownMenu: {
        left: 0,
        top: 0,
        maxHeight: 'calc(100vh - 80px)',
        overflow: 'auto',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23)'
      },
      list: {
        minWidth: 320,
        paddingBottom: 0
      },
      separator: {
        borderTop: '1px solid #BDBDBD',
        paddingLeft: 20
      },
      dropdownText: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        paddingLeft: 0,
        textOverflow: 'ellipsis',
        fontSize: 16,
        lineHeight: '24px'
      },
      noInstancesItem: {
        fontWeight: 500,
        color: '#BDBDBD'
      },
      dropdownIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10
      },
      iconMenu: {
        width: '100%'
      }
    };
  },

  handleDropdownItemClick(instanceName) {
    // Redirect to main instance screen
    this.refs.instancesDropdown.close();
    SessionActions.fetchInstance(instanceName);
    localStorage.setItem('lastInstance', instanceName);
    this.transitionTo('instance', {instanceName});
  },

  renderAddInstanceItem() {
    let styles = this.getStyles();
    let icon = (
      <FontIcon
        className="synicon-plus"
        style={this.mergeStyles(styles.dropdownInstanceIcon, styles.addInstanceIcon)}/>
    );

    return (
      <List style={styles.addInstanceList}>
        <ListItem
          primaryText="Add an Instance"
          leftIcon={icon}
          onTouchTap={() => InstanceDialogActions.showDialog()}/>
      </List>
    );
  },

  renderListItems(instances) {
    let styles = this.getStyles();
    let defaultIconBackground = ColumnList.ColumnListConstans.DEFAULT_BACKGROUND;
    let defaultIcon = ColumnList.ColumnListConstans.DEFAULT_ICON;
    let items = instances.map((instance) => {
      let iconName = instance.metadata.icon ? 'synicon-' + instance.metadata.icon : 'synicon-' + defaultIcon;
      let iconBackground = {
        backgroundColor: Color.getColorByName(instance.metadata.color, 'dark') || defaultIconBackground
      };
      let icon = (
        <FontIcon
          className={iconName}
          style={this.mergeStyles(styles.dropdownInstanceIcon, iconBackground)}/>
      );

      return (
        <ListItem
          key={instance.name}
          primaryText={instance.name}
          onTouchTap={this.handleDropdownItemClick.bind(null, instance.name)}
          leftIcon={icon}/>
      );
    });

    return items;
  },

  renderList(instances) {
    let styles = this.getStyles();
    let subheaderText = InstancesStore.amIOwner(instances[0]) ? 'My Instances' : 'Shared with me';

    return (
      <Show if={instances.length > 0}>
        <List
          className={InstancesStore.amIOwner(instances[0]) ? 'my-instances-list' : 'shared-instances-list'}
          style={styles.list}
          subheader={subheaderText}
          subheaderStyle={styles.separator}>
          {this.renderListItems(instances)}
        </List>
      </Show>
    );
  },

  renderDropdownIcon() {
    let styles = this.getStyles();
    let defaultIconBackground = ColumnList.ColumnListConstans.DEFAULT_BACKGROUND;
    let currentInstance = SessionStore.instance;
    let defaultIcon = ColumnList.ColumnListConstans.DEFAULT_ICON;
    let iconStyle = {
      backgroundColor: Color.getColorByName(currentInstance.metadata.color, 'dark') || defaultIconBackground,
      left: 0
    };
    let iconName = currentInstance.metadata.icon ? currentInstance.metadata.icon : defaultIcon;

    return (
      <div style={styles.dropdownIcon}>
        <FontIcon
          className={`synicon-${iconName}`}
          style={this.mergeStyles(styles.dropdownInstanceIcon, iconStyle)}/>
        <div style={styles.dropdownText}>
          {currentInstance.name}
        </div>
        <FontIcon className='synicon-menu-down'/>
      </div>
    );
  },

  render() {
    let styles = this.getStyles();
    let instance = SessionStore.instance;
    let instancesList = InstancesStore.getAllInstances();

    if (!instance || !instancesList.length) {
      return null;
    }

    return (
      <div style={styles.root}>
        <IconMenu
          ref="instancesDropdown"
          onItemTouchTap={this.closeDropdown}
          iconButtonElement={this.renderDropdownIcon()}
          openDirection="bottom-right"
          style={styles.iconMenu}
          menuStyle={styles.dropdownMenu}>
          {this.renderAddInstanceItem()}
          {this.renderList(InstancesStore.getMyInstances())}
          {this.renderList(InstancesStore.getOtherInstances())}
        </IconMenu>
      </div>
    );
  }
}));