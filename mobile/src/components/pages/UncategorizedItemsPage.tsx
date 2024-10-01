import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  convertToTableFormat,
  convertToUncategorizedItem,
  UncategorizedItem,
} from '../../shared/UncategorizedItem';
import * as _ from 'underscore';
import {
  DataTable,
  Button,
  Modal,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { CategoryType } from '../../shared/CategoryEnum';
import { getMonthRecordsUncat, ignoreMonthRecord, setRecordCategories } from '../../services/ApiService';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tableColumns = ['date', 'description', 'amount', 'options'];

export const UncategorizedItemsPage: React.FC = () => {
  const [uncategorizedItems, setUncategorizedItems] = React.useState<
    Array<UncategorizedItem>
  >([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValue, setModalValue] = React.useState(CategoryType.Need);
  const [modalTitle, setModalTitle] = useState('');
  const [modalIndex, setModalIndex] = useState(0);
  
  const setUncategorizedItemsFn = async () => {
      const token = await AsyncStorage.getItem('login_token');
      // get uncategorized items
      setShowSpinner(true);
      try {
       const response = await getMonthRecordsUncat(token ?? '') ;

        const uncategorizedItems: UncategorizedItem[] = response.data[
          'month_records'
        ].map((row: any) => {
          return convertToUncategorizedItem(row);
        });
        setUncategorizedItems(uncategorizedItems);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const axAndroidError = error as AxiosError;
          console.log('axAndroid error: ' + axAndroidError);
        }
      }
      setShowSpinner(false);
    };

  useEffect(() => {
    setUncategorizedItemsFn();
  }, []);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalTitle('Set Category');
    setModalValue(CategoryType.Need);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setModalIndex(0);
    setModalValue(CategoryType.Need);
  };

  const setUncatItem = async (): Promise<any> => {
    const token = await AsyncStorage.getItem('login_token');
    setShowSpinner(true);
    const data = [{
      'cat_id': (modalValue + 1),
      'month_record_id': uncategorizedItems[modalIndex].month_id,
    }];

    try {
      if ((modalValue + 1) != 6)
        await setRecordCategories(token ?? '', data);
      else
        await ignoreMonthRecord(token ?? '', [uncategorizedItems[modalIndex].month_id]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axAndroidError = error as AxiosError;
        console.log('axAndroid error: ' + axAndroidError);
      }
    }
    setShowSpinner(false);
    await setUncategorizedItemsFn();
    closeModal();
  };

  const hideModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>Uncategorized Items</Text>
      <View style={{ flex: 1 }}>
        {showSpinner && <ActivityIndicator size="large" />}
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <RadioButton.Group
              onValueChange={newValue => setModalValue(CategoryType[newValue as keyof typeof CategoryType])}
              value={CategoryType[modalValue]}>
              <View>
                <Text>Need</Text>
                <RadioButton.Android testID={"need-btn"} value={CategoryType[CategoryType.Need]} />
              </View>
              <View>
                <Text>Want</Text>
                <RadioButton.Android testID={"want-btn"} value={CategoryType[CategoryType.Want]} />
              </View>
              <View>
                <Text>Saving</Text>
                <RadioButton.Android testID={"saving-btn"} value={CategoryType[CategoryType.Saving]} />
              </View>
              <View>
                <Text>Income</Text>
                <RadioButton.Android testID={"income-btn"} value={CategoryType[CategoryType.Income]} />
              </View>
              <View>
                <Text>Other</Text>
                <RadioButton.Android testID={"other-btn"} value={CategoryType[CategoryType.Other]} />
              </View>
              <View>
                <Text>Ignore</Text>
                <RadioButton.Android testID={"ignore-btn"} value={CategoryType[CategoryType.Ignore]} />
              </View>
            </RadioButton.Group>
            <Button mode="contained" onPress={() => { setUncatItem(); }}>Submit</Button>
          </View>
        </Modal>
      </Portal>
      <View style={styles.uncatItemsContainer}>
        {uncategorizedItems.length === 0 ? (
          <Text style={styles.dataText}>No Uncategorized Items</Text>
        ) : (
          <ScrollView>
            <Text style={styles.dataText}>Uncategorized Items</Text>
            <DataTable>
              <DataTable.Header>
                {tableColumns.map((column, index) => {
                  return (
                    <DataTable.Title textStyle={styles.dataText} key={index}>
                      {column}
                    </DataTable.Title>
                  );
                })}
              </DataTable.Header>
              {uncategorizedItems.map((row, index) => {
                return (
                  <DataTable.Row key={index} accessible={false}>
                    <DataTable.Cell textStyle={styles.dataText}>
                      {row.date}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataText}>
                      {row.month_description}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.dataText}>
                      {row.amount}
                    </DataTable.Cell>
                    <View style={styles.dataText} accessible={false}>
                      <Button
                        mode="text"
                        testID={"modal-btn-" + index}
                        icon="ballot"
                        accessible={true}
                        onPress={() => openModal(index)}>
                        {' '}
                      </Button>
                    </View>
                  </DataTable.Row>
                );
              })}
            </DataTable>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    flex: 1,
    color: 'black',
    alignSelf: 'flex-start',
    paddingLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  dataText: {
    flex: 1,
    color: 'black',
    alignSelf: 'flex-start',
    paddingLeft: 5,
    fontSize: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncatItemsContainer: {
    flex: 15,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
  },
  head: { height: 40, color: 'black', backgroundColor: '#f1f8ff' },
  tableStyle: { width: '100%' },
  tableText: { color: 'black', fontSize: 10, textAlign: 'center' },
  tableTitle: { marginBottom: 10 },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
