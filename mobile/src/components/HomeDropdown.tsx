import React, { useRef } from 'react';
import { Dropdown } from 'react-native-material-dropdown-no-proptypes';
import { AntDesign } from '@expo/vector-icons';
import * as RootNavigation from '../navigation/RootNavigation';
import { View } from 'react-native';

const DropdownIcon: React.FC<{ dropdownRef: React.RefObject<any> }> = ({ dropdownRef }) => {
  return (
    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 12, padding: 6 }}>
      <AntDesign
        name="home"
        size={24}
        color="white"
        onPress={() => dropdownRef.current && dropdownRef.current.show()} // Show dropdown on icon press
      />
    </View>
  );
};

const HomeDropdown: React.FC = () => {
  const dropdownRef = useRef(null);
  const data = [
    { value: 'Uncategorized Items' },
    { value: 'Find Month' },
    { value: 'YTD stats' },
    { value: 'Settings' },
  ];

  const onChangeText = (value: string) => {
    console.log('dropdown pressed...');
    switch (value) {
      case 'Uncategorized Items':
        RootNavigation.navigate('UncategorizedItemsPage', {});
        break;
      case 'Find Month':
        RootNavigation.navigate('FindMonthPage', {});
        break;
      case 'YTD stats':
        RootNavigation.navigate('YtdStatsPage', {});
        break;
      case 'Settings':
        RootNavigation.navigate('SettingsPage', {});
        break;
      default:
        break;
    }
  };

  return (
    <View>
      <Dropdown
        ref={dropdownRef}
        dropdownPosition={0}
        data={data}
        onChangeText={onChangeText}
        renderBase={() => <DropdownIcon dropdownRef={dropdownRef} />}
        pickerStyle={{ width: '50%' }}  // Increase dropdown width without affecting the icon
      />
    </View>
  );
};

export default HomeDropdown;
