class AuthApi {
  static login() {
    const request = new Request('/auth/google', {
      method : 'GET'
    });
    return fetch(request).then(response => response/*response.json()*/)
    .catch(error => error);
  }
}

export default AuthApi;
