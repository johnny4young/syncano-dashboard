export default {
  create(payload) {
    this.Connection
      .Triggers
      .create(payload)
      .then(this.completed)
      .catch(this.failure);
  },

  list() {
    this.Connection
      .Triggers
      .list()
      .then(this.completed)
      .catch(this.failure);
  },

  update(id, payload) {
    this.Connection
      .Triggers
      .update(id, payload)
      .then(this.completed)
      .catch(this.failure);
  },

  remove(ids) {

    let promises = ids.map(id => {
      return this.Connection.Triggers.remove(id);
    });

    this.D.all(promises)
      .success(this.completed)
      .error(this.failure);
  }
};