import _ from 'lodash';
import moment from 'moment';
import MapView from 'react-native-maps';
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, InputItem, List } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import Circle from '../components/Circle';

class TalkMapScreen extends Component {
  state = {
    region: {},
  };

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

  renderMarkerCallout(data) {
    const { email, uid } = this.props.user;
    let time = data.latestMessage ? moment.unix(data.latestMessage / 1000).fromNow() : null;

    return (
      <View >
        <View>
          <Text  style={{fontSize: 20, fontWeight: 'bold'}}>
            {
              data.status === 'online' ?
              <Circle color="#00ff00"/>
              :
              <Circle color="#ff0000"/>
            }
            {
              email === data.email ?
              `Me`
              :
              `${_.capitalize(data.email.split('@')[0])}`
            }
            {
              email === data.email ?
              null:
              <Button
                style={{width: 50, left: 150}}
                onClick={() => this.props.dispatch({ type: 'Messages/checkConversationMap', payload: { from: uid , to: data.key, email: data.email } })}
                size="small"
                type="primary">
                  Chat
              </Button>
            }
          </Text>
        </View>
        <Text>{data.message}</Text>
        <Text style={{left: 90}}>{time}</Text>
      </View>
    )
  }

  render() {
    const { input, send } = styles;
    const { region, message, dispatch, allMessages, markers } = this.props;
    return (
      <View>
        <MapView
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 110}}
          region={region}
          >
          { markers.map(data => {
            const imagekey = data.email.length + 7;
            const imageUri = `https://avatars3.githubusercontent.com/u/${imagekey}?v=3&s=50`
            return (
              <MapView.Marker
                key={data.key}
                coordinate={{ latitude: data.latitude, longitude: data.longitude }}
                image={{ uri: imageUri}}
              >
                <MapView.Callout
                  style={{width: 200}}>
                  {this.renderMarkerCallout(data)}
                </MapView.Callout>
              </MapView.Marker>
            )
          })}
        </MapView>
        <View style={{flexDirection: 'row'}}>
          <InputItem
            clear
            value={message}
            type="text"
            style={input}
            onChange={(value) => dispatch({ type: 'Messages/messageText', payload: value })}
            placeholder="Send message here~!"
            >
          </InputItem>
          <TouchableHighlight onPress={() => message ? dispatch({ type: 'Messages/addPublicMessages', payload: message }) : null}>
            <Image style={send} source={require('../assets/send.jpg')}></Image>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
};

const styles = {
  input: {
    height: 40,
    width: Dimensions.get('window').width - 60,
  },
  send: {
    borderColor: '#fff',
    height: 40,
    width: 40,
    resizeMode : 'contain',
  },
}

const mapStateToProps = ({ Location, Messages, auth }) => {
  const { location, talkMapUsers } = Location;
  const { user } = auth;
  const region = { latitude: Number(location.latitude),
                    longitude: Number(location.longitude),
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                 };
  var markers = _.values(_.mapValues(talkMapUsers, function(value, key) { value.key = key; return value; }));
  const { message, allMessages } = Messages;
  return {
    user,
    markers,
    region,
    allMessages,
    message,
  };
}
export default connect(mapStateToProps)(TalkMapScreen);
