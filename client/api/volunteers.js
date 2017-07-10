import Api from './api.js';

class VolunteerApi extends Api {

  static getVolunteers(schoolId) {
    return this.getAPI(`/api/volunteers/${schoolId}`);
  }

  static postVolunteer(schoolId, volunteer) {
    return this.postAPI(`/api/volunteers/${schoolId}`, volunteer);
  }

  static putVolunteer(schoolId, volunteer) {
    return this.putAPI(`/api/volunteers/${schoolId}`, volunteer);
  }

  static deleteVolunteer(schoolId, volunteerId) {
    return this.deleteAPI(`/api/volunteers/${schoolId}/${volunteerId}`);
  }
}

export default VolunteerApi;
