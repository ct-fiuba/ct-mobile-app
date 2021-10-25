import { Alert } from 'react-native';

export const openAlert = message => {
  Alert.alert(
    'Error',
    message,
    [
      {
        text: 'Ok',
      },
    ],
    { cancelable: false }
  );
};
