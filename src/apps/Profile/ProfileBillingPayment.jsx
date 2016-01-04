import React from 'react';
import Reflux from 'reflux';
import Radium from 'radium';
import _ from 'lodash';

import Mixins from '../../mixins';

import Actions from './ProfileActions';
import Store from './ProfileBillingPaymentStore';

import {TextField, RaisedButton} from 'syncano-material-ui';
import {Container, Loading, Show, InnerToolbar, CreditCard} from '../../common';


export default Radium(React.createClass({

  displayName: 'ProfileBillingPayment',

  mixins: [
    Reflux.connect(Store),
    Mixins.Form
  ],

  validatorConstraints: {
    number: {
      presence: true
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
        greaterThan: 0
      }
    }
  },

  componentDidMount() {
    Actions.fetchBillingCard();
  },

  handleSuccessfullValidation(data) {
    Actions.updateBillingCard({
      number: data.number,
      cvc: data.cvc,
      exp_month: data.exp_month,
      exp_year: data.exp_year
    });
  },

  toggleForm(state) {
    this.setState({
      showForm: state,
      show_form: state
    });
  },

  render() {
    let hasCard = !_.isEmpty(this.state.card);
    let showForm = !hasCard || this.state.showForm === true || this.state.show_form === true;
    let labelPrefix = hasCard ? 'Update' : 'Add';

    return (
      <Loading show={this.state.isLoading}>
        <InnerToolbar title="Payment methods"/>
        <Container>
          <Show if={showForm}>
            <form
              onSubmit={this.handleFormValidation}
              acceptCharset="UTF-8"
              method="post">
              {this.renderFormNotifications()}

              <div className="row">
                <div className="col-lg-20">
                  <TextField
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
                <div className="col-lg-20">
                  <TextField
                    name="cvc"
                    ref="cvc"
                    fullWidth={true}
                    valueLink={this.linkState('cvc')}
                    errorText={this.getValidationMessages('cvc').join(' ')}
                    hintText="CVC"
                    floatingLabelText="CVC"
                    dataStripe="cvc"/>
                </div>
              </div>
              <div className="row vm-4-b">
                <div className="col-lg-20">
                  <div className="row">
                    <div className="col-flex-1">
                      <TextField
                        name="exp_month"
                        ref="exp_month"
                        size={2}
                        fullWidth={true}
                        valueLink={this.linkState('exp_month')}
                        errorText={this.getValidationMessages('exp_month').join(' ')}
                        hintText="Expiration month (MM)"
                        floatingLabelText="Expiration month (MM)"
                        dataStripe="exp-month"/>
                    </div>
                    <div className="col-flex-1">
                      <TextField
                        name="exp_year"
                        ref="exp_year"
                        size={4}
                        fullWidth={true}
                        valueLink={this.linkState('exp_year')}
                        errorText={this.getValidationMessages('exp_year').join(' ')}
                        hintText="Expiration year (YYYY)"
                        floatingLabelText="Expiration year (YYYY)"
                        dataStripe="exp-year"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-20" style={{display: '-webkit-flex; display: flex'}}>
                  <Show if={hasCard}>
                    <RaisedButton
                      onClick={this.toggleForm.bind(this, false)}
                      label="Cancel"
                      className="raised-button"/>
                  </Show>
                  <RaisedButton
                    type="submit"
                    label={labelPrefix + ' payment'}
                    className="raised-button"
                    secondary={true}
                    style={{margin: '0 0 0 auto'}}/>
                </div>
              </div>
            </form>
          </Show>

          <Show if={!showForm}>
            <div>
              <CreditCard card={this.state.card}/>
              <RaisedButton
                onClick={this.toggleForm.bind(null, true)}
                type="submit"
                label={labelPrefix + ' payment'}
                className="raised-button"
                secondary={true}/>
            </div>
          </Show>
        </Container>
      </Loading>
    );
  }
}));