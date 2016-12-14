import firebase from 'firebase';
import moment from 'moment';

export function updateLocation({ latitude, longitude }) {
  const { currentUser } = firebase.auth();
  let timeNow = new moment().format('x');
  firebase.database().ref(`/talkMapUsers/${currentUser.uid}`)
    .update({ latitude, longitude, latestLocation: timeNow , email: currentUser.email });
}

export function createMessage({ message }) {
  const { currentUser } = firebase.auth();
  let timeNow = new moment().format('x');
  firebase.database().ref(`/messages`)
    .push({ message, userId: currentUser.uid, email: currentUser.email, to: 'all', time: timeNow });

}

export function updateUserLatestMessage({ message }) {
  const { currentUser } = firebase.auth();
  firebase.database().ref(`/talkMapUsers/${currentUser.uid}`)
    .update({ message: message })
}
