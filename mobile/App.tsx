import React  from 'react';
import {Header} from 'react-native-elements';
import HomeDropdown from './src/components/HomeDropdown';
import LoginIcon from './src/components/LoginIcon';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomePage} from '../BudgetMobileClient/src/components/pages/HomePage';
import {UncategorizedItemsPage} from '../BudgetMobileClient/src/components/pages/UncategorizedItemsPage';
import {FindMonthPage} from '../BudgetMobileClient/src/components/pages/FindMonthPage';
import {YtdStatsPage} from '../BudgetMobileClient/src/components/pages/YtdStatsPage';
import {SettingsPage} from '../BudgetMobileClient/src/components/pages/SettingsPage';
import {navigationRef} from './src/navigation/RootNavigation';
import {LoginPage} from './src/components/pages/LoginPage';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Header
          leftComponent={<HomeDropdown />}
          centerComponent={{text: 'Budget Mobile', style: {color: '#fff'}}}
          rightComponent={<LoginIcon />}
        />
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{title: 'Home Page'}}
          />
          <Stack.Screen
            name="UncategorizedItemsPage"
            component={UncategorizedItemsPage}
          />
          <Stack.Screen name="FindMonthPage" component={FindMonthPage} />
          <Stack.Screen name="YtdStatsPage" component={YtdStatsPage} />
          <Stack.Screen name="SettingsPage" component={SettingsPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </>
  );
};
export default App;
