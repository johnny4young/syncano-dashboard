import React from 'react';
import { withRouter } from 'react-router';
import Reflux from 'reflux';

import { DialogMixin, FormMixin } from '../../mixins';

import Store from './ProfileBillingPlanDialogStore';
import Actions from './ProfileBillingPlanDialogActions';

import { TextField, FlatButton } from 'material-ui';
import { CreditCard, Loading, Slider, Dialog } from '../../common/';
import SliderSection from './SliderSection';

const ProfileBillingPlanDialog = React.createClass({
  displayName: 'ProfileBillingPlanDialog',

  mixins: [
    DialogMixin,
    FormMixin,

    Reflux.connect(Store)
  ],

  validatorConstraints() {
    if (this.state.card) {
      return true;
    }

    return {
      number: {
        presence: true,
        length: { maximum: 19 },
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
          greaterThanOrEqualTo: new Date().getFullYear() - 20,
          lessThanOrEqualTo: new Date().getFullYear() + 20
        }
      }
    };
  },

  getValidatorAttributes() {
    if (this.state.card) {
      return {};
    }

    const data = this.getFormAttributes();

    return {
      number: data.number,
      cvc: data.cvc,
      exp_month: data.exp_month,
      exp_year: data.exp_year
    };
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
    };
  },

  handleDialogShow() {
    console.debug('ProfileBillingPlanDialog::handleDialogShow');
    Actions.fetchBillingPlans();
    Actions.fetchBillingCard();
  },

  handleEditSubmit() {
    Actions.submitPlan(this.getValidatorAttributes());
  },

  handleAddSubmit() {
    Actions.submitPlan(this.getValidatorAttributes());
  },

  handleDismiss() {
    this.handleCancel();
    if (typeof this.props.onDismiss === 'function') {
      this.props.onDismiss();
    }
  },

  renderCard() {
    const { router } = this.props;
    const { card } = this.state;

    if (typeof card === 'undefined') {
      return <Loading show={true} />;
    }

    if (card) {
      return (
        <div>
          <div style={this.getStyles().sectionTopic}>Credit card info:</div>
          <div className="row" style={{ marginTop: 20, height: 110 }}>
            <div className="col-md-18">
              <CreditCard card={card} />
            </div>
            <div className="col-md-14" style={{ color: '#9B9B9B', fontSize: '0.8em' }}>
              Want to use a different method of payment?
              Update your card <a onClick={() => router.push('profile-billing-payment')}>here</a>.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div style={this.getStyles().sectionTopic}>Enter your credit card info:</div>
        <div className="row">
          <div className="col-flex-1">
            <TextField
              name="number"
              ref="number"
              autoFocus={true}
              fullWidth={true}
              value={this.state.number}
              onChange={(event, value) => this.setState({ number: value })}
              errorText={this.getValidationMessages('number').join(' ')}
              hintText="Card Number"
              floatingLabelText="Card Number"
              dataStripe="number"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-5">
            <TextField
              name="cvc"
              ref="cvc"
              fullWidth={true}
              value={this.state.cvc}
              onChange={(event, value) => this.setState({ cvc: value })}
              errorText={this.getValidationMessages('cvc').join(' ')}
              hintText="CVC"
              floatingLabelText="CVC"
              dataStripe="cvc"
            />
          </div>

          <div className="col-flex-1">
            <TextField
              name="exp_month"
              ref="exp_month"
              fullWidth={true}
              value={this.state.exp_month}
              onChange={(event, value) => this.setState({ exp_month: value })}
              errorText={this.getValidationMessages('exp_month').join(' ')}
              hintText="MM"
              floatingLabelText="Expiration month (MM)"
              dataStripe="exp-month"
            />
          </div>

          <div className="col-flex-1">
            <TextField
              name="exp_year"
              ref="exp_year"
              fullWidth={true}
              value={this.state.exp_year}
              onChange={(event, value) => this.setState({ exp_year: value })}
              errorText={this.getValidationMessages('exp_year').join(' ')}
              hintText="YYYY"
              floatingLabelText="Expiration year (YYYY)"
              dataStripe="exp-year"
            />
          </div>
        </div>
      </div>
    );
  },

  renderSlider(type) {
    if (!this.state.plan) {
      return true;
    }
    const defaultValue = 0;
    const selected = this.state[type + 'Selected'];
    let options = this.state.plan.options[type];

    options = options.map((item) => {
      return '$' + item;
    });

    return (
      <Slider
        key={type + 'Slider'}
        ref={type + 'Slider'}
        name={type + 'Slider'}
        value={typeof selected !== 'undefined' ? selected : defaultValue}
        type={type}
        legendItems={options}
        optionClick={Actions.sliderLabelsClick}
        onChange={Actions.sliderChange}
      />
    );
  },

  renderSliderSummary(info) {
    return (
      <div>
        <div style={{ paddingBottom: 8 }}>
          <div style={{ paddingBottom: 8 }}>{info.included.label}</div>
          <div><strong>{info.included.value}</strong></div>
        </div>
        <div>
          <div style={{ paddingBottom: 8 }}>{info.overage.label}</div>
          <div><strong>${info.overage.value}</strong></div>
        </div>
      </div>
    );
  },

  render() {
    const styles = this.getStyles();
    const apiInfo = Store.getInfo('api');
    const cbxInfo = Store.getInfo('cbx');
    const sum = parseInt(apiInfo.total, 10) + parseInt(cbxInfo.total, 10);
    const dialogCustomActions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        onTouchTap={this.handleDismiss}
        ref="cancel"
      />,
      <FlatButton
        key="confirm"
        label="Confirm"
        primary={true}
        onTouchTap={this.handleFormValidation}
        ref="submit"
      />
    ];
    const apiSliderSummary = this.renderSliderSummary(
      {
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
    const cbxSliderSummary = this.renderSliderSummary(
      {
        included: {
          value: parseInt(cbxInfo.included, 10).toLocaleString(),
          label: 'Total Script seconds'
        },
        overage: {
          value: cbxInfo.overage,
          label: 'Overage Unit Price: Script second'
        }
      }
    );

    return (
      <Dialog.FullPage
        key="dialog"
        ref="dialog"
        actions={dialogCustomActions}
        open={this.state.open}
        isLoading={this.state.isLoading}
        onRequestClose={this.handleDismiss}
      >
        <div>
          <div style={{ fontSize: '1.5em', lineHeight: '1.5em' }}>Choose your plan</div>
          <div style={{ color: '#9B9B9B' }}>move the sliders to choose your plan</div>
        </div>
        <div style={{ paddingTop: 34 }}>
          {this.renderFormNotifications()}

          <SliderSection
            title="API calls"
            slider={this.renderSlider('api')}
            sliderSummary={apiSliderSummary}
          />
          <SliderSection
            style={{ paddingTop: 50 }}
            title="Script seconds"
            slider={this.renderSlider('cbx')}
            sliderSummary={cbxSliderSummary}
          />

          <div className="row" style={{ marginTop: 40 }}>
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
                  <div className="col-flex-1">Script seconds</div>
                  <div className="col-md-10" style={styles.tableColumnSummary}>
                    {parseInt(cbxInfo.included, 10).toLocaleString()}
                  </div>
                  <div className="col-md-10" style={styles.tableColumnSummary}>${cbxInfo.total}/Month</div>
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                {this.renderCard()}
              </div>
            </div>
            <div className="col-md-11" style={{ paddingLeft: 35 }}>

              <div style={styles.sectionTopic}>New plan:</div>
              <div style={{ marginTop: 20, background: '#CBEDA5' }}>

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
      </Dialog.FullPage>
    );
  }
});

export default withRouter(ProfileBillingPlanDialog);
