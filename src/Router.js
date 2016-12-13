import React, { Component } from 'react';
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
            onRight={() => Actions.publicMessages()}
            rightTitle="Chat all"
            initial/>
          <Scene
            key="publicMessages"
            component={PublicMessageScreen}
            title="Public Chat"/>
          <Scene
            key="privateMessages"
            component={PrivateMessageScreen}
            title="Private Chat"/>
        </Scene>
      </Router>
    );
  };
};

export default connect()(RouterComponent);
