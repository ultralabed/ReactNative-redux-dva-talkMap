import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'dva/mobile';
import { InputItem, WhiteSpace, List, ListView, Flex } from 'antd-mobile';

class PrivateMessageScreen extends Component {
  componentWillMount() {
    this.createDataSource(this.props);

    const { dispatch, conversationKey } = this.props;
    firebase.database().ref(`/conversations/${conversationKey}`)
    .on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        dispatch({ type: 'Messages/updateConversations', payload: val });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be render with
    //this.props is still the old set of props

    this.createDataSource(nextProps);
  }

  createDataSource({ conversations }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(conversations);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'Messages/updateConversationKey', payload: '' });
    dispatch({ type: 'Messages/updateConversations', payload: {} });
    dispatch({ type: 'Messages/updateConversationFromTo', payload: { from: '', to: '' } });
  }


  renderRow(data) {
    const { talkMapUsers, user, to } = this.props;
    const { messageMe, messageOther } = styles;
    return (
      data.from === user.uid ?
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
              <Text style={messageOther}>{ _.capitalize(talkMapUsers[to].email.split('@')[0]) } : {data.message}</Text>
            </View>
            <WhiteSpace />
          </Flex>
          <WhiteSpace />
        </View>
      )
    );
  }

  render() {
    const { listView } = styles;
    const { message, dispatch, conversationKey, from, to } = this.props;

    return (
      <View style={listView}>
        <ListView
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
            labelNumber={7}
            error
            onErrorPress={() => message ? dispatch({ type: 'Messages/addPrivateMessages', payload: { message, conversationKey, from, to } }) : null}
            >
          </InputItem>
        </List>
      </View>
    );
  }
};

const styles = {
  listView: {
     height: Dimensions.get('window').height - 66,
  },
  messageMe: {
    marginRight: 8,
    marginLeft: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    borderWidth : 2,
    overflow: 'hidden',
    borderColor: '#4080ff',
    backgroundColor: '#4080ff',
    fontSize: 20,
  },
  messageOther: {
    marginRight: 8,
    marginLeft: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    borderWidth : 2,
    overflow: 'hidden',
    borderColor: '#f1f0f0',
    backgroundColor: '#f1f0f0',
    fontSize: 20,
  },
}

const mapStateToProps = ({ Messages, Location, auth }) => {
  const { conversationKey, message, from, to } = Messages;
  const { talkMapUsers } = Location;
  const { user } = auth;
  let conversations = {};
  if (!_.isEmpty(Messages.conversations)) {
    conversations = _.map(Messages.conversations, (val, uid) => {
      let time = moment.unix(val.time / 1000).fromNow();
      return { ...val, uid, time };
    });
  }

  return {
    conversationKey,
    conversations,
    message,
    from,
    to,
    talkMapUsers,
    user,
  }
}
export default connect(mapStateToProps)(PrivateMessageScreen);
