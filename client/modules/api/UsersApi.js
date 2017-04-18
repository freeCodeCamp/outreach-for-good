import Api from './Api';

class UsersApi extends Api {

/**
 * Get my info
 */
  static getMyself() {
    const req = new Request('/api/users/me', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get a single user
 */
  static getUser(userId) {
    const req = new Request(`/api/users/${userId}`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get list of users
 * restriction: 'admin'
 */
  static getUsers() {
    const req = new Request('/api/users/', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Change a user's role.
 * restriction: 'admin'
 */
  static updateRole(userId, roleId) {
    const req = new Request(`/api/users/${userId}/role`, {
      method  : 'PUT',
      headers : this.requestHeaders(),
      body    : this.requestBody({role: roleId})
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
  static updateSchool(userId, schoolId) {
    const req = new Request(`/api/users/${userId}/assignment`, {
      method  : 'PUT',
      headers : this.requestHeaders(),
      body    : this.requestBody({assignment: schoolId})
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Deletes a user
 * restriction: 'admin'
 */
  static removeUser(userId) {
    const req = new Request(`/api/users/${userId}`, {
      method  : 'DELETE',
      headers : this.requestHeaders()
    });
    return fetch(req).then(res => this.parseResponse(res, 'DELETE'))
    .catch(err => {
      throw err;
    });
  }
}

export default UsersApi;
