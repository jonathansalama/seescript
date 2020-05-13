/**View all
 * Some UI template code was adapted from https://aboutreact.com/
*/

import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {NavigationEvents} from 'react-navigation';


var db = openDatabase({ name: 'Med.db' }); 
export default class ViewAllUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };
  }

  componentDidMount() {
    this.updateList();
  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_med', [], (tx, results) => {
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
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };
  
  render() {
    return (
      <View>
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('View', {item})}>

            <View key={item} style={{ backgroundColor: 'white', padding: 20 }}>
              <Text >Id: {item.entry_id}</Text>
              <Text style={{
                fontSize: 35
              }}>Patient: {item.patient_name}</Text>
              <Text style={{
                fontSize: 40
              }}>Medicine: {item.med_name}</Text>
              <Text style={{
                fontSize: 40
              }}>Dose: {item.dose}</Text>
              <Text style={{
                fontSize: 40
              }}>Frequency: {item.freq}</Text>
              <Text style={{
                fontSize: 40
              }}>Instructions: {item.instructions}</Text>
              <Text style={{
                fontSize: 40
              }}>{item.med_desc}</Text>
            </View>
            {/* <NavigationEvents onDidFocus={() => this.updateList()} /> */}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}