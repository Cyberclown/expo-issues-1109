import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState } from 'react-native';
import { AppLoading, KeepAwake } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

import RootNav from './nav-root'

import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import { IdentityDP } from './lib-dataprovider';

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props);  

    this.state = {
      appIsReady: false,
      appState: AppState.currentState,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillMount() {
    AppState.removeEventListener('change', this._handleAppStateChange);

    this._loadAssetsAsync();

    this.checkLoggedInStatusOnResume();
    
  }
  
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkLoggedInStatusOnResume();
      console.log('App state brought into active mode');
    }
    this.setState({appState: nextAppState});
  } 
  
  checkLoggedInStatusOnResume() {
    IdentityDP.isLoggedIn().then((val) => {
      
      if (val !== this.state.isLoggedIn) {
        this.setState( { isLoggedIn: val });
      }

      if (val) {
        console.log('Sync data at this point!');
      }
      
    });
  }
  

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font, { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
          { 'Roboto': require('native-base/Fonts/Roboto.ttf') },
          { 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf') },
        ],
      });

    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    
    let keepalive = null;
    if (__DEV__) {
      console.log('APP IN DEBUG MODE! Keep Alive to be enabled');
      keepalive = <KeepAwake />
    }

    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          {keepalive}

          {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
          {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

          {
            this.state.isLoggedIn ? (
              <RootNav initialRouteName={'Workspace'} /> 
            ) : (
              <RootNav initialRouteName={'Identity'} />
            )
          }
          
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
