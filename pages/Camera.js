/**
 * Camera Page
 * Some code was adapted from https://github.com/zsajjad/BusinessCard
 */

import React, { Component, useCallback } from "react";
import { Text, TouchableOpacity, View, ImageBackground, Modal, Linking, StyleSheet, Alert } from "react-native";
import { RNCamera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";
import Fuzzy from "./Fuzzy";
import Tts from 'react-native-tts';
import style, { screenHeight, screenWidth } from "./components/styles";
import { Spinner, Button, Icon, Header, Left, Body, Title, Right } from 'native-base';
import 'react-native-console-time-polyfill';

import longdata from '../nih_drugs_first.json';

const PICTURE_OPTIONS = {
  quality: 1,
  fixOrientation: true,
  forceUpOrientation: true,
};

export default class CameraPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            image: null,
            error: null,
            med_alert: '',
            med_link: '',
            visionResp: [],
            modalVisible: false
        };
        this.search = new Fuzzy();
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  /**
   * reset
   *
   * Handles error situation at any stage of the process
   *
   * @param {string} [error="OTHER"]
   * @memberof App
   */
  reset(error = "OTHER") {
    console.log("RESET");
    this.setState(
      {
        loading: false,
        image: null,
        error
      },
      () => {
        // setTimeout(() => this.camera.startPreview(), 500);
      }
    );
  }

  /**
   * takePicture
   *
   * Responsible for getting image from react native camera and
   * starting image processing.
   *
   * @param {*} camera
   */
  takePicture = async camera => {
    try {
      const data = await camera.takePictureAsync({
        skipProcessing: true,
      });
      this.setState({
        loading: true
      });
      if (!data.uri) {
        throw "OTHER";
      }
      this.setState(
        {
          // image: data.uri
        },
        () => {
          // console.log(data.uri);
          this.processImage(data.uri, {
            height: data.height,
            width: data.width
          });
        }
      );
    } catch (e) {
      console.log(e);
      this.reset(e);
    }
  };

  /**
   * processImage
   *
   * Responsible for getting image from react native camera and
   * starting image processing.
   *
   * @param {string} uri              Path for the image to be processed
   * @param {object} imageProperties  Other properties of image to be processed
   * @memberof App
   */
  processImage = async (uri, imageProperties) => {
    console.time("process");

    this.setState({
      loading: true
    });
    const visionResp = await RNTextDetector.detectFromUri(uri);
    //console.log(visionResp);
    if (!(visionResp && visionResp.length > 0)) {
      alert("Unable to Read. Please try again.");
      this.reset("OTHER");
      return;
    }
    var searches = [];
    var acceptedNames = [];
    searches.push([0, "null"]);
    var breakage = 0;
    var instant = 0;


    try {
      for(var i = 0; i < visionResp.length; i++) {
        var obj = visionResp[i];
        var words = obj.text.split(/\s+/);
        for(var j = 0; j < words.length; j++) {
          var currWord = String(words[j]).toLowerCase();
          currWord = currWord.replace(/[^a-zA-Z0-9]/gi, '');
          if (longdata.includes(currWord) && !acceptedNames.includes(currWord)) {
            searches.push([1, currWord.charAt(0).toUpperCase() + currWord.slice(1)]);
            acceptedNames.push(currWord)
            console.log(currWord);
            instant++;
            // break;
          }
        }
        if (instant > 0) {
          //console.log("INSTANTLY FOUND: " + instant);
          //break;
        }

      }
      if (instant == 0) {
        console.log("Fuzzy Searching");
      for(var i = 0; i < visionResp.length; i++) {
          var obj = visionResp[i];
          var word = obj.text.split(/\s+/);
          console.log(word);
          for(var j = 0; j < word.length; j++) {
            var currWord = String(word[j]).toLowerCase();
            currWord = currWord.replace(/[^a-zA-Z0-9]/gi, '');
              if (currWord.length < 4) continue;
              var term = this.search.search(currWord);
              if (term){
                  if (term[0] > 0.85) {
                    console.log("This is reasonable");
                    console.log([term[0], term[1].charAt(0).toUpperCase() + term[1].slice(1)])
                    searches.push([term[0], term[1].charAt(0).toUpperCase() + term[1].slice(1)]);
                  }
                  if (term[0] >= 0.85) {
                    console.log("Found a match");
                    breakage++;
                    break;
                  }
                  else {
                    console.log(term[0]);
                  }
              }
          }
          if (breakage > 0) {
              break;
          }
      }
    }
      searches.sort(function(a, b) {
          return parseFloat(b[0]) - parseFloat(a[0]);
      });
      console.timeEnd("process");

      var result = searches[0][1];
      if (searches[0][0] > 0.88) {
        this.setState({
          med_link: "https://pillbox.nlm.nih.gov/results.html?medicine_name="+searches[0][1]+"&imprint=&shape=&color=&inactive_ingredients=&repackaged=false&page=1&items_per_page=20",
        });
        var valid_searches = [];
        var alertMessage = '';
        for (var i = 0; i < searches.length; i++) {
          var identified_medication = searches[i][1] + "\n" + (Math.round(((searches[i][0]*100) + Number.EPSILON)*100)/100) + "% Certainty";
          if (searches[i][0] > 0.88) {
            valid_searches.push(identified_medication);
            alertMessage += identified_medication + '\n\n';
          }
        }
        alertMessage = alertMessage.slice(0, -2);
        this.setState({
          loading: false,
          image: uri,
        });

      //alert(searches[0][1]);
      Tts.getInitStatus().then(() => {
          Tts.setDefaultRate(0.4);
          for (const medication of valid_searches) {
            Tts.speak(medication);
          }
        });

        // if (searches[1][0] > 0.8) {
        //   Tts.getInitStatus().then(() => {
        //     Tts.setDefaultRate(0.4);
        //     Tts.speak(searches[1][1] + ". " + (Math.round(((searches[1][0]*100) + Number.EPSILON)*100)/100) + "% Certainty");
        //   });
        // }

        this.setState({
          med_alert: alertMessage
        });
        this.setModalVisible(true);

        // Alert.alert(
        //   'Successfully Read',
        //   alertMessage,
        //   [
        //     {
        //       text: 'Ok',
        //       onPress: () =>
        //         this.props.navigation.navigate('HomeScreen'),
        //     },
        //   ],
        //   { cancelable: false }
        // );
      }
      else {
        alert("Unable to Read. Please try again.");
        this.reset("OTHER");
        return;
      }
      

      //console.log(visionResp)
      // console.log(this.search.search(JSON.stringify(visionResp)));
      // this.setState({
      //     med_name: this.search.search(JSON.stringify(visionResp))
      // });
      this.setState({
        //visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
      });
    }
    catch(e) {
      alert("Reading Failure. Please try again.");
        this.reset(e);
        return;

    }
  };

  /**
   * mapVisionRespToScreen
   *
   * Converts RNTextDetectors response in representable form for
   * device's screen in accordance with the dimensions of image
   * used to processing.
   *
   * @param {array}  visionResp       Response from RNTextDetector
   * @param {object} imageProperties  Other properties of image to be processed
   * @memberof App
   */
  mapVisionRespToScreen = (visionResp, imageProperties) => {
    const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
    const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

    return visionResp.map(item => {
      return {
        ...item,
        position: {
          width: item.bounding.width * IMAGE_TO_SCREEN_X,
          left: item.bounding.left * IMAGE_TO_SCREEN_X,
          height: item.bounding.height * IMAGE_TO_SCREEN_Y,
          top: item.bounding.top * IMAGE_TO_SCREEN_Y
        }
      };
    });
  };

  /**
   * React Native render function
   *
   * @returns ReactNode or null
   * @memberof App
   */
  render() {
    const { modalVisible } = this.state;
    return (
      <View style={style.screen}>
        {!this.state.image ? (
          <RNCamera
            ref={cam => {
              this.camera = cam;
            }}
            key="camera"
            style={style.camera}
            flashMode={RNCamera.Constants.FlashMode.torch}
            notAuthorizedView={null}
            playSoundOnCapture
          >
            {({ camera, status }) => {
              if (status !== "READY") {
                return null;
              }
              return (
                <View style={style.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => this.takePicture(camera)}
                    style={style.button}
                  />
                </View>
              );
            }}
          </RNCamera>
        ) : null}
        {this.state.loading ? (
                  <View style={{ 
                    flex: 1, 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: 'white'}}>
                    <View style={{marginBottom: 100}}>
                    <Spinner color="#428EE9"/>
                    <Text style={{ alignSelf: 'center', fontSize: 20, color: 'black' }}>Processing...</Text>
                    </View>
                </View>
                ) : false}
        {this.state.image ? (
          <ImageBackground
            source={{ uri: this.state.image }}
            style={style.imageBackground}
            key="image"
            resizeMode="cover"
          >
            {this.state.visionResp.map(item => {
              return (
                <TouchableOpacity
                  style={[style.boundingRect, item.position]}
                  key={item.text}
                />
              );
            })}
          </ImageBackground>
        ) : null}

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
                <Text style={styles.modalText}>{this.state.med_alert}</Text>
                <View style={{
                  flexDirection: "row",
                }}>

                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#2196f3" }}
                  onPress={ ()=>{ Linking.openURL(this.state.med_link)}}>
                    <Text style={styles.modalButtonText}>More Info</Text>
                  </TouchableOpacity>

                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#2196F4" }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                    this.props.navigation.navigate('HomeScreen');
                  }}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
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