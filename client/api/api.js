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

  static getAPI(url) {
    let request = new Request(url, {
      method  : 'GET',
      headers : this.requestHeaders()
    });

    return fetch(request)
      .then(response => this.parseResponse(response))
      .catch(error => this.handleError(error));
  }

  static postAPI(url, body) {
    let request = new Request(url, {
      method  : 'POST',
      headers : this.requestHeaders(),
      body    : this.requestBody(body)
    });

    return fetch(request)
      .then(response => this.parseResponse(response))
      .catch(error => this.handleError(error));
  }

  static putAPI(url, body) {
    let request = new Request(url, {
      method  : 'PUT',
      headers : this.requestHeaders(),
      body    : this.requestBody(body)
    });

    return fetch(request)
      .then(response => this.parseResponse(response))
      .catch(error => this.handleError(error));
  }

  static deleteAPI(url) {
    let request = new Request(url, {
      method  : 'DELETE',
      headers : this.requestHeaders()
    });

    return fetch(request)
      .then(response => this.parseResponse(response))
      .catch(error => this.handleError(error));
  }
}
export default Api;
