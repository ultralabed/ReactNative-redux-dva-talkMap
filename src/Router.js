import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import SplashScreen from './routes/SplashScreen';
import LoginForm from './routes/LoginForm';
import TalkMapScreen from './routes/TalkMapScreen';
import PublicMessageScreen from './routes/PublicMessageScreen';
import PrivateMessageScreen from './routes/PrivateMessageScreen';
import { connect } from 'dva/mobile';

class RouterComponent extends Component {
  render() {
    const { title } = this.props;
    const  navBarHeight = Number(Platform.OS === 'ios' ? '64': '44');
    return (
      <Router sceneStyle={{ paddingTop: navBarHeight }}>
        <Scene key="screen">
          <Scene key="splash" component={SplashScreen} hideNavBar={true} initial/>
        </Scene>
        <Scene key="auth">
          <Scene key="login" component={LoginForm} title="Login to Talk Map" initial/>
        </Scene>
        <Scene key="main">
          <Scene
            key="map"
            component={TalkMapScreen}
            title="Talk Map"
            onLeft={() => this.props.dispatch({ type: 'auth/logoutUser' })}
            leftTitle="Logout"
            onRight={() => Actions.publicMessages()}
            rightTitle="Chat all"
            leftButtonTextStyle={{color: '#000'}}
            rightButtonTextStyle={{color: '#000'}}
            initial/>
          <Scene
            key="publicMessages"
            component={PublicMessageScreen}
            title="Public Chat"
            leftButtonIconStyle={{tintColor: '#fff'}}
            titleStyle={{color: '#fff'}}
            navigationBarStyle={{backgroundColor: '#4080ff'}}/>
          <Scene
            key="privateMessages"
            component={PrivateMessageScreen}
            leftButtonIconStyle={{tintColor: '#fff'}}
            titleStyle={{color: '#fff'}}
            navigationBarStyle={{backgroundColor: '#4080ff'}}
            title="Private Chat"/>
        </Scene>
      </Router>
    );
  };
};

export default connect()(RouterComponent);
