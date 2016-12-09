import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';

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

  render(dispatch) {
    return (
      <View>
        <Text>this is talkMapScreen Main page.</Text>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          latitude is {this.props.location.latitude}
          longitude is {this.props.location.longitude}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          latitude is {this.props.location.latitude}
          longitude is {this.props.location.longitude}
        </Text>
      </View>
    );
  }
};

const styles = {
  title: {
    fontWeight: '500',
  },
};

const mapStateToProps = ({ Location }) => {
  const { location } = Location;

  return {
    location,
  };
}
export default connect(mapStateToProps)(TalkMapScreen);
