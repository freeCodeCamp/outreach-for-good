import Api from './Api';

class SchoolsApi extends Api {

/**
 * Get my info
 */
  static getMySchool() {
    const headers = this.requestHeaders();
    //console.log(headers)
    const req = new Request('/api/schools/me', {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Get a single school
 */
  static getSchool(schoolId) {
    const headers = this.requestHeaders();
    const req = new Request(`/api/schools/${schoolId}`, {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Get list of schools
 * restriction: 'admin'
 */
  static getSchools() {
    const headers = this.requestHeaders();
    const req = new Request('/api/schools/', {
      method : 'GET',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res))
    .catch(error => {
      throw error;
    });
  }

/**
 * Deletes a school
 * restriction: 'admin'
 */
  static removeSchool(schoolId) {
    const headers = this.requestHeaders();
    const req = new Request(`/api/schools/${schoolId}`, {
      method : 'DELETE',
      headers
    });
    return fetch(req).then(res => this.parseResponse(res, 'DELETE'))
    .catch(error => error);
  }
}

export default SchoolsApi;
