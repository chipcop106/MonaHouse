import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import instance,{getAccessToken} from '../api/instanceAPI';
import AsyncStorage from '@react-native-community/async-storage';
import {
    getPhoneHelp,
    registerAccount,
    loginAccount,
    getCity,
    forgotPassword,
    updateAccount
} from '../api/AccountAPI';
import {
    createMotel,
    updateMotel,
    getMotels,
    getMotelById,
    createRoom,
    getOptionsSortRoom,
    getRoomsByMotelId,
    getRoomById,
    updateRoom,
    deleteRoom
} from '../api/MotelAPI';

// let loginData = {
//     "username":"0886706289",
//     "password":"0087"
// }
let data = {
        "roomid": 2326
    };    
const TestApiScreen = () =>{
    const fetchData = async (params) => {
        const res = await deleteRoom(params);
        console.log(res);
    }
    
    useEffect(() => {
        AsyncStorage.setItem('token','10387Jn6OXL6A0wqdYWMvgRsv9bt5udwSHAD5MCppqjyBIBgHJZdxVf2ksY7s4Ae4Zo30svRWrhF6cqn84lvVA87lIdMyF6vpF4mdIqY');
        fetchData(data);
    }, [])

    return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text>Hello test API</Text>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})

export default TestApiScreen;