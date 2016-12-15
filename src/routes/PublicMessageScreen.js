import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, WingBlank, InputItem, WhiteSpace, List, ListView, Flex, NoticeBar } from 'antd-mobile';
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
    const { user } = this.props;
    const { messageMe, messageOther } = styles;
    return (
      data.email === user.email ?
      (
        <View>
          <Flex justify="end" wrap="wrap">
            <Text style={messageMe}>{data.message}</Text>
          </Flex>
          <WhiteSpace />
        </View>
      )
      :
      (
        <View>
          <Flex justify="start">
            <View>
              <Text style={messageOther}>{ _.capitalize(data.email.split('@')[0]) } : {data.message}</Text>
            </View>
            <WhiteSpace />
          </Flex>
          <WhiteSpace />
        </View>
      )
    );
  }

  renderInvertibleScrollView() {
    return (
      <InvertibleScrollView {...this.props} />
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
          renderRow={this.renderRow.bind(this)}
        />
        <List>
          <InputItem
            clear
            value={message}
            type="text"
            onChange={(value) => dispatch({ type: 'Messages/messageText', payload: value })}
            placeholder="Send message here~!"
            error
            onErrorPress={() => message ? dispatch({ type: 'Messages/addPublicMessages', payload: message }) : null}
            >
          </InputItem>
        </List>
      </View>
    );
  }
};

const styles = {
  messageMe: {
    marginLeft: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    borderWidth : 2,
    borderColor: '#4080ff',
    backgroundColor: '#4080ff',
    fontSize: 20,
  },
  messageOther: {
    marginRight: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    borderWidth : 2,
    borderColor: '#f1f0f0',
    backgroundColor: '#f1f0f0',
    fontSize: 20,
  },
}

const mapStateToProps = ({ Messages, auth }) => {
  const { message } = Messages;
  const { user } = auth;
  const allMessages = _.map(Messages.allMessages, (val, uid) => {
    let time = moment.unix(val.time / 1000).fromNow();
    return { ...val, uid, time };
  });
  return {
    allMessages,
    message,
    user,
  };
}
export default connect(mapStateToProps)(PublicMessageScreen);
