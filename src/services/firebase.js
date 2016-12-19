import firebase from 'firebase';
import moment from 'moment';

export function updateLocation({ latitude, longitude }) {
  const { currentUser } = firebase.auth();
  let timeNow = new moment().format('x');
  firebase.database().ref(`/talkMapUsers/${currentUser.uid}`)
    .update({ latitude, longitude, latestLocation: timeNow , email: currentUser.email, status: 'online' });
}

export function createMessage({ message }) {
  const { currentUser } = firebase.auth();
  let timeNow = new moment().format('x');
  firebase.database().ref(`/conversations/public`)
    .push({ message, userId: currentUser.uid, email: currentUser.email, to: 'all', time: timeNow });

}

export function updateUserLatestMessage({ message }) {
  const { currentUser } = firebase.auth();
  let timeNow = new moment().format('x');
  firebase.database().ref(`/talkMapUsers/${currentUser.uid}`)
    .update({ message: message, latestMessage: timeNow })
}

export function createConversationMap({ from, to }) {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/conversationMap`)
    .push({ user1: from, user2: to })
}

export function createPrivateMessage({ message, conversationKey, from, to, time }) {
  firebase.database().ref(`/conversations/${conversationKey}`)
    .push({ message, from, to, time })
}
