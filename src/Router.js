import React, { Component } from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import SplashScreen from './routes/SplashScreen';
import LoginForm from './routes/LoginForm';
import TalkMapScreen from './routes/TalkMapScreen';
import { connect } from 'dva/mobile';

class RouterComponent extends Component {
  render() {
    return (
      <Router sceneStyle={{ paddingTop: 65 }}>
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
            initial/>
        </Scene>
      </Router>
    );
  };
};

export default connect()(RouterComponent);
