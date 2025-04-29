import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { registerAccount } from '@/services/synerise';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  const { fonts, gutters, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Email i hasło są wymagane');
      return;
    }
    
    // Sprawdzanie poprawności adresu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Błąd', 'Podaj poprawny adres email');
      return;
    }
    
    // Sprawdzanie złożoności hasła
    if (password.length < 6) {
      Alert.alert('Błąd', 'Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    setLoading(true);
    try {
      console.log('Rozpoczynam proces rejestracji...');
      await registerAccount(email, password, firstName, referralCode);
      console.log('Rejestracja zakończona pomyślnie!');
      Alert.alert(
        'Sukces', 
        'Konto zostało utworzone. Możesz się teraz zalogować.', 
        [{ text: 'OK', onPress: () => navigation.navigate(Paths.Login) }]
      );
    } catch (error) {
      console.error('Błąd w komponencie Register:', error);
      let errorMessage = 'Nie udało się utworzyć konta. Spróbuj ponownie.';
      
      // Próba wyświetlenia szczegółów błędu
      if (error) {
        try {
          const errorDetails = JSON.stringify(error);
          console.log('Szczegóły błędu:', errorDetails);
          
          // Jeśli mamy konkretny komunikat błędu, użyj go
          if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = `Błąd: ${(error as {message: string}).message}`;
          }
          
          // Dodatkowa obsługa znanych błędów
          const errorString = String(error);
          if (errorString.includes('already exists')) {
            errorMessage = 'Ten adres email jest już zarejestrowany.';
          }
        } catch (e) {
          console.log('Nie można przekonwertować błędu do JSON');
        }
      }
      
      Alert.alert('Błąd rejestracji', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate(Paths.Login);
  };

  // Funkcja dla kodu polecającego - konwersja na wielkie litery
  const handleReferralCodeChange = (text: string) => {
    setReferralCode(text.toUpperCase());
  };

  return (
    <SafeScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[gutters.paddingHorizontal_32, gutters.paddingVertical_24, styles.container]}>
          <Text style={[fonts.size_32, fonts.bold, styles.title]}>
            Rejestracja
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[fonts.size_16, fonts.bold, styles.inputLabel, { color: colors.gray800 }]}>
                E-mail *
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
                Hasło *
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
                placeholder="Minimum 6 znaków"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[fonts.size_16, fonts.bold, styles.inputLabel, { color: colors.gray800 }]}>
                Imię (opcjonalnie)
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
                placeholder="Wprowadź swoje imię"
                placeholderTextColor={colors.gray400}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[fonts.size_16, fonts.bold, styles.inputLabel, { color: colors.gray800 }]}>
                Kod polecający (opcjonalnie)
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
                placeholder="Wprowadź kod polecający"
                placeholderTextColor={colors.gray400}
                value={referralCode}
                onChangeText={handleReferralCodeChange}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.purple500 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[fonts.size_16, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                  Zarejestruj
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={[fonts.size_16, { color: colors.gray800 }]}>
                Masz już konto?
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={[fonts.size_16, { color: colors.purple500, marginLeft: 5, fontWeight: 'bold' }]}>
                  Zaloguj się
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 30,
  }
});

export default Register; 