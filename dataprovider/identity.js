import { 
  Http, 
  SecureStorage,
} from './../lib-api';
import { AuthSession } from 'expo';
import jwt_decode from 'jwt-decode';


const ACCESS_TOKEN = 'AccessToken';
const ID_TOKEN = 'IdToken';

const auth0ClientId =  'JYW1h0UFdmbHIIqAZoAgSkFEJrAMmAkb';
const auth0Domain = 'https://nvdm-test.auth0.com'

let http = new Http(auth0Domain);

export default {
  
  async tryLogin(authType) {

    if (!authType) {
      console.error('authType cannot be empty');
      return false;
    }

    const redirectUrl = AuthSession.getRedirectUrl();

    let conn;
    if (authType === 'FACEBOOK') {
      conn = 'facebook';
    } else if (authType === 'GOOGLE') {
      conn = 'google-oauth2';
    } else {
      conn = 'Username-Password-Authentication';
    }

    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize` + 
        Http.buildQueryString({
          connection: conn,
          client_id: auth0ClientId,
          response_type: 'token',
          scope: 'openid profile', //user_id
          redirect_uri: redirectUrl,
        }),
    })

    if (result.type === 'success') {
      console.log('Successfully logged in!');

      let accessToken = result.params.access_token;
      let idToken = result.params.id_token;

      console.log('accessToken: ' + accessToken);
      console.log('idToken: ' + idToken);

      if (!accessToken || !idToken) {
        console.log('Login succeeded but id tokens or access token could not be found.')
        return false;
      } else {

        let accessTokenSaveRes = false;
        await SecureStorage.setData(ACCESS_TOKEN, accessToken).then( () => {
          accessTokenSaveRes = true;
        }).catch( (e) => {
          console.error('error: ' + e);
        })

        let idTokenSaveRes = false;
        await SecureStorage.setData(ID_TOKEN, idToken).then( () => {
          idTokenSaveRes = true;
        }).catch( (e) => {
          console.error('error: ' + e);
        })        


        return (accessTokenSaveRes && idTokenSaveRes);  
      }
    } else {
      console.log('Login cancelled!');
      return false;
    }
  },

  async isLoggedIn() {
    console.log('Checking if user is logged in.');

    let x = await this.getJwt();
    if (x !== null) {
      console.log('User is logged in');
      return true;
    } else {
      console.log('No one is logged in');
      return false;
    }
  },

  async getJwt() {
    let jwt = null;
    await SecureStorage.getData(ID_TOKEN).then( (val) => {
      if (val)
        jwt = val;
    }).catch( (e) => {
      console.info('User has to log in.' + e);
    })

    return jwt;
  },  

  async whoIsLoggedIn() {

    let x = null;
    await SecureStorage.getData(ID_TOKEN).then( (val) => {
      if (val) {
        //console.log(val);
        let decoded = jwt_decode(val);                

        let pimg = decoded.picture;
        if (decoded.picture_large)
          pimg = decoded.picture_large;

        x = {
          fullname: decoded.name,
          idp: decoded.sub,
          profileImg: pimg,          
        };

      } 
    }).catch( (e) => {
      console.error(e);
      x = null;
    })

    return x;
    
  },  

  async tryLogout() {
    let qs =  Http.buildQueryString({
      client_id: auth0ClientId,
    });  
    
    await http.call('GET', '/v2/logout' + qs ).then( async retval => {
      await SecureStorage.deleteData(ACCESS_TOKEN);
      await SecureStorage.deleteData(ID_TOKEN);
      console.info('Logged out, BYE !!!!!');  
    } ).catch( (e) => {
      console.error(e);
    })
  },  
  
}