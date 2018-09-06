import React from 'react';
import { View, Text, Button, BackHandler, TouchableOpacity, TouchableWithoutFeedback , Image, FlatList, ListItem, Alert }  from 'react-native';


export class GalleryScreen extends React.Component {
	
	constructor(props){
		super(props);
		this.state ={ isLoading: true}
    }
	
	componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		fetch('https://reactnativecode.000webhostapp.com/FlowersList.php')
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				isLoading: false,
				dataSource: responseJson,
			}, function(){

			});
		})
		.catch((error) => {
			Alert.alert(error);
		});
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
	
	handleBackButton() {
        return true;
    }
	
	static navigationOptions = ({navigation}) => ({
		title: 'Gallery',
		headerTintColor: 'white',
		headerStyle: {
			backgroundColor: 'blue',
		},
		headerLeft: (
		  <TouchableOpacity onPress = {() => navigation.openDrawer()}>
			    <Image
				    style = {{marginLeft: 5, width: 30, height: 30}}
				    source={require('../assets/drawer.png')}
				/>
			</TouchableOpacity>
		),
	});
	
	pressed() {
		console.log('sdf');
	}
	
	render() {
		return (
		    <View>
				<FlatList 
					data={this.state.dataSource}
					ItemSeparatorComponent = {this.FlatListItemSeparator}
					renderItem={
						({item}) => 
						<TouchableOpacity onPress={() => this.props.navigation.navigate('DetailGallery', {name: item.flower_name, url: item.flower_image_url})}>
						
					        <View style={{flex: 1, flexDirection: 'row'}}>
						    <Image
						    style={{width: 150, height: 100, marginBottom: 5}}
						    source={{uri: item.flower_image_url}}
						    />
						    <Text style={{textAlignVertical: 'center'}}>{item.flower_name}</Text>
						    </View>
						</TouchableOpacity>
					}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		);
	}
}

export default GalleryScreen;