import Api from './Api';

class UsersApi extends Api {

/**
 * Get my info
 */
  static getMyself() {
    const headers = this.requestHeaders();
    //console.log(headers)
    const req = new Request('/api/users/me', {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Get a single user
 */
  static getUser(userId) {
    const headers = this.requestHeaders();
    const req = new Request(`/api/users/${userId}`, {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Get list of users
 * restriction: 'admin'
 */
  static getUsers() {
    const headers = this.requestHeaders();
    const req = new Request('/api/users/', {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Change a user's role.
 * restriction: 'admin'
 */
  static updateRole(userId, roleId) {
    const headers = this.requestHeaders();
    const body = this.requestBody({role: roleId});
    const req = new Request(`/api/users/${userId}/role`, {
      method : 'PUT',
      headers,
      body
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
  static updateSchool(userId, schoolId) {
    const headers = this.requestHeaders();
    const req = new Request(`/api/users/${userId}/${schoolId}`, {
      method : 'PUT',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => error);
  }

/**
 * Deletes a user
 * restriction: 'admin'
 */
  static removeUser(userId) {
    const headers = this.requestHeaders();
    const req = new Request(`/api/users/${userId}`, {
      method : 'DELETE',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res, 'DELETE'))
    .catch(error => error);
  }
}

export default UsersApi;
