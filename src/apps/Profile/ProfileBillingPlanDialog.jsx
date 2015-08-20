import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

import Mixins from '../../mixins';

import Store from './ProfileBillingPlanDialogStore';
import Actions from './ProfileBillingPlanDialogActions';

import MUI from 'material-ui';
import Common from '../../common';
import SliderSection from './SliderSection';

export default React.createClass({

  displayName: 'ProfileBillingPlanDialog',

  mixins: [
    React.addons.LinkedStateMixin,

    Router.State,
    Router.Navigation,

    Mixins.Dialog,
    Mixins.Form,

    Reflux.connect(Store)
  ],

  validatorConstraints() {
    if (this.state.card) {
      return;
    }

    return {
      number: {
        presence: true,
        length: {maximum: 19},
        numericality: {
          onlyInteger: true
        }
      },
      cvc: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThan: 0
        }
      },
      exp_month: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          lessThanOrEqualTo: 12
        }
      },
      exp_year: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: new Date().getFullYear()
        },
        length: {
          is: 4
        }
      }
    }
  },

  getValidatorAttributes() {
    if (this.state.card) {
      return {};
    }

    return {
      number: this.state.number || this.refs.number.getValue(),
      cvc: this.state.cvc || this.refs.cvc.getValue(),
      exp_month: this.state.exp_month || this.refs.exp_month.getValue(),
      exp_year: this.state.exp_year || this.refs.exp_year.getValue()
    }
  },

  handleDialogShow() {
    console.debug('ProfileBillingPlanDialog::handleDialogShow');
    Actions.fetchBillingPlans();
    Actions.fetchBillingCard();
  },

  handleEditSubmit() {
    this.handleAddSubmit();
  },

  handleAddSubmit() {
    console.debug('ProfileBillingPlanDialog::handleAddSubmit');

    let apiTotal = this.getInfo('api').total;
    let cbxTotal = this.getInfo('cbx').total;

    let total = parseInt(apiTotal, 10) + parseInt(cbxTotal, 10);

    let subscribe = () => {
      return Actions.subscribePlan(this.state.plan.name, {
        commitment: JSON.stringify({
          api: apiTotal,
          cbx: cbxTotal
        })
      });
    };

    let setLimits = () => {
      return Actions.updateBillingProfile({
        hard_limit: parseInt(total * 3, 10),
        soft_limit: parseInt(total * 1.5, 10)
      });
    };

    if (this.state.card) {
      subscribe().then(setLimits);
    } else {
      Actions
        .updateCard(this.getValidatorAttributes())
        .then(() => {
          subscribe().then(
            setLimits
          )
        })
    }
  },

  getStyles() {
    return {
      main: {
        marginTop: 50,
        fontColor: '#4A4A4A'
      },
      sectionTopic: {
        fontSize: '1.3em'
      },
      table: {
        marginTop: 20
      },
      tableRow: {
        height: 40,
        textAlign: 'left',
        lineHeight: '40px',
        verticalAlign: 'middle'
      },
      tableColumnSummary: {
        height: 40,
        margin: 1,
        fontSize: '1.1em',
        fontWeight: 'bold',
        textAlign: 'right',
        background: '#F2F2F2',
        verticalAlign: 'middle',
        lineHeight: '40px'
      },
      sectionTotalSummary: {
        marginTop: 20,
        height: 80,
        fontSize: '1.4em',
        lineHeight: '1.4em',
        background: '#CBEDA5',
        padding: 14
      },
      sectionComment: {
        marginTop: 20,
        fontSize: '0.8em',
        color: '#9B9B9B'
      }
    }
  },

  renderCard() {
    if (typeof this.state.card === 'undefined') {
      return <Common.Loading show={true}/>
    }

    if (this.state.card) {
      return (
        <div>
          <div style={this.getStyles().sectionTopic}>Credit card info:</div>
          <div className="row" style={{marginTop: 20, height: 110}}>
            <div className="col-md-18">
              <Common.CreditCard card={this.state.card}/>
            </div>
            <div className="col-md-14" style={{color: '#9B9B9B', fontSize: '0.8em'}}>
              Want to use a different method of payment?
              Update your card <a onClick={this.transitionTo.bind(this, 'profile-billing-payment')}>here</a>.
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div style={this.getStyles().sectionTopic}>Enter your credit card info:</div>
        <div className="row">
          <div className="col-flex-1">
            <MUI.TextField
              name="number"
              ref="number"
              fullWidth={true}
              valueLink={this.linkState('number')}
              errorText={this.getValidationMessages('number').join(' ')}
              hintText="Card Number"
              floatingLabelText="Card Number"
              dataStripe="number"/>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5">
            <MUI.TextField
              name="cvc"
              ref="cvc"
              fullWidth={true}
              valueLink={this.linkState('cvc')}
              errorText={this.getValidationMessages('cvc').join(' ')}
              hintText="CVC"
              floatingLabelText="CVC"
              dataStripe="cvc"/>
          </div>

          <div className="col-flex-1">
            <MUI.TextField
              name="exp_month"
              ref="exp_month"
              fullWidth={true}
              valueLink={this.linkState('exp_month')}
              errorText={this.getValidationMessages('exp_month').join(' ')}
              hintText="MM"
              floatingLabelText="Expiration month (MM)"
              dataStripe="exp-month"/>
          </div>

          <div className="col-flex-1">
            <MUI.TextField
              name="exp_year"
              ref="exp_year"
              fullWidth={true}
              valueLink={this.linkState('exp_year')}
              errorText={this.getValidationMessages('exp_year').join(' ')}
              hintText="YYYY"
              floatingLabelText="Expiration year (YYYY)"
              dataStripe="exp-year"/>
          </div>
        </div>
      </div>
    )
  },

  onSliderChange(type, event, value) {
    let newState = {};

    newState[type + 'Selected'] = value;
    this.setState(newState);
  },

  renderSlider(type) {
    if (!this.state.plan) {
      return;
    }
    const defaultValue = 0;
    let options = this.state.plan.options[type];
    let selected = this.state[type + 'Selected'];

    options = options.map((item) => {
      return '$' + item;
    });

    return (
      <Common.Slider
        key={type + 'Slider'}
        ref={type + 'Slider'}
        name={type + 'Slider'}
        value={typeof selected !== 'undefined' ? selected : defaultValue}
        type={type}
        legendItems={options}
        optionClick={this.handleSliderLabelsClick}
        onChange={this.onSliderChange}
        />
    )
  },

  handleSliderLabelsClick(value, type) {
    let newState = {};

    newState[type + 'Selected'] = value;
    this.setState(newState);
  },

  renderSliderSummary(info) {
    return (
      <div>
        <div style={{paddingBottom: 8}}>
          <div style={{paddingBottom: 8}}>{info.included.label}</div>
          <div><strong>{info.included.value}</strong></div>
        </div>
        <div>
          <div style={{paddingBottom: 8}}>{info.overage.label}</div>
          <div><strong>${info.overage.value}</strong></div>
        </div>
      </div>
    )
  },

  getInfo(type) {
    let info = {
      included: 0,
      overage: 0,
      total: 0
    };

    if (!this.state.plan) {
      return info;
    }

    let pricing = this.state.plan.pricing[type];
    let options = this.state.plan.options[type];
    let sliderValue = this.state[type + 'Selected'];

    if (!sliderValue) {
      info = pricing[Object.keys(pricing)[0]];
      info.total = Object.keys(pricing)[0];
      return info;
    }

    let value = String(parseFloat(sliderValue));

    info = pricing[options[value]];
    info.total = options[value];
    return info;
  },

  handleDismiss() {
    this.resetDialogState();
    if (typeof this.props.onDismiss === 'function') {
      this.props.onDismiss()
    }
  },

  render() {
    let styles = this.getStyles();
    let apiInfo = this.getInfo('api');
    let cbxInfo = this.getInfo('cbx');
    let sum = parseInt(apiInfo.total, 10) + parseInt(cbxInfo.total, 10);

    let dialogCustomActions = [
      <MUI.FlatButton
        key="cancel"
        label="Cancel"
        onTouchTap={this.handleCancel}
        ref="cancel"/>,

      <MUI.FlatButton
        key="confirm"
        label="Confirm"
        primary={true}
        onTouchTap={this.handleFormValidation}
        ref="submit"/>
    ];

    let apiSliderSummary = this.renderSliderSummary({
        included: {
          value: parseInt(apiInfo.included, 10).toLocaleString(),
          label: 'Total API calls'
        },
        overage: {
          value: apiInfo.overage,
          label: 'Overage Unit Price: API Calls'
        }
      }
    );

    let cbxSliderSummary = this.renderSliderSummary({
        included: {
          value: parseInt(cbxInfo.included, 10).toLocaleString(),
          label: 'Total CodeBox runs'
        },
        overage: {
          value: cbxInfo.overage,
          label: 'Overage Unit Price: CodeBox run'
        }
      }
    );

    return (
      <Common.Loading show={this.state.isLoading}>
        <Common.Dialog
          ref="dialog"
          contentStyle={{maxWidth: 850, padding: 0}}
          onShow={this.handleDialogShow}
          openImmediately={this.props.openImmediately}
          actions={dialogCustomActions}
          onDismiss={this.handleDismiss}
          >
          <div>
            <div style={{fontSize: '1.5em', lineHeight: '1.5em'}}>Choose your plan</div>
            <div style={{color: '#9B9B9B'}}>move the sliders to choose your plan</div>
          </div>
          <div style={{paddingTop: 34}}>
            {this.renderFormNotifications()}

            <SliderSection
              title="API calls"
              slider={this.renderSlider('api')}
              sliderSummary={apiSliderSummary}
              />
            <SliderSection
              style={{paddingTop: 50}}
              title="CodeBox runs"
              slider={this.renderSlider('cbx')}
              sliderSummary={cbxSliderSummary}
              />

            <div className="row" style={{marginTop: 40}}>
              <div className="col-md-24">
                <div style={styles.sectionTopic}>Summary</div>
                <div style={styles.table}>
                  <div className="row" style={styles.tableRow}>
                    <div className="col-flex-1">API calls</div>
                    <div className="col-md-10" style={styles.tableColumnSummary}>
                      {parseInt(apiInfo.included, 10).toLocaleString()}
                    </div>
                    <div className="col-md-10" style={styles.tableColumnSummary}>${apiInfo.total}/Month</div>
                  </div>
                  <div className="row" style={styles.tableRow}>
                    <div className="col-flex-1">CodeBox runs</div>
                    <div className="col-md-10" style={styles.tableColumnSummary}>
                      {parseInt(cbxInfo.included, 10).toLocaleString()}
                    </div>
                    <div className="col-md-10" style={styles.tableColumnSummary}>${cbxInfo.total}/Month</div>
                  </div>
                </div>
                <div style={{marginTop: 30}}>
                  {this.renderCard()}
                </div>
              </div>
              <div className="col-md-11" style={{paddingLeft: 35}}>

                <div style={styles.sectionTopic}>New plan:</div>
                <div style={{marginTop: 20, background: '#CBEDA5'}}>

                  <div style={styles.sectionTotalSummary}>
                    <div><strong>${sum}</strong>/month</div>
                    <div>+ overage</div>
                  </div>
                </div>
                <div style={styles.sectionComment}>
                  The new monthly price and overage rate will begin at the start of the next billing period.
                  Your card will be charged on the 1st of every month.
                </div>
              </div>
            </div>
          </div>
        </Common.Dialog>
      </Common.Loading>
    );
  }
});

