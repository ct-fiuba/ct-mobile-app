import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import signInWithGoogleAsync from '../../utils/SignInWithGoogle';
import signInWithFacebookAsync from '../../utils/SignInWithFacebook';
import API from '../../config/firebase';

import styles from './styles';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    await API.auth()
      .signInWithEmailAndPassword(email, password)
      .then()
      .catch(e => {
        const errorCode = e.code;
        const errorMessage = e.message;
        if (errorCode === 'auth/weak-password') {
          setError('Weak Password!');
        } else {
          setError(errorMessage);
        }
        setLoading(false);
      });
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={styles.center}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: 'gray' }}>
            App Name
          </Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#B1B1B1"
              returnKeyType="done"
              textContentType="newPassword"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {renderLoading()}
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: 'red',
              width: '80%',
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={{ width: '86%', marginTop: 10 }}
            onPress={signInWithEmail}
          >
            <Text>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '86%', marginTop: 10 }}
            onPress={signInWithFacebookAsync}
          >
            <View style={styles.button}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: '#FFFFFF',
                }}
              >
                Continue with Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '86%', marginTop: 10 }}
            onPress={signInWithGoogleAsync}
          >
            <View style={styles.googleButton}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: '#707070',
                }}
              >
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <Text
              style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
              onPress={() => {
                navigation.navigate('SignUpScreen');
              }}
            >
              Don't have an Account?
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default LoginScreen;
