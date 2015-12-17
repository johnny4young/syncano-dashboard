import _ from 'lodash';

export default {
  get(solutionId) {
    return this.Connection
            .Solutions
            .get(solutionId)
            .then(this.completed)
            .catch(this.failure);
  },
  listVersions(solutionId) {
    this.Connection
      .Solutions
      .listVersions(solutionId)
      .then(this.completed)
      .catch(this.failure);
  },
  createVersion(solutionId, payload) {
    this.Connection
      .Solutions
      .createVersion(solutionId, payload)
      .then(this.completed)
      .catch(this.failure);
  },
  install(payload) {
    return this.Connection
            .Solutions
            .install(
              payload.solutionId,
              payload.versionId,
              payload.instanceName
            )
            .then(this.completed)
            .catch(this.failure);
  },
  remove(solutionId) {
    return this.Connection
            .Solutions
            .remove(solutionId)
            .then(this.completed)
            .catch(this.failure);
  },
  list(params = {}) {
    if (!_.keys(params).includes('ordering')) {
      _.assign(params, {ordering: 'desc'});
    }

    this.Connection
      .Solutions
      .list(params)
      .then(this.completed)
      .catch(this.failure);
  },
  create(payload) {
    this.Connection
      .Solutions
      .create(payload)
      .then(this.completed)
      .catch(this.failure);
  },
  update(id, payload) {
    this.Connection
      .Solutions
      .update(id, payload)
      .then(this.completed)
      .catch(this.failure);
  },
  star(id) {
    this.Connection
      .Solutions
      .star(id)
      .then(this.completed)
      .catch(this.failure);
  },
  unstar(id) {
    this.Connection
      .Solutions
      .unstar(id)
      .then(this.completed)
      .catch(this.failure);
  },
  listTags(id) {
    this.Connection
      .Solutions
      .listTags(id)
      .then(this.completed)
      .catch(this.failure);
  }

};
