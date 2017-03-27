import Api from './Api';

class AbsenceRecordsApi extends Api {

/**
 * Get current absence records.
 * restriction: 'teacher'
 *   - untested
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get record for assignment school
 * - manager+ will get records for all schools
 */
  static fetchRecords() {
    const req = new Request('/api/absence-records/current', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get the absence record of a particular student
 *   - untested
 */
  static fetchStudentRecord(studentId) {
    const req = new Request(`/api/absence-records/students/${studentId}`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get entries from current absence records.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
  static fetchRecordsList() {
    const req = new Request('/api/absence-records/list/current', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get list of absence records for the most recent
 *   schoolYear for the school.
 * restriction: 'teacher'
 *   - untested
 */
  static fetchSchoolRecordList(schoolId) {
    const req = new Request(`/api/absence-records/school/${schoolId}/list`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get entries for students with outreaches specified by filter.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
  static fetchRecordsListQuery() {
    const req = new Request('/api/absence-records/list/current/query', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get entries for students at risk of becoming chronically absent.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
  static fetchRecordsListAtRisk() {
    const req = new Request('/api/absence-records/list/current/at-risk', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get entries of chronically absent students.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
  static fetchRecordsListChronic() {
    const req = new Request('/api/absence-records/list/current/chronic', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Get entries from specified absence record year.
 * restriction: 'teacher'
 *
 * Returns an aggregation for entries based on the req user role:
 * - teachers will get entries for assignment school
 * - manager+ will get entries for all schools
 */
  static fetchRecordsListYear(year) {
    const req = new Request(`/api/absence-records/list/year/${year}`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Creates a new absence record in the DB.
 * restriction: 'teacher'
 *   - untested
 */
  static addRecord(schoolId, record) {
    const req = new Request(`/api/absence-records/school/${schoolId}`, {
      method  : 'POST',
      headers : this.requestHeaders(),
      body    : this.requestBody(record)
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

/**
 * Delete an absence record
 *   - untested
 */
  static removeRecord(recordId) {
    const req = new Request(`/api/absence-records/${recordId}`, {
      method  : 'DELETE',
      headers : this.requestHeaders()
    });
    return fetch(req)
    .then(res => this.parseResponse(res))
    .catch(err => {
      throw err;
    });
  }

}
export default AbsenceRecordsApi;
