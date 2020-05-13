import React,{useEffect, useContext} from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {Context as AuthContext} from '../../context/AuthContext';
const WelcomeScreen = ({navigation}) => {
    const {state,signInLocalToken} = useContext(AuthContext);
    console.log('Screen Log');
    console.log(state);
    useEffect(() => {
        signInLocalToken();
    }, [])
    return <View><Text style={{fontSize:48}}>Welcome Screen</Text></View>;
}

const styles = StyleSheet.create({

});

export default WelcomeScreen;
