import React, {Component} from 'react';
import { View, Text, Image, AsyncStorage, Alert } from 'react-native';
import TimerMixin from 'react-timer-mixin';


export class SplashScreen extends Component{
	
    componentDidMount() {
		this.getItem();
    }
	
    async getItem() {
		try{
		 await AsyncStorage.getItem('access_token').then((value) => {
			 if (value !== null ) {
				 console.log(value);
				 this.props.navigation.navigate('Home');
			 } else {
				 this.props.navigation.navigate('Login');
			 }
		 });
		} catch(error) {
			console.log(error);
		}
	}
	
	render() {
		return (
			<View>
			</View>
		);
	}
}

export default SplashScreen;