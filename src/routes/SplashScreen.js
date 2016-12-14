import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';

class SplashScreen extends Component {
  componentWillMount() {
    setTimeout(() => {
      this.props.user ? 
        Actions.main({ type: 'reset' })
        :
        Actions.auth({ type: 'reset' });
    }, 3000);
  }

  render() {
    const imageUrl = 'https://cdn.pixabay.com/photo/2015/03/27/20/42/smartphone-695164__340.jpg';
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{ fontSize: 20, }}>React Native Talk Map</Text>
        <Image style={{ width: 250, resizeMode : 'contain'}} source={require('../assets/map.jpg')}></Image>
      </View>
    );
  }
};

const mapStateToProps = ({ auth }) => {
  const { autoLogin, user } = auth;
  return {
    autoLogin,
    user,
  };
}

export default connect(mapStateToProps)(SplashScreen);
