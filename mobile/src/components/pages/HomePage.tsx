import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { readFile } from '../../shared/CsvToJsonUtility';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { handleAxiosError } from '../../shared/AxiosErrorUtility';
import { useUsersContext } from '../../contexts/UsersContext';
import { MaterialIcons } from '@expo/vector-icons';

interface IngestRequest {
  rows: Array<any>;
  username: string | null;
}

export const HomePage: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const { state: usersState, dispatch: usersDispatch } = useUsersContext();

  const onIngestPress = useCallback(
    async (type: 'edu-checking' | 'edu-savings' | 'discover') => {
      try {
        const response = await DocumentPicker.getDocumentAsync({ type: ["text/csv"] });
        const path = getUri(response);
        setShowSpinner(true);
        const json = await readFile(path, type === 'discover');
        const requestData: IngestRequest = { rows: json, username: usersState.username };
        const token = await AsyncStorage.getItem('login_token');
        const amountProcessed = await axios.post(
          `${process.env.EXPO_PUBLIC_BUDGET_API_URL}/${type}-data`, 
          requestData, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Ingested ${amountProcessed.data["amount_processed"]} records`,
        });
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error, usersDispatch);
        } else {
          console.error(error);
        }
      }
      setShowSpinner(false);
    }, [usersState]
  );

  const getUri = (response: any) => {
    const assetsList = response.assets ?? [];
    const assetsSize = response?.assets?.length ?? 0;
    if (!assetsList[assetsSize - 1].uri) throw Error("The processing failed at getting uri.");
    return assetsList[assetsSize - 1].uri;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Ingestion</Text>
      <View style={styles.ingestContainer}>
        {['edu-checking', 'edu-savings', 'discover'].map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.card}
            onPress={() => onIngestPress(type as 'edu-checking' | 'edu-savings' | 'discover')}
          >
            <MaterialIcons name="file-upload" size={24} color="white" />
            <Text style={styles.buttonText}>{`Ingest ${type.replace('-', ' ')}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showSpinner && <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  ingestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  card: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#24a0ed',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  spinner: {
    position: 'absolute',
    bottom: 50,
  },
});