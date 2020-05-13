/*Screen to register the prescription*/
/**
 * Scan page
 * some code was adapted from the library github example https://github.com/whitedogg13/react-native-nfc-manager
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, KeyboardAvoidingView, Alert } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import base64 from 'react-native-base64';
import {zip_deflate} from '../rawdeflate.js'
import {zip_inflate} from '../rawinflate.js'
import NotifService from './NotifService';


var db = openDatabase({ name: 'Med.db' });

export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: '',
    };
    this.notif = new NotifService(this.onNotif.bind(this));
  }

  componentDidMount() {
    try{
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.log(" ");
      console.log("Starting to read NFC...");
      try {
      var charPayload = tag.ndefMessage[0].payload.slice(3);
      }
      catch {
        console.log("Error Reading NFC");
        alert("Error scanning, please try again.");
        return;
      }
      // console.log("read " + charPayload);
      var message = ''
      charPayload.forEach(function (item) {
        message = message + String.fromCharCode(parseInt(item));
      })

      this.setState({
        payload: this.decode(message)
      })

      NfcManager.setAlertMessageIOS('I got your tag!');
      NfcManager.unregisterTagEvent().catch(() => 0);
      
      this.register_prescription();

    });
  } catch{
    console.log("ERROR READING", err);
    alert("Error scanning, please try again.");
  }
    this._test();
  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _cancel = () => {
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _test = async () => {
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      alert("Error reading tag. Please try again.");
      console.warn('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  }

  decode(str) {
    return decodeURIComponent(escape(zip_inflate(base64.decode(str))));
  }

  setNotifications(id)
  {
    console.log("setNotifications: ", id);
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_med where entry_id=?', [id], (tx, results) => {
        var entry = results.rows.item(0);
        // console.log(entry);

        var date  = new Date();
        var med_hour = date.getHours() + 24;
        var med_minute = date.getMinutes();
        var med_repeat = 24;

        var num = /\d+/;
        var num_hours = /every \d+ hour/;
        var num_times = /\d+ time/;
        var frequency = String(entry.freq).toLowerCase();

        var numHourMatch = frequency.match(num_hours);
        var numTimesMatch = frequency.match(num_times);
        var med_freq = 0;
        if (numHourMatch == null)
        {
          if (numTimesMatch != null)
          {
            med_freq = parseInt(numTimesMatch[0].match(num)[0]);
          }
          if (frequency.includes("once") || med_freq == 1)
          {
            this.notif.scheduleNotif(entry, med_hour, med_minute, med_repeat)
          }
          else if (frequency.includes("twice") || med_freq == 2)
          {
            this.notif.scheduleNotif(entry, 9, 0, med_repeat)
            this.notif.scheduleNotif(entry, 21, 0, med_repeat)
          }
          else if (frequency.includes("three") || med_freq == 3)
          {
            this.notif.scheduleNotif(entry, 9, 0, med_repeat)
            this.notif.scheduleNotif(entry, 14, 0, med_repeat)
            this.notif.scheduleNotif(entry, 21, 0, med_repeat)
          }
          else if (frequency.includes("four") || med_freq == 4)
          {
            this.notif.scheduleNotif(entry, 9, 0, med_repeat)
            this.notif.scheduleNotif(entry, 13, 0, med_repeat)
            this.notif.scheduleNotif(entry, 17, 0, med_repeat)
            this.notif.scheduleNotif(entry, 21, 0, med_repeat)
          }
        }
        else {
          var med_every = parseInt(numHourMatch[0].match(num)[0]);
          med_freq = 24/med_every;
          var i;
          var j = 0;
          for (i=0; i < med_freq; i++)
          {
            this.notif.scheduleNotif(entry, (8 + j), 0, med_repeat);
            j += med_every;
          }
        }
        console.log("Scheduled Notifications!");
        // var med_repeat = parseInt(String(entry.freq).split(" ")[1]);
        
        //this.notif.scheduleNotif(entry, med_hour, med_minute, med_repeat)
      });
    });
  }

  onNotif(notif) {
    console.log(notif);
    //Alert.alert(notif.title, notif.message);
  }




  register_prescription = () => {
    var that = this;

    const { payload } = this.state;
    var json_pay = JSON.parse(payload)

    console.log("Successfully Read. Registering prescription...");
    try{
          db.transaction(function(tx) {
            //alert(json_pay["4"]);
            tx.executeSql(
              'INSERT OR IGNORE INTO table_med (patient_name, patient_addr, dob, med_name, dose, root, type, instructions, freq) VALUES (?,?,?,?,?,?,?,?,?)',
              [String(json_pay["1"]),String(json_pay["2"]),String(json_pay["3"]),String(json_pay["4"]),
              String(json_pay["5"]),String(json_pay["6"]),String(json_pay["7"]),String(json_pay["8"]),
              String(json_pay["9"])],
              // json_pay["10"],json_pay["11"],json_pay["12"],
              // json_pay["13"],json_pay["14"],json_pay["15"],json_pay["16"],
              // json_pay["17"],json_pay["18"],json_pay["19"],json_pay["20"],
              // json_pay["21"],json_pay["23"],json_pay["23"],json_pay["24"]
              (tx, results) => {
                //alert(json_pay["4"]);
                // console.log('Results', results.rowsAffected);
                var id = results.insertId;
                console.log("Successfully Registered. ID: " + id);
                if (results.rowsAffected > 0) {
                  
                  var info = String(json_pay["4"]) + '\n' + String(json_pay["5"]) + '\n' + String(json_pay["8"]);
                  Tts.getInitStatus().then(() => {
                    Tts.setDefaultRate(0.4);
                    Tts.speak(info);
                  });
                  that.setNotifications(id);

                  //console.log(entry);
                  Alert.alert(
                    'Successfully added',
                    info,
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('HomeScreen'),
                      },
                    ],
                    { cancelable: false }
                  );
                  
                } else {
                  var info = String(json_pay["4"]) + '\n' + String(json_pay["5"]) + '\n' + String(json_pay["8"]);
                  Tts.getInitStatus().then(() => {
                    Tts.setDefaultRate(0.4);
                    Tts.speak(info);
                  });
                  Alert.alert(
                    'Already Added',
                    info,
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('HomeScreen'),
                      },
                    ],
                    { cancelable: false }
                  );
                  
                }
              }
            );
          });
        } catch {
          console.log("ERROR INSERTING", err);
        }
  };

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
              <Text style={{
                textAlign: "center",
                fontFamily: "Cochin",
                fontSize: 40,
                margin: 20,
                marginTop: 60
              }}>Please Scan Prescription Bottle...</Text>
            {/* <Mytextinput
              placeholder="Enter Name"
              onChangeText={med_name => this.setState({ med_name })}
              style={{ padding:10 }}
            />
            <Mytextinput
              placeholder="Enter Contact No"
              onChangeText={med_dose => this.setState({ med_dose })}
              maxLength={10}
              keyboardType="numeric"
              style={{ padding:10 }}
            />
            <Mytextinput
              placeholder="Enter Address"
              onChangeText={med_desc => this.setState({ med_desc })}
              maxLength={225}
              numberOfLines={5}
              multiline={true}
              style={{ textAlignVertical: 'top',padding:10 }}
            />
            <Mybutton
              title="Submit"
              customClick={this.register_user.bind(this)}
            /> */}

          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}