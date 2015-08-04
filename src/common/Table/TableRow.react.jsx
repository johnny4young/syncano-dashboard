let React = require('react'),
  Moment = require('moment'),

  Dropdown = require('../Dropdown/Dropdown.react'),
  TableData = require('./TableData.react');

module.exports = React.createClass({

  displayName: 'TableRow',

  toggleDropdownMenu() {
    ViewActions.showDropdown(this.props.item.uuid);
  },

  handleDropdownMenuItemClick(action) {
    if (action === "delete") {
      ViewActions.showModalConfirmDeleteResource(this.props.item);
    } else if (action === "edit") {
      ViewActions.showModalUpdateResource(this.props.item);
    }
  },

  render() {
    let dropdown = this.props.dropdown;
    let dropdownVisible = this.props.dropdown === this.props.item.uuid;
    let columns = this.props.columns.filter(function(column, i) {
      return column.selected;
    }.bind(this)).map(function(column, i) {
      let data = this.props.item[column.name];
      if (column.name === "created_at" || column.name === "updated_at") {
        data = Moment(this.props.item[column.name]).format('DD-MM-YYYY, h:mm:ss a');
      }
      if (column.type === "currency") {
        data = parseFloat(Math.round(this.props.item[column.name] * 100) / 100).toFixed(2);
      }
      if (column.type === "datetime") {
        data = Moment(this.props.item[column.name].value).format('DD-MM-YYYY, h:mm:ss a');
      }
      if (column.type === "boolean") {
        data = this.props.item[column.name].toString();
      }
      return <TableData
        {...this.props}
        key={i} data={data}
        column={column}/>
    }.bind(this));
    let optionsColumn = null;
    if (!this.props.readOnly) {
      let actions = ConfigStore.getConfig()[this.props.item.type].actions;
      let optionsColumn = (
        <TableData
          {...this.props}
          key="options"
          column={{"name":"options", "type":"options"}}>
          <Dropdown
            actions={actions}
            visible={dropdownVisible}
            toggleDropdownMenu={this.toggleDropdownMenu}
            handleClick={this.handleDropdownMenuItemClick}/>
        </TableData>);
    }
    return (
      <div className="table-row">
        {columns}
        {optionsColumn}
      </div>
    );
  }
});