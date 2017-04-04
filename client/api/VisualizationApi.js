/**
 * Description of the visualization route
 *
 * GET /api/cfa-comparison/combined
 * GET /api/cfa-comparison/:schoolId
 *
 */

import Api from './Api';

class VisualizationApi extends Api {
  /**
   * Get request combined data visualization
   */
  static getCombined() {
    return this.getAPI('/api/cfa-comparison/combined');
  }

  /**
   * Get request school comparison
   */
  static getSchoolComparison(schoolId) {
    return this.getAPI(`/api/cfa-comparison/${schoolId}`);
  }
}

export default VisualizationApi;
