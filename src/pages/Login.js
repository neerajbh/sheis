import React, {Component} from 'react';
import {View, Text, Button, Image, Dimensions, TextInput, Alert,  AsyncStorage} from 'react-native';

export class LoginScreen extends Component{
	
	constructor(props) {
		super(props);
		this.state = {text: '', Text1: ''};
	}
	
	componentWillMount() {
		this.getToken();
	}
		
    static navigationOptions = ({navigation}) => ({
		title: "Login",
		headerTintColor: 'white',
		headerStyle: {
			backgroundColor: 'blue',
		},
		
	});
	
	async storeToken(accessToken) {
		try {
			await AsyncStorage.setItem('access_token', accessToken);
			
		} catch (error) {
			
		}
	}
	
	 getToken() {
		
		let token =  AsyncStorage.getItem('access_token');
		if (token !== null) {
			
		} else {
			this.props.navigation.navigate('Home');
		}
		
	}
	
	
	CheckTextInputForEmpty = async () => {
		const {text} = this.state;
		const {Text1} = this.state;
		
		if (text == '') {
			Alert.alert('Please Enter Email');
		} else if (Text1 == '') {
			Alert.alert('Please Enter Password');
		} else {
			fetch('https://reqres.in/api/login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"email": text,
					"password": Text1,
				}),
			})
		    .then((response) => response.json())
		    .then((responseJson) => {
				if (responseJson.token !== null) {
					this.storeToken(responseJson.token);
				    this.props.navigation.navigate('Home');
				} else {
					this.storeToken('null');
					Alert.alert('user not found')
				}
		    })
		    .catch((error) => {
		    	Alert.alert(error);
		    });
		}
	}
	
	
	render() {
		return (
			<View>
			    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 40}}>Login</Text>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 15, height: 40, width: 250}}
					onChangeText={(text) => this.setState({text})}
					placeholder="Email"
					value={this.state.text}
				/>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 10, height: 40, width: 250}}
					onChangeText={(Text1) => this.setState({Text1})}
					placeholder="Password"
					value={this.state.Text1}
				/>
			    <Button
				    containerViewStyle= {{marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}
					buttonStyle = {{width: 220}}
				    title="Login"
				    onPress={this.CheckTextInputForEmpty.bind(this)}
				/>
			</View>
		);
	}
	
	
}

export default LoginScreen;