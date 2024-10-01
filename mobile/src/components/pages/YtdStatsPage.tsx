import React, {useState} from 'react';
import {Button, Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';

//TODO: query the stats from year if valid
//TODO: sum up values and leftover
//TODO: display data
export const YtdStatsPage: React.FC = () => {
  const [text, setText] = useState('');

  const handleChangeText = (inputText: React.SetStateAction<string>) => {
    setText(inputText);
  };

  const handlePressButton = () => {
    console.log(`Button pressed with input value: ${text}`);
  };

  const screenWidth = Dimensions.get('window').width;
  const inputWidth = screenWidth * 0.3;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter year:</Text>
      <TextInput
        style={[styles.textInput, {width: inputWidth}]}
        onChangeText={handleChangeText}
        value={text}
      />
      <View style={[styles.buttonContainer]}>
        <Button title="Submit" onPress={handlePressButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    height: 34,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 5,
    marginTop: 5,
    color: 'black'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
    marginTop: 12,
    color: 'black'
  },
  buttonContainer: {
    flex: 0.8,
    marginLeft: 15,
    marginTop: 5,
  },
});
