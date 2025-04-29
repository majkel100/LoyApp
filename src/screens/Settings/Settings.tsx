import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { useI18n } from '@/hooks';
import i18next from 'i18next';
import { SupportedLanguages } from '@/hooks/language/schema';
import { signOut, getDocument } from '@/services/synerise';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

function Settings({ navigation }: RootScreenProps<Paths.Settings>) {
  const { fonts, gutters, colors } = useTheme();
  const { toggleLanguage } = useI18n();
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Aktualizuj stan języka przy zmianie
  useEffect(() => {
    const updateLanguage = () => {
      setCurrentLanguage(i18next.language);
    };
    
    i18next.on('languageChanged', updateLanguage);
    
    return () => {
      i18next.off('languageChanged', updateLanguage);
    };
  }, []);

  // Pobieranie kodu polecającego przy montowaniu komponentu
  useEffect(() => {
    fetchReferralCode();
  }, []);

  // Resetowanie stanu skopiowania po 3 sekundach
  useEffect(() => {
    if (codeCopied) {
      const timer = setTimeout(() => {
        setCodeCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [codeCopied]);

  // Funkcja do pobierania kodu polecającego
  const fetchReferralCode = async () => {
    try {
      setIsLoadingReferralCode(true);
      const document = await getDocument('referral-code');
      if (document && document.content && document.content.referralCode) {
        setReferralCode(document.content.referralCode);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania kodu polecającego:', error);
      setReferralCode(null);
    } finally {
      setIsLoadingReferralCode(false);
    }
  };

  // Funkcja do kopiowania kodu polecającego
  const copyReferralCode = () => {
    if (referralCode) {
      Clipboard.setString(referralCode);
      setCodeCopied(true);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Login }],
      });
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się wylogować. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[gutters.paddingHorizontal_32, gutters.paddingVertical_24]}>
          <Text style={[fonts.size_32, fonts.bold, styles.title]}>
            Ustawienia
          </Text>

          <View style={styles.section}>
            <Text style={[fonts.size_16, fonts.bold, styles.sectionTitle]}>
              Twój kod polecający
            </Text>
            
            {isLoadingReferralCode ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.purple500} />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.referralCodeContainer}
                onPress={copyReferralCode}
                disabled={!referralCode}
              >
                {referralCode ? (
                  <>
                    <Text style={[fonts.size_24, fonts.bold, { color: colors.purple500, textAlign: 'center' }]}>
                      {referralCode}
                    </Text>
                    <Text style={[fonts.size_12, { color: colors.gray400, marginTop: 8 }]}>
                      {codeCopied ? 'Skopiowano!' : 'Dotknij, aby skopiować'}
                    </Text>
                  </>
                ) : (
                  <Text style={[fonts.size_16, { color: colors.gray400, textAlign: 'center' }]}>
                    Nie znaleziono kodu polecającego
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[fonts.size_16, fonts.bold, styles.sectionTitle]}>
              Język aplikacji
            </Text>
            
            <View style={styles.settingRow}>
              <Text style={[fonts.size_16]}>Polski</Text>
              <Switch
                value={currentLanguage === SupportedLanguages.FR_FR}
                onValueChange={() => {
                  if (currentLanguage !== SupportedLanguages.FR_FR) toggleLanguage();
                }}
                trackColor={{ false: colors.gray200, true: colors.purple500 }}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={[fonts.size_16]}>Angielski</Text>
              <Switch
                value={currentLanguage === SupportedLanguages.EN_EN}
                onValueChange={() => {
                  if (currentLanguage !== SupportedLanguages.EN_EN) toggleLanguage();
                }}
                trackColor={{ false: colors.gray200, true: colors.purple500 }}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[fonts.size_16, fonts.bold, styles.sectionTitle]}>
              Powiadomienia
            </Text>
            
            <View style={styles.settingRow}>
              <Text style={[fonts.size_16]}>Powiadomienia o promocjach</Text>
              <Switch
                trackColor={{ false: colors.gray200, true: colors.purple500 }}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={[fonts.size_16]}>Powiadomienia o punktach</Text>
              <Switch
                trackColor={{ false: colors.gray200, true: colors.purple500 }}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.purple500 }]}
              onPress={handleLogout}
              disabled={loading}
            >
              <Text style={[fonts.size_16, { color: '#FFFFFF' }]}>
                Wyloguj
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  referralCodeContainer: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings; 