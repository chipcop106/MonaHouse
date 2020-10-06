import React, { useContext, useState, useEffect, memo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, Icon } from '@ui-kitten/components';
import {
  ScrollView,
} from 'react-native-gesture-handler';
import { Context as AuthContext } from '~/context/AuthContext';
import { color } from '~/config';
import { Formik } from 'formik';
import { SignInData, SignInSchema } from './data/signinModal';
import { InputValidate } from '~/components/common/InputValidate';
import { settings } from '~/config';
import AsyncStorage from '@react-native-community/async-storage';

const LoadingIndicator = () => <ActivityIndicator color="#fff" />;

const SignInScreen = ({ route }) => {
  const { state: authState, signIn, clearErrorMessage } = useContext(
    AuthContext
  );
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [phoneNumber, setphoneNumber] = useState('');
  const [userName, setUserName] = useState({value: '', isLoad: true});
  navigation.setOptions({
    headerShown: false,
  });
  useEffect(() => {
    setphoneNumber(settings.phoneHelp);
    ( async () => {
      const asyUsername = await AsyncStorage.getItem('username');
      console.log('asyUsername', asyUsername)
      !!asyUsername && setUserName({value: asyUsername, isLoad: false});
      !!!asyUsername && setUserName({value: '', isLoad: false});
    } )();
  }, []);
  useEffect(() => {
    if (!!authState?.errorMessage) {
      Alert.alert('Thông báo', authState.errorMessage);
    }
  }, [authState]);
  // const onPressLogin = async () => {
  //     setLoading(true);
  //     await signIn(username, password);
  //     console.log(authState);
  //     setLoading(false);
  // }
  const _touchForgot = () => {
    // navigation.navigate('ForgotPass', {}) // ForgotPass
    navigation.navigate('SignUp', { from: 'ForgotPass' }); // ForgotPass
  };
  const _onPressRegister = () => {
    navigation.navigate('SignUp', { from: 'Register' });
  };
  const onPressContact = () => {
    if (!!phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
    }
  };
  const _onFormSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    await signIn(values.username, values.password);
    console.log(authState);
    setLoading(false);
  };
  const RenderForm = (props) => {
    return (
      <>
        <View style={styles.formGroup}>
          <InputValidate
            label={(txtprops) => (
              <Text {...txtprops} style={styles.label}>
                Username:
              </Text>
            )}
            name="username"
            id="username"
            // value={username}
            // onChangeText={(value) => setUsername(value)}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            disabled={loading}
          />
        </View>
        <View style={styles.formGroup}>
          <InputValidate
            secureTextEntry={true}
            label={(txtprops) => (
              <Text {...txtprops} style={styles.label}>
                Password:
              </Text>
            )}
            name="password"
            id="password"
            // value={password}
            // onChangeText={(value) => setPassword(value)}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            disabled={loading}
          />
        </View>
        <View style={[styles.formGroup, { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={_touchForgot}>
            <Text style={styles.forgotPassTxt}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
        {/* {(authState && authState.errorMessage) ? (<Text styles={styles.label}>{authState.errorMessage}</Text>) : null} */}
        <Button
          style={styles.btnLogin}
          onPress={props.handleSubmit}
          accessoryRight={loading ? LoadingIndicator : null}>
          {' '}
          {loading ? `ĐANG XỬ LÝ` : `ĐĂNG NHẬP`}{' '}
        </Button>
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.darkColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 15 },
          ]}
          removeClippedSubviews={false}>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Image
              resizeMode="contain"
              source={require('~/../assets/logo-vertical.png')}
              style={{ width: 250, height: 70 }}
            />
          </View>
          <View style={styles.formWrap}>
            {!!!userName.isLoad && <Formik
              initialValues={{ username: userName.value, password: '' }}
              validationSchema={SignInSchema}
              onSubmit={_onFormSubmit}>
              {RenderForm}
            </Formik>}

          </View>
          <View style={styles.formGroup}>
            <Text style={styles.btmText}>
              Bạn chưa có tài khoản?
              <Text
                onPress={_onPressRegister}
                style={{
                  color: color.primary,
                  fontWeight: 'bold',
                  textDecorationStyle: 'solid',
                }}>
                Đăng ký mới
              </Text>
            </Text>
          </View>
          <View style={styles.formGroup}>
            <Button style={styles.btnContact} onPress={onPressContact}>
              {!!!phoneNumber ? (
                <LoadingIndicator />
              ) : (
                `Liên hệ với chúng tôi`
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // input: {
  //     padding: 10,
  //     borderWidth: 1,
  //     borderColor: "#000"
  // },
  label: {
    marginBottom: 5,
    fontWeight: 'normal',
    fontSize: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  container: {
    padding: 15,
  },
  formWrap: {
    alignItems: 'stretch',
    padding: 15,
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 5,
  },
  forgotPassTxt: {
    color: color.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  btmText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  btnLogin: {
    borderRadius: 5,
  },
  btnContact: {
    borderRadius: 5,
    paddingVertical: 15,
    backgroundColor: color.redColor,
    borderColor: color.redColor,
  },
});

export default SignInScreen;
