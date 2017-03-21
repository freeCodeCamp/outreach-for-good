class Api {
  /**
   * Retrieves JWT token for authorization
   */
  static requestHeaders() {
    //console.log('Setup Header', sessionStorage.token);
    return {Authorization: `Bearer ${sessionStorage.token}`};
  }

  /**
   * Process API response codes
   */
  static parseResponse(res, reqType='GET') {
    let status = res.status;
    if(status >= 400 && status < 500) {
      throw res;
    } else if(status >= 300 && status < 400) {
      throw res;
    } else if(reqType == 'GET') {
      return res.json();
    } else {
      return res;
    }
  }

  /**
   * Handle errors from api calls
   */
  static handleError(err) {
    console.log(err);
  }

  /**
   * Fetch requests
   */
  static fetchRequest(method = 'GET', url, body) {
    console.log(method, url, body);
  }
}
export default Api;
