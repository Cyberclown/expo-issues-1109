import React from 'react';
import { View } from 'react-native';

import { Button } from './../../lib-components'
import { IdentityDP } from './../../lib-dataprovider';


import { AuthSession } from 'expo';
import { Http } from './../../lib-api';

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/*<Button text='Facebook' action={ () => this.login('FACEBOOK') } />*/}
        <Button text='Google' action={ () => this.login('GOOGLE') } />
        <Button text='Login and Registration' action={ () => this.login('UP') } />
      </View>
    );
  }

  async login(authType) {

    /* TEST 1 */    
    IdentityDP.tryLogin(authType).then( (val) => {
      if (val) {
        console.log('TODO: download data on successfull login')
        this.props.navigation.navigate('Menu');   //<------------------------------ THIS IS THE LINE THAT DOES EXECUTE CORRECTLY
      } else {
        //TODO: error on the UI        
      }
    }).catch( (e) => {
      console.error(e);
    })


    /* TEST 2 */
    /*
    try {
      const auth0Domain = 'https://nvdm-test.auth0.com'
      const result = await AuthSession.startAsync({
        authUrl: `${auth0Domain}/authorize` + 
          Http.buildQueryString({
            connection: 'google-oauth2',
            client_id: 'JYW1h0UFdmbHIIqAZoAgSkFEJrAMmAkb',
            response_type: 'token',
            scope: 'openid profile',
            redirect_uri: AuthSession.getRedirectUrl(),
          }),
      })

      //alert(JSON.stringify(result));
      if (result.type === 'success') {
        this.props.navigation.navigate('Menu'); //<------------------------------ THIS IS THE LINE THAT DOES EXECUTE CORRECTLY
      }
      
    } catch (e) {
      console.error(e);
    }
    */  
  }
}