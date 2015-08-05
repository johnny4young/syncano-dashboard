import React from 'react';
import Reflux from 'reflux';
import Radium from 'radium';
import Moment from 'moment';

import Mixins from '../../mixins';

import Store from './ProfileBillingPlanStore';
import Actions from './ProfileBillingPlanActions.js';
import PlanDialogStore from './ProfileBillingPlanDialogStore';
import PlanDialogActions from './ProfileBillingPlanDialogActions';

import MUI from 'material-ui';
import Common from '../../common';
import PlanDialog from './ProfileBillingPlanDialog';
import Limits from './Limits';
import Chart from './ProfileBillingChart.react';

import EmptyContainer from '../../common/Container/EmptyContainer.react';

export default Radium(React.createClass({

  displayName: 'ProfileBillingPlan',

  mixins: [
    React.addons.LinkedStateMixin,
    Mixins.Form,
    Mixins.Dialogs,
    Mixins.IsLoading(),
    Reflux.connect(Store),
    Reflux.connect(PlanDialogStore)
  ],

  validatorConstraints() {
    return {
      soft_limit: {
        numericality: {
          onlyInteger: true
        }
      },
      hard_limit: {
        equality: {
          attribute: 'soft_limit',
          message: 'Hard limit have to be higher then soft limit',
          comparator: (v1, v2) => {
            return parseInt(v1) > parseInt(v2);
          }
        },
        numericality: {
          onlyInteger: true
        }
      }
    }
  },

  componentDidMount() {
    Actions.fetch()
  },

  componentWillUpdate(nextProps, nextState) {
    console.info('ProfileBillingPlan::componentWillUpdate');
    this.hideDialogs(nextState.hideDialogs);
  },

  setupToggles() {
    const plan = Store.getPlan();

    if (plan === 'builder') {
      this.refs.toggle.setToggled(false);
    } else if (plan === 'paid-commitment' && Store.isPlanCanceled()) {
      this.refs.toggle.setToggled(false);
    } else if (plan === 'paid-commitment') {
      this.refs.toggle.setToggled(true);
    }
  },

  getStyles() {
    return {
      main: {
        marginTop: 50,
        paddingRight: 50,
        color: '#4A4A4A'
      },
      mainDesc: {
        fontSize: '1.5rem',
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex'
      },
      comment: {
        fontSize: '0.9em'
      },

      heading: {
        fontSize: '1.3em'
      }
    }
  },

  // Dialogs config
  initDialogs() {

    return [{
      dialog: Common.Dialog,
      params: {
        key: 'cancelProductionPlan',
        ref: 'cancelProductionPlan',
        title: 'Cancel Production Plan',
        actions: [
          {
            text: 'Cancel',
            onClick: this.handleCancelCancelProductionPlan
          },
          {
            text: 'Confirm',
            onClick: this.handleCancelProductionPlan
          }
        ],
        modal: true,
        children: ['Are you sure you want to cancel Production plan?']
      }
    }]
  },

  handleCancelCancelProductionPlan() {
    this.setupToggles();
    this.refs.cancelProductionPlan.dismiss();
  },

  handleShowCancelPlanDialog() {
    console.debug('ProfileBillingPlan::handlePlanToggle');
    this.showDialog('cancelProductionPlan')
  },

  handleCancelProductionPlan() {
    Actions.cancelSubscriptions(this.state.subscriptions._items.map((item) => {
      return item.id
    })).then(() => {
      Actions.fetch();
    });
  },

  handleShowPlanDialog() {
    console.debug('ProfileBillingPlan::handleShowPlanDialog');
    PlanDialogActions.showDialog();
  },

  handleDeleteSubscription() {
    Actions.cancelNewPlan(this.state.subscriptions._items);
  },

  renderMainDesc() {
    const styles = this.getStyles();
    const plan = Store.getPlan();

    if (plan === 'free') {
      return 'You are on FREE (internal) plan - go away! and test billing using different account!';
    }

    if (plan === 'builder') {
      return (
        <div>
          <div style={{marginBottom: 16}}>It does not cost you anything but there are limits:</div>
          <div>
            <Limits data={Store.getLimitsData('default', plan)}/>
          </div>
        </div>
      );
    } else if (plan === 'paid-commitment') {

      return (
        <div>
          <div style={styles.mainDesc}>
            <div style={{lineHeight: '48px'}}>
              Current plan <strong>${Store.getTotalPlanValue('default')}</strong>:
            </div>
          </div>
          <div>
            <Limits data={Store.getLimitsData('default', plan)}/>
          </div>
        </div>
      );
    }
  },

  renderCommment() {
    const styles = this.getStyles();
    const plan = Store.getPlan();

    if (plan === 'builder') {
      return (
        <div>
          If you exceed your limits you will not be subject to overage - just make sure you're in building mode.
          If we suspect abuse of our terms, we will advise you to switch to a <strong>Production plan</strong>.
        </div>
      );
    } else if (plan === 'paid-commitment') {

      if (Store.isNewSubscription()) {
        const subscription = this.state.subscriptions._items[1];
        const total = Store.getTotalPlanValue(subscription);
        const limitsData = Store.getLimitsData(subscription, plan);

        let toolTip = (
          <div style={{whiteSpace: 'normal', textAlign: 'left', width: 250}}>
            Your current plan will expire at the end of the month and your new plan
            will begin on {Moment(subscription.start).format('LL')}
          </div>
        );

        return (
          <div>

            <div style={styles.mainDesc}>
              <div style={{lineHeight: '48px'}}>New plan <strong>${total}</strong>:</div>

              <MUI.IconButton
                iconClassName="synicon-information-outline"
                iconStyle={{color: Common.Color.getColorByName('blue', 'light')}}
                tooltip={toolTip}/>

            </div>

            <div>
              <Limits data={limitsData}/>
            </div>

          </div>

        )
      }
      return (
        <div>
          You can change your plan at any point and get the benefit of <strong>lower unit prices</strong>.
          Your new monthly fixed price will start from next billing period.
        </div>
      );
    }
  },

  handlePlanDialogDismiss() {
    this.setupToggles();
    Actions.fetch();
  },

  handleSuccessfullValidation() {
    this.handleAddSubmit();
  },

  handleAddSubmit() {
    Actions.updateBillingProfile({
      hard_limit: this.state.hard_limit,
      soft_limit: this.state.soft_limit
    });
  },

  renderLimitsForm() {
    const styles = this.getStyles();
    const plan = Store.getPlan();

    if (plan === 'builder' || plan === 'free') {
      return null;
    }

    let toolTip = (
      <div style={{whiteSpace: 'normal', textAlign: 'left', width: 200}}>
        Here you can set limits for your plan. You will be notified after reaching soft limit.
        After reaching hard limit your account will be frozen to avoid additional costs.
      </div>
    );

    return (
      <div>
        <div style={styles.heading}>Limits</div>
        <div className="row align-middle">
          <div className="col-md-5">
            <MUI.TextField
              ref="soft_limit"
              valueLink={this.linkState('soft_limit')}
              errorText={this.getValidationMessages('soft_limit').join(' ')}
              name="soft_limit"
              className="text-field"
              floatingLabelText="Soft Limit"
              fullWidth={true}/>
          </div>
          <div className="col-md-5">
            <MUI.TextField
              ref="hard_limit"
              valueLink={this.linkState('hard_limit')}
              errorText={this.getValidationMessages('hard_limit').join(' ')}
              name="hard_limit"
              className="text-field"
              floatingLabelText="Hard Limit"
              fullWidth={true}/>
          </div>
          <div className="col-md-4" style={{paddingRight: 0}}>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <MUI.FlatButton
                primary={true}
                label='Set Limits'
                disabled={(!this.state.hard_limit && !this.state.soft_limit)}
                onTouchTap={this.handleFormValidation}/>
            </div>
          </div>
          <div className="col-md-5" style={{paddingLeft: 0}}>
            <MUI.IconButton
              iconClassName="synicon-information-outline"
              iconStyle={{color: MUI.Styles.Colors.blue500}}
              tooltip={toolTip}/>
          </div>
        </div>
      </div>
    )
  },

  renderSummary() {
    const plan = Store.getPlan();
    const profile = this.state.profile;

    let coveredText = '';
    if (plan === 'builder' || plan === 'free')
      coveredText = 'Covered by Syncano';
    else if (plan === 'paid-commitment') {
      coveredText = `So far this month`;
    }

    if (plan === 'builder' || plan === 'free') {
      let totalIndex = _.findIndex(profile.balance, {source: 'Plan Fee'});
      let amountTotal = profile.balance[totalIndex].quantity;

      return (
        <div>

          <div style={{textAlign: 'center', fontSize: '1.2rem'}}>
            {coveredText}
          </div>

          <div className="row align-middle" style={{marginTop: 25}}>
            <div className="col-flex-1" style={{textAlign: 'center'}}>
              <div style={{textDecoration: 'line-through', fontSize: '2rem'}}>${amountTotal}</div>
              <div style={{marginTop: 15, fontSize: '1rem'}}>Your Cost: $0</div>
            </div>
          </div>

        </div>
      );
    }

    let covered = Store.getCovered();
    let overage = Store.getOverage();
    let amountTotal = overage.amount + covered.amount;
    return (
      <div>

        <div style={{textAlign: 'center', fontSize: '1.2rem'}}>
          {coveredText}
        </div>

        <div className="row align-middle" style={{marginTop: 20}}>
          <div className="col-flex-1" style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem'}}>${amountTotal}</div>
            <div style={{marginTop: 15, fontSize: '1rem'}}>
              ${covered.amount} plan + ${overage.amount} overage
            </div>
          </div>
        </div>

      </div>
    );
  },

renderLoaded() {
  let styles = this.getStyles();

  if (this.state.subscriptions.length === 0) {
    return (
      <div className="vp-5-t">
        <PlanDialog onDismiss={this.handlePlanDialogDismiss}/>
        <EmptyContainer
          icon="synicon-block-helper"
          text="You don't have any active subscription."/>
        <div style={{margin: '64px auto', textAlign: 'center'}}>
          <MUI.RaisedButton
            label="Subscribe"
            labelStyle={styles.updateButtonLabel}
            className="raised-button"
            secondary={true}
            onClick={this.handleShowPlanDialog} />
        </div>
      </div>
    )
  }

  return (
    <div>
      {this.getDialogs()}
      <PlanDialog onDismiss={this.handlePlanDialogDismiss}/>

      <div style={{zIndex: 1, paddingLeft: 256, position: 'fixed', top: 64, left: 0, width: '100%', background: '#EBEBEB'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', maxWidth: '1140'}}>
          <div style={{paddingLeft: 52, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

            <div style={styles.mainDesc}>
              Your plan: <span style={{paddingLeft: 8}}><strong>{Store.getPlanName()}</strong></span>
            </div>

          </div>
          <div>
            <Common.Billing.SwitchSection
              ref="toggle"
              plan={this.state.profile.subscription.plan}
              planCanceled={Store.isPlanCanceled()}
              onPlanDialog={this.handleShowPlanDialog}
              onCancelPlanDialog={this.handleShowCancelPlanDialog}/>
          </div>
        </div>
      </div>

      <div style={{marginTop: 80}}>

        <div className="row vp-6-b">

          <div className="col-flex-1">
            <div style={{marginBottom: 24}}>
              {this.renderMainDesc()}
            </div>

            <div style={{marginBottom: 24}}>
              {this.renderCommment()}
            </div>

            <div>
              <Common.Billing.PlanExplorerButton
                plan={this.state.profile.subscription.plan}
                isNewSubscription={Store.isNewSubscription()}
                onPlanDialog={this.handleShowPlanDialog}
                onDeleteSubscription={this.handleDeleteSubscription}/>
            </div>

          </div>

          <div className="col-flex-1" style={{position: 'relative', background: '#F5F5F5', marginRight: 8}}>

            <div style={{position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%)'}}>
              {this.renderSummary()}
            </div>
          </div>
        </div>

        <div className="row vp-2-b">
          <div className="col-flex-1 vp-1-b" style={styles.heading}>
            See how it works with your <strong>current usage</strong>:
          </div>
        </div>

        <div className="row vp-3-b">
          <div className="col-flex-1">
            <Common.Billing.ChartLegend profile={this.state.profile}/>
          </div>
          <div className="col-flex-1">

          </div>
        </div>

        <div className="row vp-5-b">
          <div className="col-flex-1">
            <Chart />
          </div>
        </div>

        {this.renderLimitsForm()}

      </div>
    </div>
  );
}
}));


