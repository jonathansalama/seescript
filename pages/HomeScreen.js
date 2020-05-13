/**
 * Home Screen With buttons to navigate to different options
 * some UI template code was adapted from https://aboutreact.com/
 */
import React from 'react';
import { ScrollView, Text } from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import { openDatabase } from 'react-native-sqlite-storage';
import BackgroundFetch from "react-native-background-fetch";
import base64 from 'react-native-base64';
import {zip_deflate} from '../rawdeflate.js'
import {zip_inflate} from '../rawinflate.js'

var db = openDatabase({ name: 'Med.db' });


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decompress: '',
    };
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_med'",
        [],
        function(tx, res) {
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            // console.log("empty");
            txn.executeSql('DROP TABLE IF EXISTS table_med', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_med(entry_id INTEGER PRIMARY KEY AUTOINCREMENT, ' 
              + 'patient_name TEXT, patient_addr TEXT, dob TEXT, med_name TEXT, dose TEXT, root TEXT, '
              + 'type TEXT, instructions TEXT, freq TEXT, quant TEXT, duration TEXT, date_fill TEXT, '
              + 'date_discard TEXT, date_next_refill TEXT, date_cannot_refill TEXT, refill TEXT, '
              + 'pharm_phone TEXT, rx_num TEXT, prescriber TEXT, description TEXT, indication TEXT, '
              + 'important_info TEXT, warning TEXT, side_effects TEXT, unique(patient_name, med_name, dose, instructions))',
              []
            );
          }
          else {
            // console.log("Rows: " + res.rows.length);
          }
        }
      );
    });
  }


  // componentDidMount() {
  //   BackgroundFetch.configure(
  //     {
  //      minimumFetchInterval: 15 // minutes
  //     },
  //     () => {
  //      console.log("Received background fetch event");

  //      PushNotification.configure({
  //       onNotification: (notification) => {
  //        console.log("Push notification received");
  //       }
  //      });

  //      PushNotification.localNotification({
  //       title: "Hello World",
  //       message: "This is a push notification!"
  //      });

  //      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
  //     }, 
  //     (error) => {
  //      console.log("Background fetch failed to start with error: " + error);
  //     }
  //    );

  // }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
        {/* <Text>Info: {this.state.decompress}</Text> */}
        <Mybutton
          title="Scan"
          customClick={() => this.props.navigation.navigate('Scan')}
        />
        {/* <Mybutton
          title="Set Not"
          customClick={() => this.props.navigation.navigate('SetNotif')}
        /> */}
        {/* <Mybutton
          title="View"
          customClick={() => this.props.navigation.navigate('View')}
        /> */}
        <Mybutton
          title="View All"
          customClick={() => this.props.navigation.navigate('ViewAll')}
        />
        <Mybutton
          title="Camera"
          customClick={() => this.props.navigation.navigate('CameraPage')}
        />

        {/* <Mybutton
          title="Fuzzy"
          customClick={() => this.props.navigation.navigate('Fuzzy')}
        /> */}

        {/* <Mybutton
          title="Delete"
          customClick={() => this.props.navigation.navigate('Delete')}
        /> */}
      </ScrollView>
    );
  }

  encode(str) {
    return base64.encode(zip_deflate(unescape(encodeURIComponent(str))));
  }

  decode(str) {
    return decodeURIComponent(escape(zip_inflate(base64.decode(str))));
  }

}