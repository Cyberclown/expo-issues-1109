import { StackNavigator } from 'react-navigation';

import Login from './identity/Login';

export default Identity = StackNavigator(
  { 
    Login: { screen: Login },
  }, {     
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: true,
    }
  }
);