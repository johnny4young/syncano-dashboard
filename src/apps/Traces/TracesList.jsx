import React from 'react';
import Radium from 'radium';

import {Styles, Paper, FontIcon} from 'syncano-material-ui';
import {ColumnList, Loading, Truncate, Trace} from 'syncano-components';
import {Lists} from '../../common';

let Column = ColumnList.Column;

export default Radium(React.createClass({
  displayName: 'TracesList',

  getDefaultProps() {
    return {
      items: []
    };
  },

  getInitialState() {
    return {
      visibleTraceId: null
    };
  },

  getStyles() {
    return {
      traceResult: {
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 450ms ease-out'
      },
      noTracesContainer: {
        padding: '96px 0',
        textAlign: 'center'
      },
      noTracesIcon: {
        fontSize: 96,
        lineHeight: 1,
        marginBottom: 16,
        color: 'rgba(0, 0, 0, 0.24)'
      },
      noTracesText: {
        color: 'rgba(0, 0, 0, 0.67)',
        fontSize: 34,
        margin: 0
      }
    };
  },

  toggleTrace(traceId) {
    console.info('SnippetsTraces::toggleTrace', traceId);
    const visibleTraceId = this.state.visibleTraceId !== traceId ? traceId : null;

    this.setState({visibleTraceId});
  },

  renderItem(item) {
    let duration = item.duration !== null ? item.duration + 'ms' : 'not executed';
    let styles = this.getStyles();
    let status = {
      blocked: {
        background: 'rgba(0,0,0,0.2)',
        icon: 'alert'
      },
      pending: {
        background: Styles.Colors.lightBlue500,
        icon: 'timelapse'
      },
      success: {
        background: Styles.Colors.green400,
        icon: 'check'
      },
      failure: {
        background: Styles.Colors.red400,
        icon: 'alert'
      },
      timeout: {
        background: Styles.Colors.red400,
        icon: 'alert'
      }
    }[item.status];

    if (item.id === this.state.visibleTraceId) {
      styles.traceResult = {
        maxHeight: '500px',
        marginBottom: 15,
        transition: 'max-height 450ms ease-in',
        overflow: 'auto'
      };
      styles.trace = {
        margin: '15px 0 0'
      };
    }

    return (
      <Paper
        key={item.id}
        zDepth={1}
        style={styles.trace}>
        <ColumnList.Item
          checked={item.checked}
          id={item.id}
          zDepth={0}
          handleClick={this.toggleTrace.bind(null, item.id)}>
          <Column.CheckIcon
            id={item.id.toString()}
            icon={status.icon}
            background={status.background}
            checkable={false}>
            <Truncate text={item.status}/>
          </Column.CheckIcon>
          <Column.ID>{item.id}</Column.ID>
          <Column.Desc>{duration}</Column.Desc>
          <Column.Date
            date={item.executed_at}
            ifInvalid={item.status}/>
        </ColumnList.Item>
        <div style={styles.traceResult}>
          <Trace.Result result={item.result}/>
        </div>
      </Paper>
    );
  },

  renderList() {
    return (
      <Lists.List key="traces-list">
        <ColumnList.Header>
          <Column.ColumnHeader primary={true} columnName="ICON_NAME">{this.props.name}</Column.ColumnHeader>
          <Column.ColumnHeader columnName="ID">ID</Column.ColumnHeader>
          <Column.ColumnHeader columnName="DESC">Duration</Column.ColumnHeader>
          <Column.ColumnHeader columnName="DATE">Executed</Column.ColumnHeader>
        </ColumnList.Header>
        {this.props.items.map((item) => this.renderItem(item))}
      </Lists.List>
    );
  },

  renderEmptyContent() {
    let styles = this.getStyles();
    let tracesFor = {
      snippet: {
        name: 'Snippet',
        icon: 'synicon-package-variant'
      },
      codeBox: {
        name: 'CodeBox',
        icon: 'synicon-arrow-up-bold'
      },
      trigger: {
        name: 'Trigger',
        icon: 'synicon-arrow-up-bold'
      },
      schedule: {
        name: 'Schedule',
        icon: 'synicon-camera-timer'
      }
    };

    return (
      <div style={styles.noTracesContainer}>
        <FontIcon
          style={styles.noTracesIcon}
          className={tracesFor[this.props.tracesFor].icon}/>
        <p style={styles.noTracesText}>There are no traces for this {tracesFor[this.props.tracesFor].name} yet</p>
      </div>
    );
  },

  render() {
    return (
      <Lists.Container>
        <Loading show={this.props.isLoading}>
          {this.props.items.length > 0 ? this.renderList() : this.renderEmptyContent()}
        </Loading>
      </Lists.Container>
    );
  }
}));
