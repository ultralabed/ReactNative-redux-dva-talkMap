import _ from 'lodash';
import moment from 'moment';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { createMessage, updateUserLatestMessage, createConversationMap, createPrivateMessage } from '../services/firebase';

export default {
  namespace: 'Messages',
  state: {
    allMessages: {},
    message: '',
    conversationMap: {},
    conversationKey: '',
    conversations: {},
    from: '',
    to: ''
  },
  subscriptions: {
    initFetchAllMessages({ dispatch }) {
      firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {

          firebase.database().ref(`/conversations/public`)
          .on('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
              dispatch({ type: 'updateAllMessages', payload: val });
            }
          });
        }
      });
    },
    initFetchConversationMap({ dispatch }) {
      firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {

          firebase.database().ref(`/conversationMap`)
          .on('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
              dispatch({ type: 'updateConversationMap', payload: val });
            }
          });
        }
      });
    },
  },
  effects: {
    *addPublicMessages({ payload }, { call, put }) {
      yield call(createMessage, { message: payload });
      yield call(updateUserLatestMessage, { message: payload });
      yield put({ type: 'messageText', payload: '' });
    },
    *addPrivateMessages({ payload }, { call, put }) {
      const { message, conversationKey, from, to } = payload;
      const time = new moment().format('x');

      yield call(createPrivateMessage, { message, conversationKey, from, to, time });
      yield put({ type: 'messageText', payload: '' });
    },
    *checkConversationMap({ payload }, { call, put, select }) {
      const { from, to, email } = payload;
      const { conversationMap } = yield select(state => state.Messages);
      let conversationMapArr = yield _.values(_.mapValues(conversationMap, function(value, key) { value.key = key; return value; }));
      let conversation = conversationMapArr.find((conversation) => {
        return _.includes(conversation, from) && _.includes(conversation, to) ?
                conversation
                :
                null;
      });
      if (!conversation) {
        conversation = yield call(createConversationMap, { from, to });
      }
      yield put({ type: 'updateConversationFromTo', payload: { from, to } });
      yield put({ type: 'updateConversationKey', payload: conversation.key });
      Actions.privateMessages({ title: _.capitalize(email.split('@')[0]) });
    },
  },
  reducers: {
    updateAllMessages(state, { payload }) {
      return { ...state, allMessages: payload };
    },
    messageText(state, { payload }) {
      return { ...state, message: payload };
    },
    updateConversationMap(state, { payload }) {
      return { ...state, conversationMap: payload };
    },
    updateConversationKey(state, { payload }) {
      return { ...state, conversationKey: payload };
    },
    updateConversations(state, { payload }) {
      return { ...state, conversations: payload };
    },
    updateConversationFromTo(state, { payload }) {
      const { from, to } = payload;

      return { ...state, from, to };
    }
  },
}
