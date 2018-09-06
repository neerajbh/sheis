import React, {Component} from 'react';
import {View, Text, Button, Image, TextInput, Alert, TouchableOpacity, AsyncStorage} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteSample.db'});

export class RegistrationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			ImageSource: null,
		    urls: '',
			data: '',
		};
	}
	
	componentWillMount() {
		this.getToken();
	}
	

	validateEmail(email) {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email) != 0;
	}
	
	selectPhotoTapped() {
		ImagePicker.showImagePicker((response) => {
			console.log('Response = ', response);
  
			if (response.didCancel) {
				console.log('User cancelled photo picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };
  
				this.setState({
					ImageSource: source,
					urls: response.uri
				});
			}
		});
    }
	
	SQLiteFile()  {
		const {name, email, password, urls} = this.state;
		db.transaction( (txn) => {
			txn.executeSql('select * from user where email=?', [email], (txn, result) => {
				if (result.rows.length <= 0) {
					txn.executeSql('insert into user(name, email, password, url) values(?,?,?,?)', [name, email, password, urls], (txn, result) => {
						Alert.alert('User successfully Registered');
						this.props.navigation.navigate('Login');
					});
				} else {
					Alert.alert('user with ${email} already registered');
				}
			});
			
		});
	}
	
	RegisterUser() {
		this.validateEmail();
		const {name, email, password} = this.state;
		if (name === '') {
			Alert.alert('Please enter name');
		} else if (email === '') {
			Alert.alert('Please enter email');
		} else if (!this.validateEmail(email)) {
			Alert.alert('Please Enter correct email');
		} else if (password === '') {
			Alert.alert('Please enter password');
		} else if (this.state.urls === '') {
			Alert.alert('Please select image');
		} else {
			this.SQLiteFile();
		}
	}
	
	async getToken() {
		try {
			let name = await AsyncStorage.getItem('userName');
			let email = await AsyncStorage.getItem('userEmail');
			let url = await AsyncStorage.getItem('userImage');
			if (name !== null || email !== null || url !== null){
				this.props.navigation.navigate('Home');
			} else {
				
			}
			
		} catch(error) {
		}
	}
	
	render() {
		const {uri} = this.props;
		return (
		    <View>
				<Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 35}}>Register</Text>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 10, height: 40, width: 250}}
					onChangeText={(name) => this.setState({name})}
					placeholder="Name"
					value={this.state.name}
				/>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 5, height: 40, width: 250}}
					onChangeText={(email) => this.setState({email})}
					placeholder="Email"
					value={this.state.email}
				/>
				<TextInput 
				    secureTextEntry = {true}
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 5, height: 40, width: 250}}
					onChangeText={(password) => this.setState({password})}
					placeholder="Password"
					value={this.state.password}
				/>
			
				<TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
				
				<View>

            { this.state.ImageSource === null ? <Text style={{ fontSize: 20, marginTop: 5 , textAlign: 'center', marginBottom: 15}}>
					Select a Photo
					</Text> : <Image source={this.state.ImageSource} style={{width: 100, height: 100, marginLeft: 'auto', marginRight: 'auto'}}/> }

            </View>
					
				</TouchableOpacity>
			
				<Button
					title="Register"
					onPress={this.RegisterUser.bind(this)}
				/>
				
				<Text style={{marginTop: 15, marginBottom: 15, fontSize: 15, textAlign: 'center'}}>Already Registered</Text>
				
				<Button
				    title="Login"
					onPress = {() => this.props.navigation.navigate('Login')}
				/>
				<Text></Text>
				
				
			</View>
		);
	}
	
}

export default RegistrationScreen;