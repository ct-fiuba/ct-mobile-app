import * as Google from 'expo-google-app-auth';

import { IOS_CLIENT_ID } from 'react-native-dotenv';
import { onSignInGoogle } from '../services/FirebaseService';

const iOSClientID = IOS_CLIENT_ID;

const signInWithGoogleAsync = async () => {
  try {
    const result = await Google.logInAsync({
      behavior: 'web',
      iosClientId: iOSClientID,
      scopes: ['profile', 'email'],
    });
    if (result.type === 'success') {
      onSignInGoogle(result);
      return { token: result.accessToken };
    }
    return { cancelled: true };
  } catch (e) {
    console.log(e);
    return { error: true };
  }
};

export default signInWithGoogleAsync;
