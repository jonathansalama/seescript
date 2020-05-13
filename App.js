/**
 * Main App.js
 * Some UI template code was adapted from https://aboutreact.com/
 */
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './pages/HomeScreen';
import Scan from './pages/Scan';
import UpdateUser from './pages/UpdateUser';
import ViewUser from './pages/ViewUser';
import ViewAllUser from './pages/ViewAllUser';
import DeleteUser from './pages/DeleteUser';
import SetNotif from './pages/SetNotif';
import CameraPage from './pages/Camera';
import Fuzzy from './pages/Fuzzy';


const App = createStackNavigator({
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Welcome to SeeScript',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    View: {
      screen: ViewUser,
      navigationOptions: {
        title: 'View Medication',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    ViewAll: {
      screen: ViewAllUser,
      navigationOptions: {
        title: 'View All Medications',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    Update: {
      screen: UpdateUser,
      navigationOptions: {
        title: 'Update User',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    Scan: {
      screen: Scan,
      navigationOptions: {
        title: 'Scan',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    Delete: {
      screen: DeleteUser,
      navigationOptions: {
        title: 'Delete Medications',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    SetNotif: {
      screen: SetNotif,
      navigationOptions: {
        title: 'Set Notification',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },
    CameraPage: {
      screen: CameraPage,
      navigationOptions: {
        title: 'Camera',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },

    Fuzzy: {
      screen: Fuzzy,
      navigationOptions: {
        title: 'Fuzzy',
        headerStyle: { backgroundColor: '#428EE9' },
        headerTintColor: '#ffffff',
      },
    },

  });
  export default createAppContainer(App);

// class App extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             log: "Ready to scan...",
//             text: ""
//         }
//     }
//     componentDidMount() {
//         NfcManager.start();
//     }

//     componentWillUnmount() {
//         this._cleanUp();
//     }

//     _cleanUp = () => {
//         NfcManager.cancelTechnologyRequest().catch(() => 0);
//     }

//     readData = async () => {
//         try {
//             let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
//             let resp = await NfcManager.requestTechnology(tech, {
//                 alertMessage: 'Ready to do some custom Mifare cmd!'
//             });

//             let cmd = Platform.OS === 'ios' ? NfcManager.sendMifareCommandIOS : NfcManager.transceive;

//             resp = await cmd([0x3A, 4, 4]);
//             let payloadLength = parseInt(resp.toString().split(",")[1]);
//             let payloadPages = Math.ceil(payloadLength / 4);
//             let startPage = 5;
//             let endPage = startPage + payloadPages - 1;

//             resp = await cmd([0x3A, startPage, endPage]);
//             bytes = resp.toString().split(",");
//             let text = "";

//             for(let i=0; i<bytes.length; i++){
//                 if (i < 5){
//                     continue;
//                 }

//                 if (parseInt(bytes[i]) === 254){
//                     break;
//                 }

//                 text = text + String.fromCharCode(parseInt(bytes[i]));

//             }

//             this.setState({
//                 log: text
//             })

//             Tts.getInitStatus().then(() => {
//                 Tts.setDefaultRate(0.3);
//                 Tts.speak(text);
//               });

//             // this._cleanUp();
//         } catch (ex) {
//             this.setState({
//                 log: ex.toString()
//             })
//             this._cleanUp();
//         }

//     }

//     onChangeText = (text) => {
//         this.setState({
//             text
//         })
//     }

//     render() {
//         return (
//             <SafeAreaView style={styles.container}>

//                 <TouchableOpacity
//                     style={styles.buttonRead}
//                     onPress={this.readData}>
//                     <Text style={styles.buttonText}>Welcome to SeeScript!</Text>
//                 </TouchableOpacity>

//                 <View style={styles.log}>
//                     <Text>{this.state.log}</Text>
//                 </View>
//             </SafeAreaView>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//     },

//     buttonRead: {
//         marginLeft: 20,
//         marginRight: 20,
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 8,
//         backgroundColor: '#006C5B'
//     },
//     buttonText: {
//         color: '#ffffff'
//     },
//     log: {
//         marginTop: 30,
//         marginLeft: 20,
//         marginRight: 20,
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//     }
// })

// export default App;