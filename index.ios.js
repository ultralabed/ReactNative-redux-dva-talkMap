import React from 'react';
import { AppRegistry } from 'react-native';
import Router from './src/Router';
import dva, { connect } from 'dva/mobile';
import authModel from './src/models/auth';
import locationModel from './src/models/location';
import messagesModel from './src/models/message';

const app = dva();

app.model(authModel);
app.model(locationModel);
app.model(messagesModel);

app.router(() => <Router />);

AppRegistry.registerComponent('talkMap', () => app.start());
