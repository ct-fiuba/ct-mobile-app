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

import { signUp } from '../../services/CTAuthServerService';
import { saveSession } from '../../services/LocalStorageService';

import { useDispatch } from '../../contexts/AuthContext';
import { actionCreators } from '../../contexts/AuthContext/reducer';

import styles from './styles';

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [dni, setDNI] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const signUpWithEmail = async () => {
    setError('');
    if (password === repeatPassword) {
      setLoading(true);
      signUp(email, dni, password)
        .then(response => {
          saveSession(response.data);
          dispatch(actionCreators.setSession(response.data));
        })
        .catch(error => setError(error.response.data.reason))
        .finally(() => setLoading(false));
    } else {
      setError('Las contraseñas no coinciden');
    }
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
          <Text style={styles.title}>Contact Tracing</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              returnKeyType="next"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="DNI"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              value={dni}
              onChangeText={setDNI}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B1B1B1"
              returnKeyType="done"
              textContentType="newPassword"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#B1B1B1"
              returnKeyType="done"
              textContentType="newPassword"
              secureTextEntry
              value={repeatPassword}
              onChangeText={setRepeatPassword}
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
              <Text style={styles.button}>Crear Cuenta</Text>
            </TouchableOpacity>
            <View style={{ margin: 10 }}>
              <Text
                style={styles.button}
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
