import Stripe from '../../../stripe';

export default {
  getProfile() {
    this.NewLibConnection
      .Profile
      .please()
      .get()
      .then(this.completed)
      .catch(this.failure);
  },

  updateProfile(payload) {
    this.NewLibConnection
      .Profile
      .please()
      .update(payload)
      .then(this.completed)
      .catch(this.failure);
  },

  getCard() {
    this.NewLibConnection
      .Card
      .please()
      .get()
      .then(this.completed)
      .catch(this.failure);
  },

  updateCard(payload) {
    Stripe.card.createToken(payload, (status, response) => {
      if (response.error) {
        return this.failure(response.error);
      }

      this.NewLibConnection
        .Card
        .please()
        .update({}, { id: response.id })
        .then(this.completed)
        .catch(this.failure);
    });
  },

  addCard(payload) {
    Stripe.card.createToken(payload, (status, response) => {
      if (response.error) {
        return this.failure(response.error);
      }

      this.NewLibConnection
        .Card
        .please()
        .create({ token: response.id })
        .then(this.completed)
        .catch(this.failure);
    });
  },

  listInvoices() {
    this.NewLibConnection
      .Invoice
      .please()
      .list()
      .then(this.completed)
      .catch(this.failure);
  },

  subscribePlan(plan, payload) {
    this.NewLibConnection
      .Plan
      .please()
      .subscribe({ name: plan }, payload)
      .then(this.completed)
      .catch(this.failure);
  },

  cancelNewPlan(subscriptions) {
    const currentPlan = subscriptions[0];

    this.NewLibConnection
      .Subscription
      .please()
      .cancel(subscriptions[1].id)
      .then(
        this.NewLibConnection
          .Plan
          .please()
          .subscribe(currentPlan.plan, {
            commitment: JSON.stringify({
              api: currentPlan.commitment.api,
              cbx: currentPlan.commitment.cbx
            })
          })
          .then(this.completed)
          .catch(this.failure)
      )
      .catch(this.failure);
  },

  listPlans() {
    this.NewLibConnection
      .Plan
      .please()
      .list()
      .then(this.completed)
      .catch(this.failure);
  },

  listSubscriptions() {
    this.NewLibConnection
      .Subscription
      .please()
      .list()
      .then(this.completed)
      .catch(this.failure);
  },

  cancelSubscriptions(ids) {
    const promises = ids.map((id) => {
      this.NewLibConnection.Subscription.please().cancel({ id }).request();
    });

    this.Promise
      .all(promises)
      .then(this.completed)
      .catch(this.failure);
  },

  retryPayment(invoice) {
    this.NewLibConnection
      .Invoice
      .please()
      .retryPayment({ id: invoice.id })
      .then(this.completed)
      .catch(this.failure);
  }
};
