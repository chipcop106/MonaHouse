import React, { useContext, useEffect, useState, useReducer } from 'react';
import {
	Text, StyleSheet, View,
	ScrollView, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Layout, Button, Icon, Input
} from "@ui-kitten/components";
import ImagePicker from "react-native-image-crop-picker";
import { utils } from '@react-native-firebase/app';
import vision from '@react-native-firebase/ml-vision';
import {Context as authCt} from '~/context/AuthContext';




import { sizes, color } from '~/config';
import { TouchableOpacity } from 'react-native-gesture-handler';



const SettingScreen = () => {
	const { signOut } = useContext(authCt);
	const navidation = useNavigation();
	const [stateData, dispatchData] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'CHANGEIMG':
					return{
						...prevState,
						imgRecognition: action.value
					};
				case 'CHANGETEXT':
					return{
						...prevState,
						textRecognitionValue: action.value
					};
				case 'processed':
					return{
						...prevState,
						processedValue: action.value
					};
				case 'IMG_SOURCE':
					return{
						...prevState,
						imgSource: action.value
					};
				default: 
					return {...prevState }
			}
		}, {
			textRecognitionValue: '',
			imgRecognition: [],
			processedValue: '',
			imgSource: ''

		}
	);
	const onPressWithParrams = key => {
		navidation.navigate('', {});
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={{ paddingVertical: 15 }}>
				<View style={styles.itemWrap}>
					<TouchableOpacity
						style={styles.itemInner}
						onPress={ () => onPressWithParrams("") }
					>
						<Text style={[styles.textColor, styles.textSettingSize]}>Cấu hình điện nước</Text>
					</TouchableOpacity>
				</View>
				
			</ScrollView>

		</View>
	)
};

const DemoMLKitVision = () => {
	const { signOut } = useContext(authCt);
	const navidation = useNavigation();
	const [stateData, dispatchData] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'CHANGEIMG':
					return{
						...prevState,
						imgRecognition: action.value
					};
				case 'CHANGETEXT':
					return{
						...prevState,
						textRecognitionValue: action.value
					};
				case 'processed':
					return{
						...prevState,
						processedValue: action.value
					};
				case 'IMG_SOURCE':
					return{
						...prevState,
						imgSource: action.value
					};
				default: 
					return {...prevState }
			}
		}, {
			textRecognitionValue: '',
			imgRecognition: [],
			processedValue: '',
			imgSource: ''

		}
	);
	const _onChangeText = value => {
		dispatchData({type: 'CHANGETEXT', value})
	}
	const _onPressChoosePhoto = async () => {
		const options = {
			// multiple: true,
			// maxFiles: 10,
			compressImageMaxWidth: 1280,
			compressImageMaxHeight: 768,
			mediaType: "photo",
		};
		try {
			const images = await ImagePicker.openPicker(options);
			console.log(images);

			// Local path to file on the device
			const localFile = `${images.path}`;

			const processed = await processDocument(localFile);
			console.log('Finished processing file.');
			dispatchData({type: 'processed', value: processed})
			dispatchData({type: 'IMG_SOURCE', value: localFile})
			
		} catch (error) {
			alert(error);
		}
	};
	const _onPressTakePhoto = async () => {
		const options = {
			// multiple: true,
			// maxFiles: 10,
			compressImageMaxWidth: 1280,
			compressImageMaxHeight: 768,    
			mediaType: "photo",  
			cropping: true,
		};
		try {
			const images = await ImagePicker.openCamera(options);
			console.log(images);

			// Local path to file on the device
			const localFile = `${images.path}`;

			const processed = await processDocument(localFile);
			console.log('Finished processing file.');
			dispatchData({type: 'processed', value: processed})
			dispatchData({type: 'IMG_SOURCE', value: localFile})
		} catch (error) {
			alert(error);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={{ padding: 15 }}>
				<Button
					onPress={signOut}
					accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
				>
					Logout
      			</Button>
				<Input
					textStyle={styles.textInput}
					label="Ghi chú"
					placeholder=""
					value={stateData.textRecognitionValue}
					onChangeText={_onChangeText}
					textContentType="none"
					keyboardType="default"
				// multiline
				/>
				{
					!!stateData.imgSource && (
						<Image
							source={{ uri: stateData.imgSource }}
							style={[styles.imagePreview]}
						/>
					)
				}
				
				<Button
					onPress={_onPressChoosePhoto}
					accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
				>
					Ảnh từ máy
      			</Button>
				  <Button
					onPress={_onPressTakePhoto}
					accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
				>
					Chụp ảnh mới
      			</Button>
				{
					!!stateData.processedValue && <>
						<Text>
							{stateData.processedValue.text}
						</Text>
						
						{
							stateData.processedValue.blocks && stateData.processedValue.blocks.map(block => {
							return <Text> {block.text} </Text>
						})
						}
						
					</>	
				}
				
				
			</ScrollView>

		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.darkColor,
		flex: 1,
	},
	imagePreview: {
		aspectRatio: 1,
		height: 100,
		marginTop: 0,
		marginBottom: 5,
		borderRadius: 4,
		marginRight: 5,
	},
	itemWrap: {
		backgroundColor: 'rgba(28,28,30,.4)'
	},
	itemInner:{
		paddingHorizontal: 15,
		paddingVertical: 10,
		minHeight: 50,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center"
	},
	textColor: {
		color: "#fff",
		fontWeight: "bold"
	},
	textSettingSize: {
		fontSize: 16
	}
});

export default SettingScreen;

const processDocument = async (localPath) => {
	const processed = await vision().textRecognizerProcessImage(localPath);

	console.log('Found text in document: ', processed.text);

	processed.blocks.forEach(block => {
		console.log('Found block with text: ', block.text);
		console.log('Confidence in block: ', block.confidence);
		console.log('Languages found in block: ', block.recognizedLanguages);
	});
	return processed;
}
