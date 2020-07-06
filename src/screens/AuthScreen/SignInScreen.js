import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, 
    ActivityIndicator, SafeAreaView, Platform, KeyboardAvoidingView, TouchableOpacity, Image, Linking, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Button, Input, Icon} from '@ui-kitten/components';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Context as AuthContext } from './../../context/AuthContext';
import { color } from '~/config';
import { Formik, useFormikContext } from 'formik';
import { SignInData, SignInSchema } from '~/data/signinModal'
const LoadingIndicator  = () => <ActivityIndicator color="#fff" />

const SignInScreen = ({route}) => {
    const { authState, signIn, clearErrorMessage } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [phoneNumber, setphoneNumber] = useState('');
    navigation.setOptions({
        headerShown: false,
    })
    
    // useEffect(() =>{
    //     const listener = navigation.addListener('blur',clearErrorMessage);
    //     return () =>{
    //         listener.remove();
    //     }
    // },[])
    // const onPressLogin = async () => {
    //     setLoading(true);
    //     await signIn(username, password);
    //     console.log(authState);
    //     setLoading(false);
    // }
    const _touchForgot = () => {
        navigation.navigate('ForgotPass', {})
    }
    const _onPressRegister = () => {
        navigation.navigate('SignUp', {})
    }
    const onPressContact = () => {
        if(phoneNumber){
            Linking.openURL(`tel:${phoneNumber}`)
        } else {
            Alert.alert('Thông báo', 'Chức năng đang trong quá trình xây dựng')
        }
       
    }
    const _onFormSubmit = values => {
        console.log(values);
    }
    const RenderForm = props => {
        
        return <>
            <View style={styles.formGroup}>
                <InputValidate
                    label={ txtprops => <Text {...txtprops}  style={styles.label} >Username:</Text> }
                    id='username'
                    // value={username}
                    // onChangeText={(value) => setUsername(value)}
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    editable={!loading}
                />
            </View>
            <View style={styles.formGroup}>
                <InputValidate
                    secureTextEntry={true}
                    label={ txtprops => <Text  {...txtprops} style={styles.label} >Password:</Text>}
                    id='password'
                    // value={password}
                    // onChangeText={(value) => setPassword(value)}
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    editable={!loading}
                />
            </View>
            <View style={[styles.formGroup, {flexDirection: "row-reverse"}]}>
                <TouchableOpacity onPress={_touchForgot}>
                    <Text style={styles.forgotPassTxt}>Quên mật khẩu</Text>
                </TouchableOpacity>
            </View>
            {(authState && authState.errorMessage) ? (<Text styles={styles.label}>{authState.errorMessage}</Text>) : null}
            <Button
                style={styles.btnLogin}
                onPress={props.handleSubmit}
                accessoryRight={loading ? LoadingIndicator : null}
            > {loading ? `ĐANG XỬ LÝ` : `ĐĂNG NHẬP`} </Button>
        </>
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: color.darkColor}}>
            
            <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}
                >
            <ScrollView contentContainerStyle={[{flexGrow: 1, justifyContent: "center", paddingHorizontal: 15}]} removeClippedSubviews={false}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Image
                        resizeMode="contain"
                        source={require('~/../assets/logo-vertical.png')}
                        style={{ width: 250, height: 70 }}
                    />
                </View>
                <View style={styles.formWrap}>
                    <Formik 
                        initialValues={SignInData.empty()}
                        validationSchema={SignInSchema}
                        onSubmit={_onFormSubmit}
                    >
                        { RenderForm }
                    </Formik>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.btmText}>Bạn chưa có tài khoản?  
                        <Text 
                            onPress={_onPressRegister}
                            style={{color:color.primary, fontWeight: "bold", textDecorationStyle: "solid"}}
                        > Đăng ký mới</Text>
                    </Text>
                </View>
                <View style={styles.formGroup}>
                    
                        <Button
                            style={styles.btnContact}
                            onPress={onPressContact}
                        > Liên hệ với chúng tôi </Button>
                   
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
const AlertTriangleIcon = (style) => (
    <Icon {...style} name='alert-triangle-outline'/>
);
  
const InputValidate = props => {
    const formContext = useFormikContext();
    const { id } = props;
    const { [id]: error } = formContext.errors;
    const fieldProps= {
        status: error && 'danger',
        captionIcon: error && AlertTriangleIcon,
    };
    
    return (
        <Input
            {...props}
            {...fieldProps}
            caption={error}
            onChangeText={formContext.handleChange(props.id)}
        />
    );
}
const styles = StyleSheet.create({
    // input: {
    //     padding: 10,
    //     borderWidth: 1,
    //     borderColor: "#000"
    // },
    label:{
        marginBottom: 5,
        fontWeight: "normal",
        fontSize: 15
    },
    formGroup: {
        marginBottom: 15
    },
    container: {
        padding: 15,
    },
    formWrap: {
        alignItems: "stretch",
        padding: 15,
        paddingVertical: 30,
        backgroundColor: "#fff",
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 15,
    },
    forgotPassTxt: {
        color: color.primary,
        fontWeight: "bold",
        textAlign: "right"
    },
    btmText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center"
    },
    btnLogin: {
        borderRadius: 30
    },
    btnContact: {
        borderRadius: 30,
        paddingVertical: 15,
        backgroundColor: color.redColor,
        borderColor: color.redColor,
    }
});

export default SignInScreen;
