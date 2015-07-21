import React from 'react';
import Radium from 'radium';
import MUI from 'material-ui';
import AuthActions from '../../apps/Account/AuthActions';
import AuthConstants from '../../apps/Account/AuthConstants';

export default Radium(React.createClass({

  displayName: 'SocialAuthButtonsList',

  getDefaultProps() {
    return {
      mode: 'login'
    }
  },

  propTypes: {
    children: React.PropTypes.any.isRequired
  },

  getStyles() {
    return {
      list: {
        paddingTop    : 0,
        paddingBottom : 0,
        marginBottom  : 24,
        border        : '1px solid' + MUI.Styles.Colors.blue700
      },
      listItem: {
        color : MUI.Styles.Colors.blue700,
        ':hover': {
          backgroundColor : MUI.Styles.Colors.blue700,
          color           : '#fff'
        }
      },
      listItemIcon: {
        color      : 'inherit',
        transition : 'none'
      },
      listDivider: {
        backgroundColor : MUI.Styles.Colors.blue700
      }
    }
  },

  handleSocialSignup(network) {
    return function() {
      AuthActions.socialLogin(network)
    };
  },

  renderSocialButtons() {
    let styles = this.getStyles();
    let socialNetworksCount = AuthConstants.SOCIAL_NETWORKS.length;
    let lastListItemIndex = socialNetworksCount - 1;
    let buttonLabel = this.props.mode === 'signup' ? 'Sign up with ' : 'Log in with ';
    let buttons = [];

    AuthConstants.SOCIAL_NETWORKS.map((network, index) => {
      buttons.push(
        <MUI.ListItem
          key         = {index}
          style       = {styles.listItem}
          primaryText = {buttonLabel + network}
          onTouchTap  = {this.handleSocialSignup(network)}
          leftIcon    = {<MUI.FontIcon
                         style     = {styles.listItemIcon}
                         className = {'synicon-' + network}
                         />}
        />
      );
      if (index < lastListItemIndex) {
        buttons.push(<MUI.ListDivider style={styles.listDivider} />);
      }
    });

    return buttons;
  },

  render() {
    let styles = this.getStyles();

    return (
      <MUI.List style={styles.list}>{this.renderSocialButtons()}</MUI.List>
    );
  }
}));