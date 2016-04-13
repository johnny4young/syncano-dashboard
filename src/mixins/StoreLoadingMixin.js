import _ from 'lodash';

export default {

  setLoadingStates() {
    if (this.listenables) {
      let listenables = [].concat(this.listenables);

      _.forEach(listenables, (listenable) => {
        this.bindLoadingListeners(listenable);
      });
    }
  },

  bindLoadingListeners(listenable) {
    _.forEach(listenable, (action, name) => {
      if (action.asyncResult === true && action.loading === true) {
        const predicate = (n) => _.isFunction(this[n]);
        const trigger = {
          action: !_.some([name, _.camelCase(`on ${name}`)], predicate),
          completed: !_.some([_.camelCase(`on ${name} completed`), _.camelCase(`${name} completed`)], predicate),
          failure: !_.some([_.camelCase(`on ${name} failure`), _.camelCase(`${name} failure`)], predicate)
        };

        this.listenTo(action, () => this.setLoading(true, trigger.action));
        this.listenTo(action.completed, () => this.setLoading(false, trigger.completed));
        this.listenTo(action.failure, () => this.setLoading(false, trigger.failure));
      }
    });
  },

  setLoading(state = true, trigger = true) {
    if (this.data.isLoading === state) {
      return;
    }

    console.debug('StoreLoadingMixin::setLoading', state);

    if (trigger) {
      this.trigger({
        isLoading: state,
        hideDialogs: !state
      });
    } else {
      this.data.isLoading = state;
    }
  }
};
