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

  static putInterventionType(typeId, intervention) {
    return this.putAPI(`/api/settings/intervention/types/${typeId}`, intervention);
  }

  static postInterventionType(intervention) {
    return this.postAPI('/api/settings/intervention/types', intervention);
  }

  static deleteInterventionType(typeId) {
    return this.deleteAPI(`/api/settings/intervention/types/${typeId}`);
  }
}


export default SettingsApi;
