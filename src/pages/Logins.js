import React, {Component} from 'react';
import {View, Text, Button, TextInput, Alert, AsyncStorage} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteSample.db'});
import { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

export class LoginScreen extends Component{
	
	constructor(props) {
		super(props);
		this.state = {email: '', password: '', fbId: ''};
	}
	
	componentDidMount() {
		GoogleSignin.configure();
	}
		
    static navigationOptions = ({navigation}) => ({
		title: "Login",
		headerTintColor: 'white',
		headerStyle: {
			backgroundColor: 'blue',
		},
		
	});
	
	validateEmail(email) {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email) != 0;
	}
	
	initUser(token) {
		fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=' + token)
		.then((response) => response.json())
		.then((json) => {
			AsyncStorage.setItem('userName', json.name);
			AsyncStorage.setItem('userEmail', json.email);
			AsyncStorage.setItem('userImage', json.picture.data.url);
			this.props.navigation.navigate('Home');
		})
		.catch(() => {
			reject('ERROR GETTING DATA FROM FACEBOOK')
		})
	}
	
    LoginSql() {
		db.transaction( (txn) => {
			txn.executeSql('select * from user where email=? and password=?', [this.state.email, this.state.password], (txn, result) => {
				if (result.rows.length > 0) {
					AsyncStorage.setItem('userName', result.rows.item(0).name);
					AsyncStorage.setItem('userEmail', result.rows.item(0).email);
					AsyncStorage.setItem('userImage', result.rows.item(0).url);
					this.props.navigation.navigate('Home');
				} else {
					Alert.alert('incorrect email or password combination');
				}
			});
		});
	}
	
	loginFB() {
		LoginManager.logInWithReadPermissions(['email', 'public_profile']).then( (result) => {
		    if (result.isCancelled) {
				Alert.alert('Login Cancelled');
			} else {
				AccessToken.getCurrentAccessToken().then((data) => {
					const {accessToken} = data;
					this.initUser(accessToken);
				})
			}
       });
	}
	
	async googleLogin() {
		try {
			const userInfo = await GoogleSignin.signIn();
		    AsyncStorage.setItem('userName', userInfo.user.name);
			AsyncStorage.setItem('userEmail', userInfo.user.email);
			
			AsyncStorage.setItem('userImage', userInfo.user.photo);
			Alert.alert(JSON.stringify(userInfo));
			this.props.navigation.navigate('Home');
		} catch(error) {
			
		}
	}
	
	Login() {
		const {email, password} = this.state;
		if (email === '') {
			Alert.alert('Please enter email'); 
		} else if (!this.validateEmail(email)) {
			Alert.alert('Please enter correct email')
		} else if (password === '') {
			Alert.alert('Please enter password');
		} else {
			this.LoginSql();
		}
	}
	
	render() {
		return (
			<View>
			    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 40}}>Login</Text>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 15, height: 40, width: 250}}
					onChangeText={(email) => this.setState({email})}
					placeholder="Email"
					value={this.state.email}
				/>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 10, height: 40, width: 250}}
					onChangeText={(password) => this.setState({password})}
					placeholder="Password"
					secureTextEntry = {true}
					value={this.state.password}
				/>
			    <Button
				    containerViewStyle= {{marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}
					buttonStyle = {{width: 220}}
				    title="Login"
				    onPress={this.Login.bind(this)}
				/>
				
				<Text style={{marginBottom: 15, marginTop: 15, fontSize: 15, textAlign: 'center'}}>Not Register yet</Text>
				
				<Button
				    title="Register"
					onPress={() => this.props.navigation.navigate('Registration')}
				/>
				
				<Text style={{textAlign: 'center', fontSize: 14, marginBottom: 5, marginTop: 5}}> Or </Text>
				
				<Button
				    title='login with facebook'
					onPress={this.loginFB.bind(this)}
				/>
				
				<Button
				    title='Google Login'
				    onPress={this.googleLogin.bind(this)}
				/>
			</View>
		);
	}
	
	
}

export default LoginScreen;