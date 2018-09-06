
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, SafeAreaView, AsyncStorage} from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation';
import RegistrationScreen from './src/pages/Registration';
import LoginScreen from './src/pages/Logins';
import HomeScreen from './src/pages/Home';
import MapsScreen from './src/pages/maps';

const customContent = (props) => (
    <SafeAreaView style={{flex: 1}}>
    <View style={{height: 120}}>
	    <Text style={{textAlign: 'center'}}>{(state) => state.name}</Text>
	</View>
	<ScrollView>
	    <DrawerItems {...props}/>
	</ScrollView>
	</SafeAreaView>
);
	
const HomeSwitcher = createStackNavigator ({
	Home: HomeScreen,
});

const MapsSwitcher = createStackNavigator ({
	Maps: MapsScreen
});

const DrawerSwitcher = createDrawerNavigator ({
	Home: HomeSwitcher,
	Maps: MapsSwitcher,
}, {
	contentComponent: customContent,
});

const RegistrationSwitcher = createStackNavigator ({
    Registration: RegistrationScreen,
	Login: LoginScreen,
	Home: DrawerSwitcher,
},
{
	headerMode: 'none',
	
});

	
export default class App extends Component<Props> {
	
	constructor(props) {
	    super(props);
		this.state={name: ''};	
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	componentWillMount() {
		this.getToken();
	}
	
	async getToken() {
		try {
			let name = await AsyncStorage.getItem('userName');
			if (name !== null || email !== null || url !== null){
				this.setState({name: name});
			} else {
			}
			
		} catch(error) {
		}
	}
	
	
  render() {
    return (
      <RegistrationSwitcher />
    );
  }
}
