class UsersApi {

/**
 * Get my info
 */
  static getMyself() {
    const headers = this.requestHeaders();
    console.log(headers)
    const request = new Request('/api/users/me', {
      method : 'GET',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Get a single user
 */
  static getUser(userId) {
    const headers = this.requestHeaders();
    const request = new Request(`/api/users/${userId}`, {
      method : 'GET',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Get list of users
 * restriction: 'admin'
 */
  static getUsers() {
    const headers = this.requestHeaders();
    const request = new Request('/api/users/', {
      method : 'GET',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Change a user's role.
 * restriction: 'admin'
 */
  static updateRole(userId, roleId) {
    const headers = this.requestHeaders();
    const request = new Request(`/api/users/${userId}/${roleId}`, {
      method : 'PUT',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Change a user's assigned school.
 * restriction: 'admin'
 */
  static updateSchool(userId, schoolId) {
    const headers = this.requestHeaders();
    const request = new Request(`/api/users/${userId}/${schoolId}`, {
      method : 'PUT',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Deletes a user
 * restriction: 'admin'
 */
  static removeUser(userId) {
    const headers = this.requestHeaders();
    const request = new Request(`/api/users/${userId}`, {
      method : 'DELETE',
      headers
    });
    return fetch(request).then(response => response.json())
    .catch(error => error);
  }

/**
 * Retrieves JWT token for authorization
 */
  static requestHeaders() {
    console.log('Setup Header', sessionStorage.token);
    return {Authorization: `Bearer ${sessionStorage.token}`};
  }

}

export default UsersApi;