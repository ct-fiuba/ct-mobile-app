import * as Facebook from 'expo-facebook';

import { FACEBOOK_APP_ID } from 'react-native-dotenv';
import onSignInFacebook from './FacebookSignInFirebase';

const facebookAppId = FACEBOOK_APP_ID;

const signInWithFacebookAsync = async () => {
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      facebookAppId,
      {
        permissions: ['public_profile', 'email'],
      }
    );

    if (type === 'success') {
      onSignInFacebook(token);
    } else {
      console.log('Error Response');
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
};

export default signInWithFacebookAsync;
