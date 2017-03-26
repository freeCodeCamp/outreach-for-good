class Api {

  /**
   * Generate application/json request header / body
   */
  static requestHeaders() {
    return {
      Authorization  : `Bearer ${sessionStorage.token}`,
      'Content-Type' : 'application/json'
    };
  }

  static requestBody(body) {
    return JSON.stringify(body);
  }

  /**
   * Generate application/x-www-form-urlencoded request header / body
   */
  static requestUrlEncodedHeaders() {
    return {
      Authorization  : `Bearer ${sessionStorage.token}`,
      'Content-Type' : 'application/x-www-form-urlencoded'
    };
  }

  static requestUrlEncodedBody(body) {
    let data = [];
    for(let key in body) {
      data.push(`${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`);
    }
    return data.join('&');
  }

  /**
   * Process API response codes
   */
  static parseResponse(res, reqType = 'GET') {
    let status = res.status;
    if(status >= 400 && status < 500) {
      console.log('Leaving this message in until I figure out how to catch 401s');
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
