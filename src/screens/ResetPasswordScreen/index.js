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
  Alert,
} from 'react-native';

import { resetPassword } from '../../services/CTAuthServerService';

import styles from './styles';

function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goToLoginScreen = () => {
    Alert.alert(
      'Reseteo de contraseña',
      'Si existe una cuenta asociada al correo recibirá un email para cambiar la contraseña.',
      [
        {
          text: 'Volver al Login',
          onPress: () => {
            navigation.navigate('LoginScreen');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const resetPasswordWithEmail = async () => {
    setLoading(true);
    setError('');
    resetPassword(email)
      .then(() => {
        goToLoginScreen();
      })
      .catch(error => {
        console.error(error.response);
        setError(error.response.data.reason);
      })
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
          <Text style={styles.title}>Olvide mi contraseña</Text>
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
          <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity
              style={{ margin: 10 }}
              onPress={resetPasswordWithEmail}
            >
              <Text style={styles.button}>Enviar email</Text>
            </TouchableOpacity>
            <View style={{ margin: 10 }}>
              <Text
                style={styles.button}
                onPress={() => {
                  navigation.navigate('LoginScreen');
                }}
              >
                Volver al Login
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;
