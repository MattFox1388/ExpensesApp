import React, {useRef, useState} from 'react';
import { Dropdown } from 'react-native-material-dropdown-no-proptypes';
import Icon from 'react-native-vector-icons/Octicons';
import { AntDesign } from '@expo/vector-icons';
import * as RootNavigation from '../navigation/RootNavigation';


const HomeDropdown: React.FC = () => {
    const dropdownRef = useRef(null);
    const data = [{
        value: 'Uncategorized Items',
      },  {
        value: 'Find Month',
      }, {
        value: 'YTD stats',
      }, {
        value: 'Settings',
      }];

    const onChangeText = (value: string) => {
      console.log('dropdown pressed...');
      // route to correct page
      switch(value) {
        case "Uncategorized Items": {
          RootNavigation.navigate("UncategorizedItemsPage", {});
          break;
        }
        case "Find Month": {
          RootNavigation.navigate("FindMonthPage", {});
          break;
        }
        case "YTD stats": {
          RootNavigation.navigate("YtdStatsPage", {});
          break;
        }
        case "Settings": {
          RootNavigation.navigate("SettingsPage", {});
          break;
        }
        default: {
          break;
        }
      }
    };

    return (
      <>
        <Dropdown
          ref = {dropdownRef}
          containerStyle={{width: 160, height: 50, marginTop: 15}}
          dropdownPosition={0}
          data={data}
          onChangeText={onChangeText}
          renderBase={() => <AntDesign name="home" size={24} color="black" />}
        />
      </>
      
      );
};

export default HomeDropdown;