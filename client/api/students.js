/**
 * Description of the routes associated with the student api
 *
 * /api/students
 *
 * GET /
 * GET /outreach-counts
 * GET /intervention-summary
 * GET /outreach-summary{?withdrawn=false}
 * GET /:studentId
 * PUT /:studentId/iep
 * PUT /:studentId/cfa
 * PUT /:studentId/withdrawn
 * PUT /:field **NEEDS TO UPDATE INTERVENTION TYPES**
 *
 * /api/students/:studentId/interventions
 *
 * GET /
 * POST /
 * PUT /:interventionId/archived
 * DELETE /:interventionId
 * POST /:interventionId/note
 *
 * /api/students/:studentId/notes
 *
 * GET /
 * GET /:noteId
 * POST /
 * PUT /:noteId
 * DELETE /:noteId
 *
 * /api/students/:studentId/outreaches
 *
 * GET /
 * POST /:outreachId/note
 * PUT /:outreachId/action
 *
 */
import Api from './api';

class StudentApi extends Api {
  /**
  * Get outreach counts
  */
  static getOutreachCounts(querystring = '') {
    return this.getAPI(`/api/students/outreach-counts?${querystring}`);
  }

  /**
  * Get intervention summary
  */
  static getInterventionSummary() {
    return this.getAPI('/api/students/intervention-summary');
  }

  /**
  * Get outreach summary
  */
  static getOutreachSummary() {
    return this.getAPI('/api/students/outreach-summary');
  }

  /**
   * Fetch a student from the database
   */
  static getStudent(studentId) {
    return this.getAPI(`/api/students/${studentId}`);
  }

  /**
   * Get the absence records for a specific student
   */
  static getStudentRecords(studentId) {
    return this.getAPI(`/api/absence-records/students/${studentId}`);
  }

  /**
   * Get interventions for a student from the student id
   */
  static getStudentInterventions(studentId) {
    return this.getAPI(`/api/students/${studentId}/interventions`);
  }

  /**
   * Get outreaches for a student from the student id
   */
  static getStudentOutreaches(studentId) {
    return this.getAPI(`/api/students/${studentId}/outreaches`);
  }

  /**
   * Get notes for a student from the student id
   */
  static getStudentNotes(studentId) {
    return this.getAPI(`/api/students/${studentId}/notes`);
  }

  /**
   * Change iep status of student
   */
  static putStudentIep(studentIds, iep) {
    return this.putAPI('/api/students/iep', {studentIds, value: iep});
  }

  /**
   * Change cfa status of student
   */
  static putStudentCfa(studentIds, cfa) {
    return this.putAPI('/api/students/cfa', {studentIds, value: cfa});
  }

  /**
   * Change withdrawn status of student
   */
  static putStudentWithdrawn(studentIds, withdrawn) {
    return this.putAPI('/api/students/withdrawn', {studentIds, value: withdrawn});
  }

  static postStudentNote(studentId, note) {
    return this.postAPI(`/api/students/${studentId}/notes`, note);
  }

  static putStudentNoteArchive(studentId, noteId, archived) {
    return this.putAPI(`/api/students/${studentId}/notes/${noteId}`, archived);
  }

  static deleteStudentNote(studentId, noteId) {
    return this.deleteAPI(`/api/students/${studentId}/notes/${noteId}`);
  }

  static postOutreachNote(studentId, outreachId, note) {
    return this.postAPI(`/api/students/${studentId}/outreaches/${outreachId}/note`, note);
  }

  static putOutreachAction(studentId, outreachId, action) {
    return this.putAPI(`/api/students/${studentId}/outreaches/${outreachId}/action`, action);
  }

  static postIntervention(studentId, intervention) {
    return this.postAPI(`/api/students/${studentId}/interventions`, intervention);
  }

  static putInterventionArchive(studentId, interventionId, archived) {
    return this.putAPI(`/api/students/${studentId}/interventions/${interventionId}/archived`, archived);
  }

  static deleteIntervention(studentId, interventionId) {
    return this.deleteAPI(`/api/students/${studentId}/interventions/${interventionId}`);
  }

  static postInterventionNote(studentId, interventionId, note) {
    return this.postAPI(`/api/students/${studentId}/interventions/${interventionId}/note`, note);
  }

}


export default StudentApi;
