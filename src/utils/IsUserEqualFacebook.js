import API from '../config/firebase';

const isUserEqualFacebook = (facebookAuthResponse, firebaseUser) => {
  if (firebaseUser) {
    const { providerData } = firebaseUser;
    providerData.forEach(data => {
      if (
        data.providerId === API.auth.FacebookAuthProvider.PROVIDER_ID &&
        data.uid === facebookAuthResponse.userID
      ) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    });
  }
  return false;
};

export default isUserEqualFacebook;
