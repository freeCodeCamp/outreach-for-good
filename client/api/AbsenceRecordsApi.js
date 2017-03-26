import Api from './Api';

class AbsenceRecordsApi extends Api {

  static getSchoolRecordList(schoolId) {
    let headers = this.requestHeaders();
    let request = new Request(`/api/absence-records/school/${schoolId}/list`, {
      method : 'GET',
      headers
    });

    return fetch(request)
      .then(res => this.parseResponse(res))
      .catch(err => this.handleError(err));
  }

  static getCurrentRecord() {
    let headers = this.requestHeaders();
    let request = new Request('/api/absence-records/current', {
      method : 'GET',
      headers
    });
    return fetch(request)
      .then(res => this.parseResponse(res))
      .catch(err => this.handleError(err));
  }

  // static getSchools() {
  //   let headers = this.requestHeaders();
  //   let request = new Request('/api/schools/names', {
  //     method : 'GET',
  //     headers
  //   });
  //
  //   return fetch(request)
  //     .then(res => this.parseResponse(res))
  //     .catch(err => this.handleError(err));
  // }

  static postRecord(record) {
    let config = {
      headers : {
        'Content-type' : 'application/json',
        Authorization  : `Bearer ${sessionStorage.token}`
      },
      method : 'POST',
      body   : JSON.stringify(record)
    };

    let request = new Request(`/api/absence-records/school/${record.schoolId}`, config);

    return fetch(request)
      .then(res => this.parseResponse(res))
      .catch(err => this.handleError(err));
  }
}
export default AbsenceRecordsApi;
