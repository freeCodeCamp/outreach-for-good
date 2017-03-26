import Api from './Api';

class StudentApi extends Api {
  /**
   * Fetch a student from the database
   */
  static getStudent(studentId) {
    let request = new Request(`/api/students/${studentId}`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(resp => this.parseResponse(resp))
      .catch(err => this.handleError(err));
  }

  /**
   * Get the absence records for a specific student
   */
  static getStudentRecords(studentId) {
    let headers = this.requestHeaders();
    let request = new Request(`/api/absence-records/students/${studentId}`, {
      method : 'GET',
      headers
    });
    return fetch(request)
      .then(res => this.parseResponse(res))
      .catch(err => this.handleError(err));
  }

  /**
   * Get outreach counts
   */
  static getOutreachCounts() {
    let request = new Request('/api/student/outreach-counts', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(outreachCounts => this.parseResponse(outreachCounts))
      .catch(err => this.handleError(err));
  }

  /**
   * Get intervention summary
   */
  static getInterventionSummary() {
    let request = new Request('/api/student/intervention-summary', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(interventionSummary => this.parseResponse(interventionSummary))
      .catch(err => this.handleError(err));
  }

  /**
  * Get outreach summary
  */
  static getOutreachSummary() {
    let request = new Request('/api/student/outreach-summary', {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
    .then(outreachSummary => this.parseResponse(outreachSummary))
    .catch(err => this.handleError(err));
  }

  /**
   * Get interventions for a student from the student id
   */
  static getStudentInterventions(studentId) {
    let request = new Request(`/api/student/${studentId}/interventions`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(interventions => this.parseResponse(interventions))
      .catch(err => this.handleError(err));
  }

  /**
   * Get outreaches for a student from the student id
   */
  static getStudentOutreaches(studentId) {
    let request = new Request(`/api/student/${studentId}/outreaches`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(outreaches => this.parseResponse(outreaches))
      .catch(err => this.handleError(err));
  }

  /**
   * Get notes for a student from the student id
   */
  static getStudentNotes(studentId) {
    let request = new Request(`/api/student/${studentId}/notes`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(notes => this.parseResponse(notes))
      .catch(err => this.handleError(err));
  }

}


export default StudentApi;
