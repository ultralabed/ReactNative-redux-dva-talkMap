import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export default {
  namespace: 'Location',
  state: {
    location: { latitude: '', longitude: '' },
  },
  subscriptions: {
  },
  effects: {
    *updateUserLocation({ payload }, { call, put }) {
      const { latitude, longitude } = payload;
      yield put({ type: 'updateLocation', payload: { latitude, longitude } });
    }
  },
  reducers: {
    updateLocation(state, { payload }) {
      const { latitude, longitude } = payload;

      return { ...state, location: { latitude, longitude } };
    },
  },
}
