/**
 * Custom Button
 * some UI template code adapted from https://aboutreact.com/
 * */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
const Mybutton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#428EE9',
    color: '#ffffff',
    padding: 40,
    marginTop: 25,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 20
  },
  text: {
    fontSize: 50,
    color: '#ffffff',
  },
});
export default Mybutton;