import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, WingBlank, InputItem, WhiteSpace, List, ListView } from 'antd-mobile';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

class PublicMessageScreen extends Component {
  componentWillMount() {
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be render with
    //this.props is still the old set of props

    this.createDataSource(nextProps);
  }

  createDataSource({ allMessages }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(allMessages);
  }

  renderRow(data) {
    const Item = List.Item;
    // extra={data.time}
    return (
      <InputItem
        clear
        value={data.message}
        type="text"
        labelNumber={7}
        editable={false}
        >{data.email}
      </InputItem>
    );
  }

  renderInvertibleScrollView() {
    return (
      <InvertibleScrollView {...this.props} inverted />
    )
  }

  render() {
    const { message, dispatch } = this.props;

    return (
      <View>
        <ListView 
          renderScrollComponent={this.renderInvertibleScrollView}
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={this.renderRow}
        />
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

const mapStateToProps = ({ Messages }) => {
  const { message } = Messages;
  const allMessages = _.map(Messages.allMessages, (val, uid) => {
    let time = moment.unix(val.time / 1000).fromNow();
    return { ...val, uid, time };
  });
  return {
    allMessages,
    message,
  };
}
export default connect(mapStateToProps)(PublicMessageScreen);
