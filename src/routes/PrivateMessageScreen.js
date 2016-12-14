import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';

class PrivateMessageScreen extends Component {
  render(dispatch) {
    return (
      <View>
        <Text>
          private messages
        </Text>
      </View>
    );
  }
};

const mapStateToProps = () => {

  return {};
}
export default connect(mapStateToProps)(PrivateMessageScreen);
