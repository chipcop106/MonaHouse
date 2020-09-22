import React, { useContext, useReducer, useState } from 'react'
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Icon, Button, Input } from '@ui-kitten/components';
import Spinner from 'react-native-loading-spinner-overlay';
import { Context as AuthContext } from '~/context/AuthContext';
import { color, shadowStyle, sizes } from '~/config';

import { changePassword } from  '~/api/AccountAPI';
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'STATE_CHANGE': {
      return {
        ...state,
        [payload.field]: payload.value,
      };
      break;
    }

    default:
      return state;
      break;
  }
};

const SettingChangePasswordScreen = ({ navigation, route = {} }) => {
  const [state, dispatch] = useReducer(reducer, route.params);
  const [spinner, setSpinner] = useState(false);
  const { signOut } = useContext(AuthContext);
  const _onSubmit = async () => {
    try {
      console.log(state);
      const { oldPassword, newPassword, renewPassword} = state;
      if(oldPassword.length === 0){
        Alert.alert('Mật khẩu cũ không được chừa trống',);
        return false;
      }
      if(newPassword.length === 0){
        Alert.alert('Mật khẩu mới không được chừa trống',);
        return false;
      }
      if(newPassword !== renewPassword){
        Alert.alert('Mật khẩu xác nhận không khớp',);
        return false;
      }

      setSpinner(true);
      const res = await changePassword({newpass: newPassword, oldpass: oldPassword});
      setSpinner(false);
      await new Promise(a => setTimeout(a, 300));
      if( res.Code === 1 ){
        Alert.alert('Thông báo', 'Cập nhật thành công !!', [
          { text: 'OK', onPress: () => navigation.pop() },
        ]);
      } else if( res.Code === 0 ){
        Alert.alert('Lỗi!!', res.Message);
      } else if( res.Code === 2 ){
        signOut();
        Alert.alert('Phiên làm việc của bạn đã hết, vui lòng đăng nhập lại !!',);
      } else {
        Alert.alert('Lỗi', 'dữ liệu  lỗi vui lòng liên hệ nhà cung cấp');
      }
    } catch (e) {
      setSpinner(false);
      await new Promise(a => setTimeout(a, 300));
      console.log('_onSubmit error', e);
      Alert.alert('Lỗi', JSON.stringify(e));
    }


  };


  const updateState = (field, value) => {
    dispatch({ type: 'STATE_CHANGE', payload: { field, value } });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{padding: 15}}>
        <View style={styles.secWrap}>
          <View style={styles.formGroup}>
            <Input
              returnKeyType={'done'}
              label={() => <Text style={styles.lbTxt}>Mật khẩu cũ</Text>}
              placeholder=""
              style={styles.inputControl}
              textStyle={styles.inputText}
              value={state.oldPassword}
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={(value) => updateState('oldPassword', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Input
              returnKeyType={'done'}
              label={() => <Text style={styles.lbTxt}>Mật khẩu mới</Text>}
              placeholder=""
              style={styles.inputControl}
              textStyle={styles.inputText}
              value={state.newPassword}
              autoCapitalize={'none'}
              secureTextEntry={true}
              onChangeText={(value) => updateState('newPassword', value)}
            />
          </View>
          <View style={[styles.formGroup, { paddingBottom: 15 }]}>
            <Input
              returnKeyType={'done'}
              label={() => <Text style={styles.lbTxt}>Nhập lại khẩu mới</Text>}
              placeholder=""
              style={[styles.inputControl]}
              textStyle={styles.inputText}
              autoCapitalize={'none'}
              value={state.renewPassword}
              secureTextEntry={true}
              onChangeText={(value) => updateState('renewPassword', value)}
            />
          </View>
        </View>
        <View style={styles.submitButton}>
          <Button
            onPress={_onSubmit}
            status="danger"
            size="giant"
            accessoryLeft={() => (
              <Icon
                name="sync"
                fill={color.whiteColor}
                style={sizes.iconButtonSize}
              />
            )}
            style={{ borderRadius: 0 }}
            textStyle={{ fontSize: 18 }}>
            Thay đổi mật khẩu
          </Button>
        </View>
      </KeyboardAwareScrollView>
      <Spinner
        visible={spinner}
        textContent={'Vui lòng chờ giây lát...'}
        textStyle={{ color: '#fff' }} />
    </View>
  );
};

export default SettingChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,

  },
  lbTxt: {
    color: '#444'
  },
  secWrap: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    ...shadowStyle
  },
  avatar: {
    width: 75,
    height: 75,
  },
  linkCarret: {
    width: 30,
    height: 30,
  },
  inputControl: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomColor: color.disabledTextColor,
  },
  inputText: {
    color: color.blackColor,
    marginLeft: 0,
  },
  formGroup: {
    // backgroundColor: color.darkShadowColor,
    padding: 15,
    paddingBottom: 0,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    position: 'relative',
  },
  upgradeText: {
    fontSize: 24,
    color: color.darkColor,
  },
  upgradeIcon: {
    width: 45,
    height: 45,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    right: 30,
  },
  userInfo: {
    alignItems: 'center',
    paddingTop: 15,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: color.primary,
    borderRadius: 4,
    marginLeft: 5,
  },
  name: {
    color: color.whiteColor,
    fontWeight: '600',
    fontSize: 18,
  },
  expiredDate: {
    color: color.whiteColor,
  },
  itemWrap: {
    backgroundColor: 'rgba(65,63,98,1)',
  },
  itemInner: {
    paddingHorizontal: 15,
    minHeight: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColor: {
    color: '#fff',
  },
  textSettingSize: {
    fontSize: 16,
  },
  settingIcon: {
    width: 35,
    height: 35,
  },
  linkText: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: color.lightWeight,

    paddingVertical: 15,
  },
  submitButton: {
    marginBottom: 30,
  },
});
