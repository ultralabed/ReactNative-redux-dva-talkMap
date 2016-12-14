import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { createMessage, updateUserLatestMessage } from '../services/firebase';

export default {
  namespace: 'Messages',
  state: {
    allMessages: {},
    message: '',
  },
  subscriptions: {
    initFetchAllMessages({ dispatch }) {
      firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {

          firebase.database().ref(`/messages`)
          .on('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
              dispatch({ type: 'updateAllMessages', payload: val });
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
  },
  reducers: {
    updateAllMessages(state, { payload }) {
      console.log(payload)
      return { ...state, allMessages: payload };
    },
    messageText(state, { payload }) {

      return { ...state, message: payload };
    },
  },
}
