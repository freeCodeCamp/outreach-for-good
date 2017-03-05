class AuthApi {
  static login() {
    console.log('in auth API')
    const request = new Request('http://localhost:9000/auth/google', {
      method : 'GET'
    });
    return fetch(request).then(response => response/*response.json()*/)
    .catch(error => error);
  }
}

export default AuthApi;
