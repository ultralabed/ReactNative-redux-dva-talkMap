import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { updateLocation } from '../services/firebase';

export default {
  namespace: 'Location',
  state: {
    location: { latitude: '', longitude: '' },
    talkMapUsers: { },
  },
  subscriptions: {
    initFetchAllLocations({ dispatch }) {
      firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {
          firebase.database().ref(`/talkMapUsers`)
            .on('value', (snapshot) => {
              const val = snapshot.val();
              if (val) {
                dispatch({ type: 'fetchAllUserLocations', payload: val });
              }
            });
        }
      });
    },
  },
  effects: {
    *updateUserLocation({ payload }, { call, put }) {
      const { latitude, longitude } = payload;
      yield call(updateLocation, { latitude, longitude });
      yield put({ type: 'updateLocation', payload: { latitude, longitude } });
    },
  },
  reducers: {
    updateLocation(state, { payload }) {
      const { latitude, longitude } = payload;

      return { ...state, location: { latitude, longitude } };
    },
    fetchAllUserLocations(state, { payload }) {
      return { ...state, talkMapUsers: payload };
    },
  },
}
