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
import { Button, InputItem, List, Flex } from 'antd-mobile';
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
    const { avatar, callOutContentView } = styles;
    let time = data.latestMessage ? moment.unix(data.latestMessage / 1000).fromNow(true) : null;
    const imagekey = data.email.length + 7;
    const imageUri = `https://avatars3.githubusercontent.com/u/${imagekey}?v=3&s=50`;

    return (
      <View>
        <View>
          <Text  style={{fontSize: 20, fontWeight: 'bold'}}>
            <Image style={{...avatar, borderRadius: 20}} source={{uri: imageUri}}></Image>
            {
              email === data.email ?
              <View style={callOutContentView}>
                <Flex justify="end">
                  <Circle color="#00ff00" size="10"/>
                </Flex>
                <Text>
                 Me:
                </Text>
                <Text numberOfLines={1}>{data.message}</Text>
              </View>
              :
              <View style={callOutContentView}>
                <Flex justify="end">
                  {
                    data.status === 'online' ?
                    <Circle color="#00ff00" size="10"/>
                    :
                    <Text style={{fontSize: 12}}>{time}</Text>
                  }
                </Flex>
                <Text>
                 {_.capitalize(data.email.split('@')[0])}:
                </Text>
                <Text numberOfLines={1}>{data.message}</Text>
              </View>
            }
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const { input, send, markerAvatar } = styles;
    const { region, message, dispatch, allMessages, markers } = this.props;
    const { email, uid } = this.props.user;

    return (
      <View>
        <MapView
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 107}}
          region={region}
          onRegionChangeComplete={(region) => {
            const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
            this.props.dispatch({ type: 'Location/updateDelta', payload: { latitude, longitude, latitudeDelta, longitudeDelta }});
            }
          }
          >
          { markers.map(data => {
            const imagekey = data.email.length + 7;
            const imageUri = `https://avatars3.githubusercontent.com/u/${imagekey}?v=3&s=50`
            const userStateColor = data.status === 'online' ? '#5cb85c' : '#f0ad4e';
            return (
              <MapView.Marker
                key={data.key}
                coordinate={{ latitude: data.latitude, longitude: data.longitude }}
              >
              <Image style={{...markerAvatar, borderColor: userStateColor, borderWidth: 2}} source={{uri: imageUri}}></Image>
                <MapView.Callout
                  onPress={email === data.email ? () => null : () => this.props.dispatch({ type: 'Messages/checkConversationMap', payload: { from: uid , to: data.key, email: data.email } })}
                  style={{ width: 200, height:50 }}>
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
          <TouchableHighlight
            underlayColor='#fff'
            onPress={() => message ? dispatch({ type: 'Messages/addPublicMessages', payload: message }) : null}>
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
    marginTop: 5,
    height: 30,
    width: 30,
    resizeMode : 'contain',
  },
  avatar: {
    borderColor: '#fff',
    height: 40,
    width: 40,
    resizeMode : 'contain',
  },
  callOutContentView: {
    flexDirection: 'column',
    width: 150,
    height: 45,
    left: 50,
  },
  markerAvatar: {
    borderColor: '#fff',
    marginTop: 5,
    height: 30,
    width: 30,
    resizeMode : 'contain',
    borderRadius: 15,
  },
}

const mapStateToProps = ({ Location, Messages, auth }) => {
  const { location, talkMapUsers } = Location;
  const { user } = auth;
  const region = { latitude: Number(location.latitude),
                    longitude: Number(location.longitude),
                    latitudeDelta: Number(location.latitudeDelta) || 0.03,
                    longitudeDelta: Number(location.longitudeDelta) || 0.03,
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
