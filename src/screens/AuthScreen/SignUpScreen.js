import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVerifyCode, verifyCode } from '~/api/AccountAPI';
import { color } from '~/config';
import { Context as AuthContext } from '~/context/AuthContext';

const MAX_LENGTH_CODE = 6;
const SignUpScreen = () => {
  const { state: authState, verificationSuccessAction } = React.useContext(
    AuthContext
  );
  const navigation = useNavigation();
  const route = useRoute();
  const textInput = useRef();
  const [inputValue, setInputValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [enterCode, setEnterCode] = useState(false);
  const [spinner, setSpinner] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <RDheaderText />,
    });
  }, [navigation, route, enterCode]);
  React.useEffect(() => {
    if (enterCode && inputValue.length === MAX_LENGTH_CODE) {
      _verifyCode();
    }
  }, [inputValue]);

  const _getCode = async (isForget) => {

    try {
	    if(inputValue.length < 10) {

		    throw {
			    Message: 'Số điện thoại không hợp lệ'
		    }
	    }
	    setSpinner(true);
	    await new Promise((r) => setTimeout(r, 100));

      // call get verifications Code
      // 1 đăng kí, 2 quên mật khẩu
			let typeCode = ['', 'Register', 'ForgotPass'].indexOf(
				route.params.from.toString()
			);
	    if(isForget) {
		    typeCode = 2;
	    }
      const res = await getVerifyCode({
        phone: inputValue,
        typeVerify: typeCode,
      });

      if (res.err) throw res.err;
      if (res.Code !== 1) throw res;

      setPhoneValue(inputValue);
      setEnterCode(true);
      setInputValue('');

      setSpinner(false);
      await new Promise((r) => setTimeout(r, 100));
      // data: {Code: 1, Message: "Mã đã được gửi vào số điện thoại 0979047573", Data: "2020-07-10T22:52:43.9256102Z"}
      // Alert.alert('Gửi', "Chúng tôi gửi mã xác nhận vào số điện thoại của bạn !!", [{
      //     text: 'OK',
      //     onPress: () => textInput.current.focus()
      // }]);
      textInput.current.focus();
    } catch (err) {
      setSpinner(false);
      await new Promise((r) => setTimeout(r, 100));
      if (err.Message === 'Tài khoản đã tồn tại') {
	      Alert.alert('Oops!', `${!!err.Message ? err.Message : err}!!`, [
		      {
			      text: 'Trở về đăng nhập',
			      onPress: () => {
				      navigation.pop();
			      },
		      },
		      {
			      text: 'Quên mật khẩu',
			      onPress: () => {
				      _getCode(true);
			      },
		      },
	      ]);
      } else {
        Alert.alert('Oops!', `${!!err.Message ? err.Message : err}!!`);
      }
    }
  };
  const _verifyCode = async () => {
    setSpinner(true);
    await new Promise((r) => setTimeout(r, 100));

    console.log('_verifyCode', inputValue);
    try {
      // call verifications code
      const res = await verifyCode({
        phone: phoneValue,
        code: inputValue,
      });

      if (res.err) throw res.err;
      if (res.Code !== 1) throw res;
      textInput.current.blur();
      // Alert.alert('Thành công!', 'Số điện thoại đã được xác thực');
      await verificationSuccessAction(res.Data);
      setSpinner(false);
    } catch (err) {
      setSpinner(false);
      await new Promise((r) => setTimeout(r, 100));
      Alert.alert('Oops!', !!err.Message ? err.Message : err);
    }
  };

  const _onChangeText = async (text) => {
    setInputValue(text);
  };
  const _getSubmitAction = () => {
	  inputValue.length > 0 && (
		  enterCode ? _verifyCode() : _getCode()
	  );
	  inputValue.length === 0 && Alert.alert('Oops!!', `Bạn phải điền ${enterCode ? 'Mã xác thực' : 'số điện thoại'}` )

  };
  const _tryAgain = () => {
    setInputValue('');
    setEnterCode(false);
    textInput.current.focus();
  };

  const RDheaderText = () => (
    <Text style={styles.header}>{`Nhập ${
      enterCode ? 'Mã xác thực' : 'số điện thoại'
    }?`}</Text>
  );
  const RDbuttonText = () => (
    <Text style={styles.buttonText}>
      {enterCode ? 'Xác thực mã xác nhận' : 'Gửi mã xác nhận'}
    </Text>
  );
  const RDFooter = () => {
    if (enterCode)
      return (
        <View style={[{ marginTop: 15 }]}>
          <Text style={styles.wrongNumberText} onPress={_tryAgain}>
            Bấm vào đây nếu bạn nhập sai số hoặc cần mã mới ?
          </Text>
        </View>
      );

    return (
      <View style={[{ marginTop: 15 }]}>
        <Text style={styles.disclaimerText}>
          Bấm "Gửi mã xác nhận" ở trên, chúng tôi sẽ gửi bạn tin nhắn SMS để xác
          thực số điện thoại.
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.darkColor,
        paddingVertical: 15,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[{ paddingHorizontal: 15 }]}
          removeClippedSubviews={false}>
          {/* <RDheaderText /> */}
          <TextInput
            ref={textInput}
            name={enterCode ? 'code' : 'phoneNumber'}
            value={inputValue}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={_onChangeText}
            placeholder={enterCode ? '______' : 'Phone Number'}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            style={[
              styles.textInput,
              !enterCode && { letterSpacing: 0 },
              enterCode && {
                height: 50,
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 'bold',
                // fontFamily: 'Courier',
                letterSpacing: 15,
              },
            ]}
            returnKeyType="done"
            autoFocus
            placeholderTextColor={color.primary}
            selectionColor={color.primary}
            maxLength={enterCode ? 6 : 20}
            onSubmitEditing={_getSubmitAction}
          />
          <TouchableOpacity style={styles.button} onPress={_getSubmitAction}>
            <RDbuttonText />
          </TouchableOpacity>
          <RDFooter />
        </ScrollView>
      </KeyboardAvoidingView>
      <Spinner
        visible={spinner}
        textContent={'One moment...'}
        textStyle={{ color: '#fff' }}
      />
      <SafeAreaView />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#fff',
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: color.primary,
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  disclaimerText: {
    marginTop: 15,
    fontSize: 12,
    color: '#fff',
  },
});

export default SignUpScreen;
