import React, {Component} from 'react';
import {View, Text, Button, BackHandler, Image, TouchableOpacity} from 'react-native';
import { Constants, Audio } from 'expo';

export class EventScreen extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			playingStatus: 'nosound',
		}
	}
	
	componentDidMount() {
		
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
	
	handleBackButton() {
        return true;
    }
	
	static navigationOptions = ({navigation}) => ({
		title: "Event",
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
	
	async playMusic() {
		try {
			await Audio.setIsEnabledAsync(true);
			const sound = new Audio.Sound();
			this.sound = sound
			await sound.loadAsync(require('../assets/mylife.mp3'));
			await sound.playAsync();
			this.setState({playingStatus: 'playing'});
		} catch(error) {
			
		}
	}
	
	async pauseMusic() {
		if (this.sound != null) {
			if (this.state.playingStatus == 'playing') {
				await this.sound.pauseAsync();
				this.setState({playingStatus: 'pause'});
			} else {
				await this.sound.playAsync();
				this.setState({playingStatus: 'playing'});
			}
		}
	}
	
	playandpause() {
		switch (this.state.playingStatus) {
			case 'nosound':
			    this.playMusic();
			    break;
			case 'playing':
			    this.pauseMusic();
			    break;
			case 'pause':
			    this.playMusic();
			    break;
		}
	}
	
	render() {
		return (
			<View>
			    <Text>Event</Text>
				<Button 
					title="Play"
					onPress={this.playandpause()}
				/>
		
			</View>
		);
	}
}

export default EventScreen;