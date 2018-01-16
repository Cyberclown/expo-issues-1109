import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Constants } from 'expo';
import { NavigationActions } from 'react-navigation'

import { Button } from './../lib-components';
import { IdentityDP } from './../lib-dataprovider';

export default class Workspace extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isLogoutButtonActive: true,
    };
  }

  componentWillMount() {
    IdentityDP.whoIsLoggedIn().then(usr => {
      this.setState({
        user: usr
      })
    })
  }

  render() {
    return (
      <View>

        <View style={styles.page_header}>          
          {
            (this.state.user !== null) ? (
              <Text>{this.state.user.fullname}</Text>                
            ) : (
              <Text>USER CANNOT BE IDENTIFIED, try logging out and logging back into the app</Text>
            )
          }          
        </View>

        <Button text='Logout' action={ () => this.logout() } active={this.state.isLogoutButtonActive} />
      </View>
    );
  }

  logout() {

    this.setState({ isLogoutButtonActive: false });
  
    IdentityDP.tryLogout().then(()=>{
      const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: 'Identity'})
        ]
      })
      this.props.navigation.dispatch(resetAction)

      this.setState({ isLogoutButtonActive: true });

    }).catch((e)=>{
      console.error(e);
    })
  }

}

const styles = StyleSheet.create({

  page_header: {
    flexDirection: 'row',
    backgroundColor: '#1a9bfc',
    height: 70,
    paddingTop: Constants.statusBarHeight,    
    alignItems: 'center', //alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },


});
