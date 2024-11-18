import React from 'react';
import { Header } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import HomeDropdown from './src/components/HomeDropdown';
import LoginIcon from './src/components/LoginIcon';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from '../mobile/src/components/pages/HomePage';
import { UncategorizedItemsPage } from '../mobile/src/components/pages/UncategorizedItemsPage';
import { FindMonthPage } from '../mobile/src/components/pages/FindMonthPage';
import { YtdStatsPage } from '../mobile/src/components/pages/YtdStatsPage';
import { SettingsPage } from '../mobile/src/components/pages/SettingsPage';
import { navigationRef } from './src/navigation/RootNavigation';
import { LoginPage } from './src/components/pages/LoginPage';
import Toast from 'react-native-toast-message';
import { CreateUserPage } from './src/components/pages/CreateUserPage';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Header
          leftComponent={<View style={styles.leftRightComponent}><HomeDropdown /></View>}
          centerComponent={
            <View style={styles.centerComponent}>
              <Ionicons name="wallet-outline" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.title}>Budget Mobile</Text>
            </View>
          }
          rightComponent={<View style={styles.leftRightComponent}><LoginIcon /></View>}
          containerStyle={{ paddingTop: 0, height: 80, borderBottomWidth: 0 }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#4c669f', '#3b5998', '#192f6a'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
          }}
        />
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen name="HomePage" component={HomePage} options={{ title: 'Home Page' }} />
          <Stack.Screen name="UncategorizedItemsPage" component={UncategorizedItemsPage} />
          <Stack.Screen name="FindMonthPage" component={FindMonthPage} />
          <Stack.Screen name="YtdStatsPage" component={YtdStatsPage} />
          <Stack.Screen name="SettingsPage" component={SettingsPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="CreateUserPage" component={CreateUserPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  leftRightComponent: {
    justifyContent: 'center',
    height: '100%',
  },
  centerComponent: {
    flexDirection: 'row',
    justifyContent: 'center',     // Center align horizontally
    alignItems: 'center',         // Center align vertically
    height: '100%',               // Ensure it takes full header height
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },
});