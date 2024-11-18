import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  DataTable,
  Button,
  Modal,
  Portal,
  RadioButton,
  Tooltip,
} from 'react-native-paper';
import {
  getMonthRecordsUncat,
  ignoreMonthRecord,
  setRecordCategories,
} from '../../services/CategoriesService';
import { useUsersContext } from '../../contexts/UsersContext';
import { CategoryType } from '../../shared/CategoryEnum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleAxiosError } from '../../shared/AxiosErrorUtility';
import { convertToUncategorizedItem, UncategorizedItem } from '../../shared/UncategorizedItem';
import axios, { AxiosError } from 'axios';

interface ErrorState {
  isError: boolean;
  title: string;
  description: string;
}

const { width } = Dimensions.get('window');

export const UncategorizedItemsPage: React.FC = () => {
  const [uncategorizedItems, setUncategorizedItems] = useState<UncategorizedItem[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValue, setModalValue] = useState<Number>(CategoryType.Need);
  const [modalTitle, setModalTitle] = useState('Set Category');
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const { state: usersState, dispatch: usersDispatch } = useUsersContext();

  const fetchUncategorizedItems = async () => {
    setShowSpinner(true);
    const token = await AsyncStorage.getItem('login_token');
    try {
      const response = await getMonthRecordsUncat(token ?? '', usersState.username!);
      setUncategorizedItems(response.data.month_records.map(convertToUncategorizedItem));
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.message : "Unexpected error";
      handleAxiosError(err as AxiosError<unknown, any>, usersDispatch);
      Toast.show({ type: 'error', text1: 'Error Loading Items', text2: message });
    }
    setShowSpinner(false);
  };

  useEffect(() => {
    fetchUncategorizedItems();
  }, []);

  const handleCategorySet = async () => {
    if (modalIndex === null) return;
    setShowSpinner(true);
    const token = await AsyncStorage.getItem('login_token');
    const selectedItem = uncategorizedItems[modalIndex];
    const categoryData = [{ cat_id: modalValue.toString(), month_record_id: selectedItem.month_id }];

    try {
      await (modalValue === CategoryType.Ignore
        ? ignoreMonthRecord(token ?? '', [selectedItem.month_id])
        : setRecordCategories(token ?? '', categoryData, usersState.username!)
      );
      await fetchUncategorizedItems();
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.message : "Unexpected error";
      handleAxiosError(err as AxiosError<unknown, any>, usersDispatch);
      Toast.show({ type: 'error', text1: 'Error Setting Category', text2: message });
    }
    setShowSpinner(false);
    closeModal();
  };

  const radioButtonGroupChange = (newValue: string) => {
    setModalValue(Number.parseInt(newValue));
  }

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Uncategorized Items</Text>
      {showSpinner && <ActivityIndicator size="large" style={styles.spinner} />}
      <Portal>
        <Modal visible={modalVisible} onDismiss={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <RadioButton.Group
              onValueChange={(newValue) => radioButtonGroupChange(newValue)}
              value={modalValue.toString()}
            >
              {Object.keys(CategoryType)
                .filter(key => isNaN(Number(key)))
                .map((key) => (
                  <View key={key} style={styles.radioButtonRow}>
                    <Text>{key}</Text>
                    <RadioButton value={CategoryType[key as keyof typeof CategoryType].toString()} />
                  </View>
                ))}
            </RadioButton.Group>
            <Button mode="contained" onPress={handleCategorySet}>Submit</Button>
          </View>
        </Modal>
      </Portal>
      <ScrollView style={styles.scrollContainer}>
        {uncategorizedItems.length === 0 ? (
          <Text style={styles.noItemsText}>No Uncategorized Items</Text>
        ) : (
          <DataTable>
            <DataTable.Header>
              {['Date', 'Description', 'Amount', 'Options'].map((header, index) => (
                <DataTable.Title key={index} textStyle={styles.tableHeader}>{header}</DataTable.Title>
              ))}
            </DataTable.Header>
            {uncategorizedItems.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell> 
                  <Tooltip title={item.date} enterTouchDelay={0} leaveTouchDelay={500}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cellText}>
                      {item.date}
                    </Text>
                  </Tooltip>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Tooltip title={item.month_description} enterTouchDelay={0} leaveTouchDelay={500}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cellText}>
                      {item.month_description}
                    </Text>
                  </Tooltip>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Tooltip title={"$" + item.amount.toString()} enterTouchDelay={0} leaveTouchDelay={500}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cellText}>
                      ${item.amount}
                    </Text>
                  </Tooltip>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button mode="text" icon="ballot" onPress={() => openModal(index)}>Set</Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  spinner: { marginVertical: 20 },
  scrollContainer: { flex: 1 },
  noItemsText: { textAlign: 'center', fontSize: 16, marginTop: 20 },
  tableHeader: { fontWeight: 'bold' },
  modalContent: { padding: 20, backgroundColor: 'white', borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  radioButtonRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cellText: { fontSize: 14, width: width * 0.2 }, // Adjust width as needed

});
