import API from '../config/firebase';

const isUserEqualGoogle = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    const { providerData } = firebaseUser;
    providerData.forEach(data => {
      if (
        data.providerId === API.auth.GoogleAuthProvider.PROVIDER_ID &&
        data.uid === googleUser.getBasicProfile().getId()
      ) {
        return true;
      }
    });
  }
  return false;
};

export default isUserEqualGoogle;
