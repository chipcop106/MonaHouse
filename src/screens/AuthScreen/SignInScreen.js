import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Button, 
    ActivityIndicator
} from 'react-native';
import { Context as AuthContext } from './../../context/AuthContext';
const SignInScreen = ({navigation, route}) => {
    const { authState, signIn, clearErrorMessage } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // useEffect(() =>{
    //     const listener = navigation.addListener('blur',clearErrorMessage);
    //     return () =>{
    //         listener.remove();
    //     }
    // },[])
    return (
        <View style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    editable={!loading}
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    secureTextEntry={true}
                    label="Password"
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    editable={!loading}
                />
            </View>
            {(authState && authState.errorMessage) ? (<Text styles={styles.label}>{authState.errorMessage}</Text>) : null}
            <Button
                title="Đăng nhập"
                onPress={()=>{
                    signIn(username, password);
                    console.log(authState);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#000"
    },
    label:{
        marginBottom:5,
    },
    formGroup: {
        marginBottom: 15
    },
    container: {
        padding: 15
    }
});

export default SignInScreen;
