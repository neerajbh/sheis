import React, {Component} from 'react';
import {View, Text, Button, Image, TouchableOpacity, BackHandler, Alert, AsyncStorage } from 'react-native';
import {LoginManager} from 'react-native-fbsdk'
import LoginScreen from './Login';
import {GoogleSignin} from 'react-native-google-signin';

export class HomeScreen extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			uri: '',
			isFBLogin: '',
		};
	}
	
	componentDidMount() {
		this.getToken();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
	
	handleBackButton() {
        return true;
    }
	
	async removeToken() {
		try {
			await AsyncStorage.clear();
			LoginManager.logOut();
			GoogleSignin.signOut();
			this.props.navigation.navigate('Login');
			return true
		} catch(error) {
			
		}
	}
	
	async getToken() {
		try {
			let name = await AsyncStorage.getItem('userName');
			let email = await AsyncStorage.getItem('userEmail');
			let url = await AsyncStorage.getItem('userImage');
			if (name !== null || email !== null || url !== null){
				this.setState({name: name, email: email, uri: url});
			} else {
			}
			
		} catch(error) {
		}
	}
	
    static navigationOptions = ({navigation}) => ({
		title: "Home",
		headerTintColor: 'white',
		headerStyle: {
			backgroundColor: 'blue',
		},
		headerLeft:  (
		    <TouchableOpacity onPress = {() => navigation.openDrawer()}>
			    <Image
				    style = {{marginLeft: 5, width: 30, height: 30}}
				    source={require('../assets/drawer.png')}
				/>
			</TouchableOpacity>
		   
		),
	});
	
	render() {
		return (
			<View>
			    <Image 
				    style = {{width: 200, height: 150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}
				    source = {{uri: this.state.uri}}
				/>
				<Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>{this.state.name}</Text>
				<Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>{this.state.email}</Text>
				
				<Button
				title = "Logout"
				onPress = {this.removeToken.bind(this)}
				/>
			</View>
		);
	}
}

export default HomeScreen;