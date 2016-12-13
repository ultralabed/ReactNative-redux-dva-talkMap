import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, WingBlank, InputItem, WhiteSpace, List } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';

class TalkMapScreen extends Component {
  // state = {
  //   initialPosition: 'unknown',
  //   lastPosition: 'unknown',
  // };

  watchID: ?number = null;
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.props.dispatch({ type: 'Location/updateUserLocation', payload: { latitude, longitude } });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.props.dispatch({ type: 'Location/updateUserLocation', payload: { latitude, longitude } });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { latitude, longitude } = this.props.location;
    const { message, dispatch, allMessages } = this.props;
    console.log(allMessages);
    return (
      <View>
        <Text>this is talkMapScreen Main page.</Text>
        <Text>
          <Text style={styles.title}>Position now: </Text>
          latitude is {latitude}
          longitude is {longitude}
        </Text>
        <List>
        <InputItem
            clear
            value={message}
            type="text"
            onChange={(value) => dispatch({ type: 'Messages/messageText', payload: value })}
            placeholder="Type here~!"
            labelNumber={7}
            error
            onErrorPress={() => message ? dispatch({ type: 'Messages/addPublicMessages', payload: message }) : null}
          >Message
          </InputItem>
        </List>
      </View>
    );
  }
};

const styles = {
  title: {
    fontWeight: '500',
  },
};

const mapStateToProps = ({ Location, Messages }) => {
  const { location } = Location;
  const { message, allMessages } = Messages;
  return {
    location,
    allMessages,
    message,
  };
}
export default connect(mapStateToProps)(TalkMapScreen);
