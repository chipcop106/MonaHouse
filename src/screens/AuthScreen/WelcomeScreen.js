import React,{useEffect, useContext} from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import {Context as AuthContext} from '../../context/AuthContext';
const WelcomeScreen = ({navigation}) => {
    const {state,signInLocalToken} = useContext(AuthContext);
    console.log('AuthContext', state);
    useEffect(() => {
        signInLocalToken();
    }, [])
    return <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large" />
        </View>;
}

const styles = StyleSheet.create({

});

export default WelcomeScreen;
