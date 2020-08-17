import * as firebase from 'firebase';

import API from '../config/firebase';

import isUserEqualFacebook from '../utils/IsUserEqualFacebook';
import isUserEqualGoogle from '../utils/IsUserEqualGoogle';

export const onSignInFacebook = token => {
  if (token) {
    const unsubscribe = API.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      if (!isUserEqualFacebook(token, firebaseUser)) {
        const credential = API.auth.FacebookAuthProvider.credential(token);
        API.auth()
          .signInWithCredential(credential)
          .then(response => {
            if (response.additionalUserInfo.isNewUser) {
              API.database()
                .ref(`users/${response.user.uid}`)
                .set({
                  firstName: response.additionalUserInfo.profile.first_name,
                  lastName: response.additionalUserInfo.profile.last_name,
                  email: response.user.email,
                  phoneNumber: response.user.phoneNumber,
                  profilePicture:
                    response.additionalUserInfo.profile.picture.data.url,
                  createdAt: Date.now(),
                });
            } else {
              API.database()
                .ref(`users/${response.user.uid}`)
                .update({
                  lastLogIn: Date.now(),
                });
            }
          })
          .catch(err => console.log(err));
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  } else {
    API.auth().signOut();
  }
};

export const onSignInGoogle = googleUser => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  const unsubscribe = API.auth().onAuthStateChanged(firebaseUser => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqualGoogle(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );
      // Sign in with credential from the Google user.
      API.auth()
        .signInWithCredential(credential)
        .then(response => {
          if (response.additionalUserInfo.isNewUser) {
            API.database()
              .ref(`users/${response.user.uid}`)
              .set({
                email: response.user.email,
                firstName: response.additionalUserInfo.profile.given_name,
                lastName: response.additionalUserInfo.profile.family_name,
                locale: response.additionalUserInfo.profile.locale,
                profilePicture: response.additionalUserInfo.profile.picture,
                createdAt: Date.now(),
              });
          } else {
            API.database()
              .ref(`users/${response.user.uid}`)
              .update({
                lastLogIn: Date.now(),
              });
          }
        })
        .catch(err => console.log(err));
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
};

export const signOut = () => API.auth().signOut();
