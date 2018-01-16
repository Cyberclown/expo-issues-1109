
import { 
  SecureStorage,
} from './../lib-api';


let baseURL = '';

export default class Http {

  constructor(url) {
    this.baseURL = url;
  }

  async call(verb, url, body, ignoreNetworkRequestFailure=false, jwt=null) {

    let httpParams = {
      method: verb,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }

    if (jwt) {
      httpParams.headers.Authorization = 'Bearer ' + jwt;
    }

    if (body)
      httpParams.body = JSON.stringify(body);

    let fullUrl = this.baseURL + url;
    let data = await (fetch(fullUrl, httpParams).then(res => {

      //The call effectively failed, treat as such, unless we auto refresh tokens - TODO
      if (res.status === 401) {
        console.log('401 returned for ' + url);
        throw url + ' Unauthorised';
      }

      let contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        return res.text();
      }

    }).catch(err => {
      //TODO: Handle refresh of token here.

      if (ignoreNetworkRequestFailure) {
        if (err.message === 'Network request failed')
          console.log(err.message + ', path: ' + fullUrl);
      } else {
        console.error(err);
      }
      throw err;

    }));

    return await data; 

  }
  
  static buildQueryString(params) {
    return '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}


/*

  async function getMoviesFromApi() {
    try {
      let response = await fetch('https://facebook.github.io/react-native/movies.json');
      let responseJson = await response.json();
      return responseJson.movies;
    } catch(error) {
      console.error(error);
    }
  }

*/