import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Segment from 'expo-analytics-segment';

import { signUp } from '../../services/CTAuthServerService';
import { saveSession } from '../../services/LocalStorageService';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import styles from './styles';

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const signUpWithEmail = async () => {
    setLoading(true);
    setError('');
    const response = await signUp(email, password);
    if (response.ok) {
      saveSession(response.data);
      dispatch(actionCreators.setSession(response.data));
    } else {
      setError(response.data.reason);
    }
    setLoading(false);
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
            Contact Tracing
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
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={signUpWithEmail}>
              <Text
                style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
              >
                Crear Cuenta
              </Text>
            </TouchableOpacity>
            <View style={{ margin: 10 }}>
              <Text
                style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
                onPress={() => navigation.navigate('LoginScreen')}
              >
                Ya tienes cuenta?
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default SignUpScreen;
