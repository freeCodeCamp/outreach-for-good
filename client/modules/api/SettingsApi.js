/**
 * Routes associated with the settings of the app
 */
import Api from './Api';

class SettingsApi extends Api {
  /**
  * Get intervention types
  */
  static getInterventionTypes() {
    return this.getAPI('/api/settings/intervention/types');
  }
}


export default SettingsApi;
