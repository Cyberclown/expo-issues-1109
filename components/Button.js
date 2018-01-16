import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class Button extends Component<{}> {
  
  constructor(props) {
    super(props);

    this.state = { };
  }

  render() {

    const { style } = this.props;
    let parentStyles = style;

    return (
      <View style={{marginTop: 15, width: '80%'}}>
        {
          !this.props.active ? (
            <View style={ [ localStyles.button, localStyles.buttonInactive, parentStyles ] }>              
              <Text style={[ localStyles.text, localStyles.textInactive ]}>{this.props.text}</Text>
            </View>                
          ) : (
            <TouchableOpacity onPress={this.props.action}>
              <View style={ [ localStyles.button, parentStyles ] }>              
                <Text style={[ localStyles.text ]}>{this.props.text}</Text>
              </View>                
            </TouchableOpacity>
          )
        }
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  
  button: {
    backgroundColor: '#1a9bfc', 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0, 
    borderRadius:30,
    //borderColor: 'transparent'
  },

  buttonInactive: {
    backgroundColor: 'grey', 
  },

  text: {
    color: 'white', 
  },

  textInactive: {
    color: 'grey', 
  }, 

});

Button.defaultProps = {
  active: true,
  text: 'Text not set',
  action: () => alert('Action not set'),
};


