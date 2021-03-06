import React, { useState , Component} from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, NativeModules} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { DatabaseConnection } from '../database/Connection';
import DateTimePicker from '@react-native-community/datetimepicker';

const db = DatabaseConnection.getConnection();

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
function AddScreen({ navigation }) {

  let [title, setTitle] = useState('');
  let [category, setCategory] = useState('');
  let [amount, setAmount] = useState('');
  let [dates, setDates] = useState('');

  let new_bill = () => {
    console.log(title, category, amount, dates);
    if (!title) {
      alert('Please fill in the bill title !');
      return;
    }
    if (!category) {
      alert('Please select the category');
      return;
    }
    if (!amount) {
      alert('Please fill in the amount !');
      return;
    }
    if (!dates) {
      alert('Please fill in the date !');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Bill(Title, Category, Amount, Date) VALUES (?,?,?,?)',
         [title, category, amount, dates],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Successfully Add Bill !!!',
              [
                {
                  text: 'Ok',
                  onPress: () => NativeModules.DevSettings.reload()
                },
              ],
              { cancelable: false }
            );
          } else alert('Error trying to add bill !!!');
        }
      );
    });
  };
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
    console.log(date);
  };


  return (
    <View style={styles.container}>
      <View style={styles.box}>
      <Text style={{ fontWeight: 'bold' }}>Title</Text>
      <TextInput
        style={styles.text} 
        placeholder='Title...'
        onChangeText={(title) => setTitle(title)}
        />
      </View>
      <View style={styles.box}>
      <Text style={{ fontWeight: 'bold' }}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.text}
        onValueChange={(category) => setCategory(category)}
      >
        <Picker.Item label="" value=""/>
        <Picker.Item label="Bills & Utility" value="bills" color="black"/>
        <Picker.Item label="Transport & Travel" value="transport"/>
        <Picker.Item label="Education" value="education"/>
        <Picker.Item label="[Daily] Drink & Dine / Grocery / Shopping" value="daily"/>
        <Picker.Item label="Health & Fitness" value="health"/>
        <Picker.Item label="Personal Care" value="personalcare"/>
        <Picker.Item label="Others" value="others"/>
      </Picker>
      </View>
      <View style={styles.box}>
        <Text style={{ fontWeight: 'bold' }}>MYR</Text>
        <TextInput
          style={styles.text} 
          keyboardType='numeric'
          placeholder='Amount'
          onChangeText={(amount) => setAmount(amount)}
        />
</View>
      <View style={styles.box}>
        <Text style={{ fontWeight: 'bold' }}>Calender</Text>
        <View style={styles.calendar}>
          <Text style={styles.showdate}>{formatDate(date)}</Text>
          <Ionicons
              name={'ios-calendar'} 
              size={30}
              onPress={showDatePicker}

              />
              {show && (<DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
              //onChangeText={(dates) => setDates(dates)}
              />)}
        </View>
      </View>
      <View style={styles.box}>
        <Text style={{ fontWeight: 'bold' }}>Date</Text>
        <TextInput
          style={styles.text} 
          keyboardType='numeric'
          placeholder='Enter date above'
          onChangeText={(dates) => setDates(dates)}
        />
      </View>
      <View style={styles.box}>
          <TouchableOpacity onPress={new_bill}>
              <View style={styles.button} >
                  <Text style={styles.buttonText} >Add bill</Text>
              </View>
          </TouchableOpacity>
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  text: {
    width: 300,
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    paddingVertical:10,
  },

  button: {
    borderRadius: 10,
    paddingVertical: 14,
    width: 200,
    backgroundColor: '#ff9b9b',
  },

  buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 16,
      textAlign: 'center',
  },

  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingVertical: 35,
  },

  showdate: {
    borderBottomWidth: 1,
    width: 280,
    margin: 5,
  },
});

export default AddScreen;