import React from 'react';
import { StackNavigator } from 'react-navigation';

import IdentityJourney from './journeys/Identity';
import WorkspaceJourney from './journeys/workspace';


const routeConfigs = {

  Identity: {
    screen: IdentityJourney,
  },

  Workspace: {
    screen: WorkspaceJourney,
  }, 

}

const Navigator = ({ initialRouteName, screenProps }) => {
  const stackNavigatorConfigs = {
    initialRouteName,
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
    }),
  };
  const CustomNavigator = StackNavigator(routeConfigs, stackNavigatorConfigs);
  return <CustomNavigator screenProps={screenProps} />
         
};

export default Nav = ({ initialRouteName, screenProps }) => (
  <Navigator screenProps={screenProps} initialRouteName={initialRouteName} />
);

