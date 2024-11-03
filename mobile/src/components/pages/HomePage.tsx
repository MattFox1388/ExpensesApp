import axios from 'axios';
import React, { useCallback, useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { readFile } from '../../shared/CsvToJsonUtility';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { handleAxiosError } from '../../shared/AxiosErrorUtility';
import { useUsersContext } from '../../contexts/UsersContext';

interface IngestRequest {
  rows: Array<any>;
  username: string | null;

}

export const HomePage: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const {state: usersState, dispatch: usersDispatch} = useUsersContext();

  const onIngestEduCheckingPress = useCallback(async () => {
    console.log('starting checking processing...')
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: ["text/csv"] 
      });
      
      const path = getUri(response)
      setShowSpinner(true);
      const json = await readFile(path, false);
      const requestData: IngestRequest = {rows: json, username: usersState.username};
      const token = await AsyncStorage.getItem('login_token');
      const amountProcessed = await axios.post(process.env.EXPO_PUBLIC_BUDGET_API_URL + `/edu-checking-data`, requestData, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` 
        }
      });
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
    setShowSpinner(false)
  }, [usersState]);

  const getUri = (response: any) => {
    console.log(response.assets)
      const assetsList = response.assets ?? []
      const assetsSize = response?.assets?.length ?? 0
      if(!assetsList[assetsSize - 1].uri ) {
        throw Error("The processing failed at getting uri.")
      }
      return assetsList[assetsSize - 1].uri
  }

  const onIngestEduSavingPress = useCallback(async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: ["text/csv"] 
      });
      const path = getUri(response)
      setShowSpinner(true);
      const json = await readFile(path, false);
      const requestData: IngestRequest = {rows: json, username: usersState.username};
      const token = await AsyncStorage.getItem('login_token');
      const amountProcessed = await axios.post(process.env.EXPO_PUBLIC_BUDGET_API_URL + `/edu-savings-data`, 
        requestData, {
          timeout: 10000,
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
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
  }, [usersState]);    

  const onIngestDiscPress = useCallback(async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: ["text/csv"] 
      });
      const path = getUri(response)
      setShowSpinner(true);
      const json = await readFile(path, true);
      const requestData: IngestRequest = {rows: json, username: usersState.username};
      const token = await AsyncStorage.getItem('login_token');
      const amountProcessed = await axios.post(process.env.EXPO_PUBLIC_BUDGET_API_URL + `/discover-data`,
        requestData, {
          timeout: 10000,
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
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

  }, [usersState]); 


  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.ingestContainer}>
        <View style={styles.ingestRow}>
          <Text style={styles.labelText}>Ingest Edu Checking: </Text>
          <View >
            <TouchableOpacity  style={styles.buttonStyle} onPress={onIngestEduCheckingPress}>
              <Text>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ingestRow}>
          <Text style={styles.labelText}>Ingest Edu Savings: </Text>
          <TouchableOpacity style={styles.buttonStyle} onPress={onIngestEduSavingPress}>
            <Text>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ingestRow}>
          <Text style={styles.labelText}>Ingest Discover: </Text>
          <TouchableOpacity style={styles.buttonStyle} onPress={onIngestDiscPress}>
            <Text>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 6}}>
        {showSpinner && <ActivityIndicator size="large" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ingestContainer: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  ingestRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelText: {
    flex: 2,
    color: 'black',
    alignSelf: 'center'
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    alignSelf:'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#24a0ed',
    marginLeft: 10,
  },
});
