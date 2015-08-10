let React = require("react");
let classNames = require("classnames");
let OutsideClickHandler = require("react-outsideclickhandler");
let mui = require("material-ui");

let ProfileActions = require("../../apps/Profile/ProfileActions");
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let Avatar = mui.Avatar;
let FontIcon = mui.FontIcon;
let DropDownArrow = require('material-ui/lib/svg-icons/navigation/arrow-drop-down');

let MaterialDropdownItem = require("./MaterialDropdownItem.react");
let DropdownNotifiItem = require("./DropdownNotifiItem.react");

require("./Dropdown.sass");

module.exports = React.createClass({

  displayName: "MaterialDropdown",

  propTypes: {
    type: React.PropTypes.string,
    icon: React.PropTypes.string,
    items: React.PropTypes.array,
    headerContent: React.PropTypes.shape({
      userFullName: React.PropTypes.string,
      userEmail: React.PropTypes.string,
      handleItemClick: React.PropTypes.func,                  // if "clickable" props is defined as false or
      clickable: React.PropTypes.bool                   // is not defined function will not be triggered
    }),
    iconStyle: React.PropTypes.object,
    isLoading: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      icon: "dots-vertical",
      iconStyle: {
        width: "18px",
        height: "18px",
        fill: "#FFF"
      },
      type: "normal-link",
      clickable: true
    }
  },

  getInitialState: function() {
    return {
      isOpen: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  },

  toggleOpenClose: function() {
    this.setState({
      isOpen: (!this.state.isOpen && this.props.clickable)
    }, function() {
      if (this.state.isOpen && this.props.handleOnClick) {
        this.props.handleOnClick()
      }
    });
  },

  close: function() {
    this.setState({"isOpen": false});
  },

  renderItems: function() {
    if (this.props.type === "notification") {
      return <DropdownNotifiItem
        items={this.props.items}
        isLoading={this.props.isLoading}/>
    }
    return <MaterialDropdownItem
      items={this.props.items}
      headerContent={this.props.headerContent}/>
  },

  renderIcon: function() {
    let notificationCountIcon = null;
    if (this.props.type === "notification" && this.props.items.length > 0) {
      let synIconName = this.props.items.length < 10 ? this.props.items.length : "9-plus";
      notificationCountIcon = <FontIcon
        className={"synicon-numeric-" + synIconName + "-box" }
        style={{
          padding  : "0 4px",
          color    : "#ff3d00",
          position : "absolute",
          top      : "-14px",
          right    : "-14px"
        }}/>
    }
    //return(
    //  <div>
    //    <FontIcon
    //      className = {"synicon-" + this.props.icon}
    //      style     = {this.props.iconStyle}
    //    />
    //    {notificationCountIcon}
    //  </div>
    //)
  },

  render: function() {

    let cssClasses = classNames({
      "dropdown-menu": true,
      "dropdown-menu-visible": this.state.isOpen
    });

    return (
      <OutsideClickHandler onOutsideClick={this.close}>
        <div className="dropdown">
          <div className="dropdown-button clickable" onClick={this.toggleOpenClose}>
            {this.props.children}
            {this.renderIcon()}
          </div>
          <div className={cssClasses}>
            <div className="dropdown-menu-section">
              {this.renderItems()}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    );
  }

});
