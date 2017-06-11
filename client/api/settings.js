/**
 * Routes associated with the settings of the app
 */
import Api from './api';

class SettingsApi extends Api {
  /**
  * Get intervention types
  */
  static getInterventionTypes() {
    return this.getAPI('/api/settings/intervention/types');
  }
}


export default SettingsApi;
