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

import { signIn } from '../../services/CTAuthServerService';
import { saveSession } from '../../services/LocalStorageService';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import styles from './styles';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const signInWithEmail = async () => {
    setLoading(true);
    setError('');
    signIn(email, password)
      .then(response => {
        saveSession(response.data);
        dispatch(actionCreators.setSession(response.data));
      })
      .catch(error => setError(error.response.data.reason))
      .finally(() => setLoading(false));
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
              placeholder="Constraseña"
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
            <TouchableOpacity style={{ margin: 10 }} onPress={signInWithEmail}>
              <Text
                style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <View style={{ margin: 10 }}>
              <Text
                style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
                onPress={() => {
                  navigation.navigate('SignUpScreen');
                }}
              >
                Crear cuenta
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default LoginScreen;
