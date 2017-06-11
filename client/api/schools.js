/**
 * Describe the routes from the school Api
 *
 * /api/schools
 *
 * GET /
 * GET /names
 * GET /:schoolId
 *
 * POST /
 * DELETE /:schoolId
 * PUT /:schoolId/update-triggers
 *
 */
import Api from './api';

class SchoolsApi extends Api {

  /**
   * Get my schools based on user role
   */
  static getSchools() {
    return this.getAPI('/api/schools');
  }

  /**
   * Get school names based on user role
   */
  static getNames() {
    return this.getAPI('/api/schools/names');
  }
  /**
   * Get a single school
   */
  static getSchool(schoolId) {
    return this.getAPI(`/api/schools/${schoolId}`);
  }

  static addSchool(schoolName) {
    return this.postAPI('/api/schools', {name: schoolName});
  }

  static removeSchool(schoolId) {
    return this.deleteAPI(`/api/schools/${schoolId}`);
  }

  static changeTriggers(schoolId, triggers) {
    return this.putAPI(`/api/schools/${schoolId}/update-triggers`, triggers);
  }
/**
 * ROUTES IN USE BY ACTIONS SO COME BACK AND CHANGE LATER
 * COMMENTED OUT IN CASE I BREAK EVERYTHING
 * Get list of schools
 * restriction: 'admin'
 */
  // static getSchools() {
  //   const headers = this.requestHeaders();
  //   const req = new Request('/api/schools/', {
  //     method : 'GET',
  //     headers
  //   });
  //   return fetch(req).then(res => this.parseResponse(res))
  //   .catch(error => {
  //     throw error;
  //   });
  // }

/**
 * Adds a school
 * restriction: 'admin'
 */
  // static addSchool(schoolName) {
  //   const req = new Request('/api/schools', {
  //     method  : 'POST',
  //     headers : this.requestHeaders(),
  //     body    : this.requestBody({name: schoolName})
  //   });
  //   return fetch(req).then(res => this.parseResponse(res, 'POST'))
  //   .catch(error => error);
  // }

/**
 * Deletes a school
 * restriction: 'admin'
 */
  // static removeSchool(schoolId) {
  //   const req = new Request(`/api/schools/${schoolId}`, {
  //     method  : 'DELETE',
  //     headers : this.requestHeaders()
  //   });
  //   return fetch(req).then(res => this.parseResponse(res, 'DELETE'))
  //   .catch(error => error);
  // }
}

export default SchoolsApi;
