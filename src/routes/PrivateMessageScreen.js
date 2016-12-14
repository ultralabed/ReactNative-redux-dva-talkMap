import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, WingBlank, InputItem, WhiteSpace, List, ListView } from 'antd-mobile';

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

    return (
      <InputItem
        clear
        value={data.message}
        type="text"
        labelNumber={7}
        editable={false}
        >{data.from === user.uid ? 'Me' : _.capitalize(talkMapUsers[to].email.split('@')[0])}
      </InputItem>
    );
  }

  render() {
    const { message, dispatch, conversationKey, from, to } = this.props;

    return (
      <View>
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
            placeholder="Type here~!"
            labelNumber={7}
            error
            onErrorPress={() => message ? dispatch({ type: 'Messages/addPrivateMessages', payload: { message, conversationKey, from, to } }) : null}
            >Message
          </InputItem>
        </List>
      </View>
    );
  }
};

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
