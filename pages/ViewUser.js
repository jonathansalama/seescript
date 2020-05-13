/**View medication
 * Some UI template code was adapted from https://aboutreact.com/
*/
import React from 'react';
import { Text, View, SafeAreaView, FlatList, StyleSheet, 
  TouchableOpacity, Alert, Modal } from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Divider } from 'react-native-elements';
import NotifService from './NotifService';

var db = openDatabase({ name: 'Med.db' }); 

export default class ViewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      date: new Date(),
      selectedNotif: null,
      showDatePicker: false,
      modalVisible: false
      // repeat: 0
    };
    this.notif = new NotifService(this.onNotif.bind(this));
    //this.showDatePicker = this.showDatePicker.bind(this);
    //this.hideDatePicker = this.hideDatePicker.bind(this);
    //this.handleConfirm = this.handleConfirm.bind(this);

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notifications where entry_id=? ORDER BY hour, minute', [this.props.navigation.state.params.item.entry_id], (tx, results) => {
        //console.log(results.rows.item(0));
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });

  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '50%', backgroundColor: '#808080' }} />
    );
  };


  setDate = date => {
    this.setState({
      date: date,
      showDatePicker: false
    });
    // console.log(this.state.date.getHours());
    this.notif.scheduleNotif(this.props.navigation.state.params.item, date.getHours(), date.getMinutes(), 24);
    alert("Notification Set!");

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notifications where entry_id=? ORDER BY hour, minute', [this.props.navigation.state.params.item.entry_id], (tx, results) => {
        //console.log(results.rows.item(0));
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });

  }
  
  cancellation = () => {
    this.notif.cancelNotif(this.props.navigation.state.params.item);
    this.setState({ FlatListItems: [] });
  }

  cancelOne = (notification) => {
    console.log("Cancel ID: " + notification.notif_id);
    console.log("Cancel Time: " + notification.hour + ":" + notification.minute);
    this.notif.cancelOneNotif(notification.notif_id);

  

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notifications where entry_id=? ORDER BY hour, minute', [this.props.navigation.state.params.item.entry_id], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });

  }

  notifHeader = () => {
    if (this.state.FlatListItems.length == 0){
      return "";
    }
    else {
      return "Notifications (Hold to Delete):"
    }
    
  }

  showDatePicker = () => {
    console.log("hello");
    this.setState({ showDatePicker: true });
  }

  hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  }
  
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setOneDelete = (item) => {
    this.setState({
      selectedNotif: item
    })
  }

  selectedTime = (item) => {
    var theTime = 'Selected';
    if (item != null){
      var twelvehour = ' AM';
      var initialHour = item.hour;
      var theHour = initialHour;
      if (initialHour >= 12) {
        theHour = initialHour - 12;
        twelvehour = ' PM';
      }
      if (theHour == 0) {
        theHour = 12;
      }
      theTime = '' + theHour + ":" + ("0" + item.minute).slice(-2) + twelvehour;
    }
    return theTime;
  }

  deleteMed = () => {
    this.cancellation();

    var input_entry_id = this.props.navigation.state.params.item.entry_id;
    console.log("\nDELETING " + input_entry_id);

    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM table_med where entry_id=?',
        [input_entry_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log("deleted " + results.rowsAffected + " rows");
            this.props.navigation.navigate('HomeScreen');
          }
        }
      );
    });
  };

  render() {
    const { showDatePicker, date } = this.state;
    const { modalVisible } = this.state;
    var notificationHeader = this.notifHeader();
    
    return (
      <View>

        <View>
          <FlatList
            nestedScrollEnabled={true}
            data={this.state.FlatListItems}
            // ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => {
              this.setModalVisible(true);
              this.setOneDelete(item);
              }}>
              <View style={{ padding: 0 }}>
                <Text style={{
                  fontSize: 30,
                  textAlign: "center",
                }}>{this.selectedTime(item)}</Text>
              </View>
            </TouchableOpacity>

            )}

            ListHeaderComponent={
              <View>
                <View style={{ marginLeft: 35, marginRight: 35, marginTop: 20 }}>
                {/* <Text style={{
                      fontSize: 20
                    }}>Med Id: {this.props.navigation.state.params.item.entry_id}</Text> */}
                <Text style={{
                      fontSize: 20
                    }}>Patient Name: {this.props.navigation.state.params.item.patient_name}</Text>
                <Text style={{
                      fontSize: 20
                    }}>Medication: {this.props.navigation.state.params.item.med_name}</Text>
                <Text style={{
                      fontSize: 20
                    }}>Dosage: {this.props.navigation.state.params.item.dose}</Text>
                <Text style={{
                      fontSize: 20
                    }}>Instructions: {this.props.navigation.state.params.item.instructions}</Text>
              </View>
      
              <View style={{ marginLeft: 35, marginRight: 35, marginTop: 20 }}>
                <Text style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  padding: 10
                  }}>{notificationHeader}</Text>
              </View>
            </View>
            }
            ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
            ListFooterComponent={

              <View>
                <Divider style={{ 
                  backgroundColor: 'grey',
                  margin: 20
                  }} />
        
                <View>
                  <TouchableOpacity style={styles.button1} onPress={() => {this.showDatePicker()}}>
                    <Text style={{
                      fontSize: 30,
                      textAlign: "center",
                      color: "white"
                    }}>Add Notification</Text>
                    </TouchableOpacity>
                </View>
        
                <View>
                  <DateTimePickerModal
                    isVisible={ showDatePicker }
                    date={ date }
                    mode='time'
                    onConfirm={ this.setDate }
                    onCancel={ this.hideDatePicker }
                  />
                </View>
                <View>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Cancel {this.selectedTime(this.state.selectedNotif)} Notification?</Text>
                        <View style={{
                          flexDirection: "row",
                        }}>

                        <TouchableOpacity
                          style={{ ...styles.openButton, backgroundColor: "#ff2600" }}
                          onPress={() => {
                            this.cancelOne(this.state.selectedNotif);
                            this.setModalVisible(!modalVisible);
                          }}
                        >
                          <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                          onPress={() => {
                            this.setModalVisible(!modalVisible);
                          }}
                        >
                          <Text style={styles.modalButtonText}>Keep</Text>
                        </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
                
                
        
                {/* <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.button2} onPress={() => { this.notif.scheduleNotif(this.props.navigation.state.params.item, date.getHours(), date.getMinutes(), 24) }}><Text style={{
                        fontSize: 25
                      }}>Schedule Notification</Text></TouchableOpacity> */}
                
                <Divider style={{ 
                  backgroundColor: 'grey',
                  margin: 20
                  }} />
        
                  <TouchableOpacity style={styles.button2} onPress={() => {this.cancellation()}}>
                    <Text style={{
                          fontSize: 25,
                          color: "white"
                        }}>Cancel notifications</Text></TouchableOpacity>
                
                <Divider style={{ 
                  backgroundColor: 'grey',
                  margin: 20
                  }} />
                  
                  <TouchableOpacity style={{ ...styles.button2, backgroundColor: "#ff2600" }} onPress={() => {this.deleteMed()}}>
                    <Text style={{
                          fontSize: 25,
                          color: "white"
                        }}>Delete Prescription</Text></TouchableOpacity>
        
        
                {/* <TouchableOpacity style={styles.button2} onPress={() => { this.notif.cancelAll() }}><Text style={{
                        fontSize: 25
                      }}>Cancel all notifications</Text></TouchableOpacity> */}
        
                {/* <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity> */}
        
                <View style={styles.spacer}></View>
              </View>
            }
          />
        </View>

      </View>
    );
  }

  onNotif(notif) {
    console.log(notif);
    // Alert.alert(notif.title, notif.message);
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: "#000000",
    marginLeft: 50,
    marginRight: 50,
    margin: 20,
    padding: 5,
    height: 100,
    width: "70%",
    backgroundColor: "#428EE9",
    borderRadius: 5,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: "#000000",
    marginLeft: 50,
    marginRight: 50,
    margin: 20,
    padding: 5,
    height: 50,
    width: "70%",
    backgroundColor: "#428EF2",
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    margin: 5,
    padding: 5,
    width: "70%"
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    elevation: 2
  },
  modalButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 25,
    textAlign: "center"
  }
});