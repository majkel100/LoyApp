import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { signIn } from '@/services/synerise';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { fonts, gutters, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Main }],
      });
    } catch (error) {
      Alert.alert('Błąd logowania', 'Nieprawidłowy email lub hasło. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate(Paths.Register);
  };

  return (
    <SafeScreen>
      <View style={[gutters.paddingHorizontal_32, gutters.paddingVertical_24, styles.container]}>
        <Text style={[fonts.size_32, fonts.bold, styles.title]}>
          Logowanie
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={[fonts.size_16, fonts.bold, styles.inputLabel, { color: colors.gray800 }]}>
              E-mail
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: colors.gray400,
                  backgroundColor: '#FFFFFF',
                  color: colors.gray800
                }
              ]}
              placeholder="Wprowadź adres e-mail"
              placeholderTextColor={colors.gray400}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[fonts.size_16, fonts.bold, styles.inputLabel, { color: colors.gray800 }]}>
              Hasło
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: colors.gray400,
                  backgroundColor: '#FFFFFF',
                  color: colors.gray800
                }
              ]}
              placeholder="Wprowadź hasło"
              placeholderTextColor={colors.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.purple500 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[fonts.size_16, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                Zaloguj
              </Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={[fonts.size_16, { color: colors.gray800 }]}>
              Nie masz jeszcze konta?
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={[fonts.size_16, { color: colors.purple500, marginLeft: 5, fontWeight: 'bold' }]}>
                Zarejestruj się
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
    marginTop: 40,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  }
});

export default Login; 