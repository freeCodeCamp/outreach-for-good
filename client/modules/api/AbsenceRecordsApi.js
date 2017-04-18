/**
 * Description of the absence record endpoints
 *
 * /api/absence-records
 *
 * POST /school/:schoolId *
 * DELETE /:recordId
 * GET /school/:schoolId/list *
 * GET /students/:studentId *
 * GET /current *
 * GET /list/current *
 * GET /list/current/query *
 * GET /list/current/at-risk *
 * GET /list/current/chronic *
 * GET /list/year/:year *
 */
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
    return this.getAPI('/api/absence-records/current');
  }

  /**
   * Get the absence record of a particular student
   *   - untested
   */
  static fetchStudentRecord(studentId) {
    return this.getAPI(`/api/absence-records/students/${studentId}`);
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
    return this.getAPI('/api/absence-records/list/current');
  }

  /**
   * Get list of absence records for the most recent
   *   schoolYear for the school.
   * restriction: 'teacher'
   *   - untested
   */
  static fetchSchoolRecordList(schoolId) {
    return this.getAPI(`/api/absence-records/school/${schoolId}/list`);
  }

  /**
   * Get entries for students with outreaches specified by filter.
   * restriction: 'teacher'
   *
   * Returns an aggregation for entries based on the req user role:
   * - teachers will get entries for assignment school
   * - manager+ will get entries for all schools
   */
  static fetchRecordsListQuery(querystring = '') {
    return this.getAPI(`/api/absence-records/list/current/query?${querystring}`);
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
    return this.getAPI('/api/absence-records/list/current/at-risk');
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
    return this.getAPI('/api/absence-records/list/current/chronic');
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
    return this.getAPI(`/api/absence-records/list/year/${year}`);
  }

  /**
   * Creates a new absence record in the DB.
   * restriction: 'teacher'
   *   - untested
   */
  static addRecord(record) {
    return this.postAPI(`/api/absence-records/school/${record.schoolId}`, record);
  }

  /**
   * Delete an absence record
   *   - untested
   */
  static removeRecord(recordId) {
    return this.deleteAPI(`/api/absence-records/${recordId}`);
  }

}
export default AbsenceRecordsApi;
