import React from 'react';
import Radium from 'radium';

import MUI from 'material-ui';

export default Radium(React.createClass({

  displayName: 'SwitchSection',

  mixins: [MUI.Mixins.StylePropable],

  propTypes: {
    plan: React.PropTypes.string,
    planCanceled: React.PropTypes.string,
    onPlanDialog: React.PropTypes.func,
    onCancelPlanDialog: React.PropTypes.func
  },

  getStyles() {
    let styles = {};
    return this.mergeStyles(styles, this.props.style);
  },

  handleCancelPlanDialog() {
    this.refs['paid-commitment-toggle'].setToggled(false);
    this.props.onCancelPlanDialog();
  },

  renderLeftSide() {
    if (this.props.plan === 'builder') {
      return (
        <div style={{textAlign: 'right'}}>
          <div>Builder</div>
          <div>We pick your bill</div>
        </div>
      )
    }

    if (this.props.planCanceled) {
      return (
        <div style={{textAlign: 'right'}}>
          <div>Your plan will expire on</div>
          <div style={{color: 'red'}}>
            {this.props.planCanceled}
          </div>
          <div>Click <a onClick={this.props.onPlanDialog}> here </a> to extend.</div>
        </div>
      )
    }
    return (
      <div>
        <a onClick={this.handleCancelPlanDialog}>Cancel Production plan</a>
      </div>
    );
  },

  renderRightSide() {
    if (this.props.plan === 'builder') {
      return (
        <div>
          <div style={{marginTop: 0, fontSize: '1.1rem', padding: 0}}>
            From <strong>$25</strong>/month
          </div>
          <div style={{marginTop: 0}}>
            <a onClick={this.props.onPlanDialog}>Switch to Production</a>
          </div>
        </div>
      )
    }
    return (
      <div>
        Production
      </div>
    )
  },

  render() {
    return (
      <div className="row align-center vp-3-t vp-3-b" >
        <div className="col-flex-1" style={{marginRight: 8, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', alignContent: 'center'}}>
          <div>
            {this.renderLeftSide()}
          </div>
        </div>
        <div  style={{width: 44, position: 'relative'}}>

               <div style = {{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}}>
                  <MUI.Toggle
                    ref="paid-commitment-toggle"
                    key="paid-commitment-toggle"
                    defaultToggled={true}
                    onToggle={this.handleCancelPlanDialog} />

            </div>

        </div>
        <div className="col-flex-1" style={{marginLeft: 16, display: 'flex', alignItems: 'center', alignContent: 'center'}}>
          {this.renderRightSide()}
        </div>
      </div>
    )
  }
}));
