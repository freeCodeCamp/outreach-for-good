import Api from './Api';

class StudentApi extends Api {

  /**
   * Fetch a student from the database
   */
  static fetchStudent(studentId) {
    let request = new Request(`/api/students/${studentId}`, {
      method  : 'GET',
      headers : this.requestHeaders()
    });
    return fetch(request)
      .then(resp => {
        return resp.json();
      })
      .catch(err => this.handleError(err));
  }
}
export default StudentApi;
