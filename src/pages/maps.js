import React, {Component} from 'react';
import {View, Text, Button, Image, TouchableOpacity, BackHandler, Alert, TextInput } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Polyline from '@mapbox/polyline';

export default class MapsScreen extends Component<{}>{
	
	constructor(props) {
		super(props);
		this.state={
			longi: 77.2674,
			lati: 30.1290,
			city: '',
			locat: [],
			direction: '',
			coords: [],
			markers: [],
		};
		
		 this.mapRef = null;
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
		title: "Maps",
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

	getPlace() {
		const {city} = this.state;
		fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+city+'&key=AIzaSyAwrZ8sCiLJwr9wZrgW2Q5Lu3Tva8YrnXQ')
		.then((response) => response.json())
		.then((result) => {
			var locat = result.results;
			this.setState({locat});
		})
	}

	async getDirections() {
		const {city, direction} = this.state;
        try {
			
	let resp = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin='+city+'&destination='+direction+'&sensor=false&mode=driving&key=AIzaSyAwrZ8sCiLJwr9wZrgW2Q5Lu3Tva8YrnXQ')
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords});
			let startLatitudes = (respJson.routes[0].legs[0].start_location.lat);
			let startLongitudes = (respJson.routes[0].legs[0].start_location.lng);
			let endLatitudes = (respJson.routes[0].legs[0].end_location.lat);
			let endLongitudes = (respJson.routes[0].legs[0].end_location.lng);
			this.setState({
				markers: [
				    {coordinates: {latitude: startLatitudes, longitude:startLongitudes }},
				    {coordinates: {latitude: endLatitudes, longitude: endLongitudes }}
				]
			});
			this.setState({longi: startLongitudes, lati: startLatitudes});
			this.mapRef.fitToCoordinates(coords, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
            return coords
        } catch(error) {
            alert(error)
            return error
        }
    }
	
	
	render() {
		const {locat}= this.state;
		return (
		    <View style={{flex: 1}}>
			    <TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 10, height: 40, width: 100}}
					onChangeText={(city) => this.setState({city})}
					placeholder="Source"
					value={this.state.city}
				/>
				<TextInput 
					style={{marginLeft: 'auto', marginRight: 'auto', fontSize: 15, marginTop: 10, height: 40, width: 100}}
					onChangeText={(direction) => this.setState({direction})}
					placeholder="Destination"
					value={this.state.direction}
				/>
				
				<Button
				title='get direction'
				onPress={this.getDirections.bind(this)}
				/>
				
				<MapView 
					style={{flex: 3}}
					 ref={(ref) => { this.mapRef = ref }}
					region={{ 
					    latitude: this.state.lati,
						longitude: this.state.longi,
						latitudeDelta: 0.04,
						longitudeDelta: 0.04,
					}}
					onLayout={() => {
						 
					}}
				>
					<MapView.Polyline
					    coordinates={this.state.coords}
						strokeWidth={4}
						strokeColor='red'
					/>
					 
					 { this.state.markers && this.state.markers.map((marker) => 
					     <MapView.Marker
						     coordinate={marker.coordinates}
						 />
					 )}
				</MapView>
				
			</View>
		);
		
	}
}
