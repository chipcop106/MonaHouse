import React, { useContext, useReducer, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import {
  Avatar,
  Input,
  Icon,
  Button,
  Datepicker,
  SelectItem,
  Select,
  IndexPath,
} from '@ui-kitten/components';
import { color, settings, shadowStyle, sizes } from '~/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Loading from '~/components/common/Loading';
import { Context as AuthContext } from '~/context/AuthContext';
import { getUserInfo, updateAccount } from '~/api/AccountAPI';
import moment from 'moment';
import { uploadIMG } from '~/components/IncludeElectrictWater'
import AsyncStorage from '@react-native-community/async-storage'
import Spinner from 'react-native-loading-spinner-overlay';

const initialState = {
  refreshing: false,
  loading: false,
	imageUploading: false,
  avatar: null,
  fullName: 'Lê Chân',
  phoneNumber: '0886706289',
  email: 'vietdat106@gmail.com',
  address: '319 c16, Lý Thường Kiệt, Phường 15, quậ 11, tp HCM',
  birthday: new Date(),
  cityName: '',
  cityId: '',
  oldPassword: '',
  newPassword: '',
  renewPassword: '',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'STATE_CHANGE': {
      return {
        ...state,
        [payload.field]: payload.value,
      };
      break;
    }
    case 'STATE_OVERWRITE': {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
      break;
  }
};
const noImageSrc = require('~/../assets/user.png');
const SettingUserDetailScreen = ({ navigation, route }) => {
  const headerHeight = useHeaderHeight();
  const { cityLists } = settings;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cityIndex, setCityIndex] = useState(new IndexPath(0));
  const [spinner, setSpinner] = useState(false);
  const { signOut } = useContext(AuthContext);
  const { refreshing, loading } = state;

  const _onSubmit = async () => {
    try {
      console.log(state);
      const params = {
        phone: state?.phoneNumber,
        name: state?.fullName,
        email: state?.email,
        birthday: state?.birthday,
        cityid: state?.cityId,
	      avatarId: state?.avatar?.ID ?? 0
      };
      console.log(params);
      setSpinner(true);

      const res = await updateAccount(params);
      setSpinner(false);
      await new Promise(a => setTimeout(a, 300));
      if( res.Code === 1 ){
      	Alert.alert('Cập nhật thành công !!','');
	      await _onRefresh();
        route.params.doReload();
      } else if( res.Code === 0 ){
	      Alert.alert('Oops!!', JSON.stringify(res));
      } else if( res.Code === 2 ){
      	signOut();
	      Alert.alert('Phiên làm việc của bạn đã hết, vui lòng đăng nhập lại !!','');
      } else {
      	Alert.alert('Lỗi', 'dữ liệu  lỗi vui lòng liên hệ nhà cung cấp');
      }

    } catch (e) {
      setSpinner(false);
      await new Promise(a => setTimeout(a, 300));
      console.log('_onSubmit error', e);
	    Alert.alert('Lỗi', JSON.stringify(e));
    }

    // Alert.alert('Thông báo', 'Cập nhật thành công !!');
  };

  const onPressWithParams = (key, params = {}) => {
    navigation.navigate(key, params);
  };

  const updateState = (field, value) => {
    dispatch({ type: 'STATE_CHANGE', payload: { field, value } });
  };

  const handleChoosePhoto = async (key) => {
	  updateState('imageUploading', true);
    try {
      const options = {
        cropping: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        maxFiles: 10,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        mediaType: 'photo',
      };
      const images = await ImagePicker.openPicker(options);
	    const rs = await uploadIMG(images);
	    console.log('uploadAvatarIMG rs', rs);
	    await updateState(key, rs[0]);

    } catch (error) {}
    updateState('imageUploading', false);
  };
  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo();

      if (res.Code === 1) {
        let userData = await AsyncStorage.getItem("userInfo");
        userData = JSON.parse(userData);
        await AsyncStorage.setItem(
          'userInfo',
          JSON.stringify({ ...userData, ...(res?.Data ?? {}) })
        );
        
        dispatch({
          type: 'STATE_OVERWRITE',
          payload: {
            avatar: res?.Data?.AvatarThumbnail || '',
            fullName: res?.Data?.FullName || '',
            phoneNumber: res?.Data?.Phone || '',
            email: res?.Data?.Email || '',
            address: res?.Data?.Address || '',
            cityId: res?.Data?.CityID || '',
            cityName: res?.Data?.CityName || '',
            birthday: res?.Data?.Birthday || '',
          },
        });
        const selectedCityIndex = cityLists.findIndex((item) => {
          return res?.Data?.CityID === item.ID;
        });
        setCityIndex(new IndexPath(selectedCityIndex));
      } else if (res.Code === 2) {
        signOut();
        Alert.alert('Oops!!', 'Phiên làm việc đã hết vui lòng đăng nhập lại');
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.parse(res));
      } else {
        Alert.alert('Oops!!', JSON.parse(res));
      }
    } catch (e) {
      console.log('loadUserInfo error', e);
    }
  };
  React.useEffect(() => {
    // console.log(state);
    (async () => {
      updateState('loading', true);
      await loadUserInfo();
      updateState('loading', false);
    })();
  }, []);
  const _onRefresh = async () => {
    updateState('refreshing', true);
    await loadUserInfo();
    updateState('refreshing', false);
  };
  return (
    <>
      {!!loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      ) : (
        <KeyboardAwareScrollView
          extraHeight={headerHeight + 60}
          style={[styles.container, {  }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={_onRefresh}
              tintColor={'#444'}
            />
          }>
          <View style={styles.secWrap}>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={() => handleChoosePhoto('avatar')} disabled={state.imageUploading}>
                <Avatar
                  source={!!state.avatar ? { url: state.avatar?.UrlIMG ?? state.avatar } : noImageSrc}
                  shape="round"
                  size="giant"
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.userName}>
                <Text style={[styles.name, styles.textColor]}>
                  {state.fullName}
                </Text>
                {/*<View style={styles.badge}>*/}
                {/*  <Text*/}
                {/*    style={{*/}
                {/*      fontWeight: 'bold',*/}
                {/*      color: color.darkColor,*/}
                {/*    }}>*/}
                {/*    Premium*/}
                {/*  </Text>*/}
                {/*</View>*/}
              </View>
            </View>
            <Button
              style={{
                paddingHorizontal: 15,
                marginHorizontal: 15,
                marginTop: -20,
                borderRadius: 6,
                minHeight: 48,
                marginBottom: 10,
                backgroundColor: '#F8604C',
                borderColor: '#F8604C',
                ...shadowStyle,
              }}
              onPress={() => onPressWithParams('SettingPremiumPackage', state)}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                Hết hạn: <Text style={{ fontWeight: 'bold' }}>03/02/2020</Text>
              </Text>
            </Button>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={'done'}
                label="Họ và tên"
                placeholder="Full name"
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.fullName}
                onChangeText={(value) => updateState('fullName', value)}
              />
            </View>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={'done'}
                disabled
                label="Số điện thoại"
                placeholder="Phone"
                style={[styles.inputControl, styles.disabledInput]}
                textStyle={[
                  styles.inputText,
                  { color: color.primary, fontWeight: 'bold' },
                ]}
                value={state.phoneNumber}
                keyboardType="numeric"
                accessoryRight={() => (
                  <>
                    <Icon
                      name="lock"
                      fill={color.primary}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </>
                )}
              />
            </View>
            <View style={styles.formGroup}>
              <Datepicker
                label="Ngày sinh"
                date={moment(state.birthday, 'DD/MM/YYYY').toDate()}
                max={new Date()}
                // min={  }
                dataService={settings.formatDateService}
                onSelect={(nextDate) =>
                  updateState('birthday', moment(nextDate).format('DD/MM/YYYY'))
                }
                style={[{ backgroundColor: 'transparent', borderWidth: 0 }]}
              />
            </View>
            <View style={[styles.formGroup, {}]}>
              <Input
                returnKeyType={'done'}
                label="Email"
                placeholder="email"
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.email}
                onChangeText={(value) => updateState('email', value)}
                keyboardType="email-address"
              />
            </View>
            <View style={[styles.formGroup, { marginBottom: 5 }]}>
              <Select
                label="Thành phố"
                value={
                  cityLists[cityIndex?.row ?? 0]?.CityName ?? 'Chọn thành phố'
                }
                selectedIndex={cityIndex}
                onSelect={(index) => {
                  setCityIndex(index);
	                updateState( 'cityId', cityLists[index.row].ID)
                }}>
                {!!cityLists
                  ? cityLists.map((option) => (
                      <SelectItem key={option.ID} title={option.CityName} />
                    ))
                  : null}
              </Select>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.btnGray, { marginBottom: 20, marginTop: -5 }]}
            onPress={() => onPressWithParams('SettingChangePassword', state)}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="shield-outline"
                fill={color.disabledTextColor}
                style={styles.settingIcon}
              />
              <Text style={[{ color: '#000', fontSize: 16 }]}>
                Thay đổi mật khẩu
              </Text>
            </View>
            <Icon
              name="chevron-right"
              fill={color.disabledTextColor}
              style={styles.linkCarret}
            />
          </TouchableOpacity>
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
              style={{ borderRadius: 6 }}
              textStyle={{ fontSize: 18 }}>
              Cập nhật tài khoản
            </Button>
          </View>
          <Spinner
            visible={spinner}
            textContent={'Vui lòng chờ giây lát...'}
            textStyle={{ color: '#fff' }} />
        </KeyboardAwareScrollView>
      )}
    </>
  );
};

export default SettingUserDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,
    padding: 15,
  },
  secWrap: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 6,
    minHeight: 40,
    padding: 5,
    ...shadowStyle,
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
    borderBottomColor: '#c1c1c1',
  },
  inputText: {
    color: '#000',
    marginLeft: 0,
  },
  formGroup: {
    backgroundColor: '#fff',
    padding: 10,
    paddingVertical: 7,
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
    // color: color.darkColor,
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
    padding: 15,
    paddingHorizontal: 20,
    margin: -5,
    backgroundColor: '#D1D1D1',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: color.primary,
    borderRadius: 4,
    marginLeft: 5,
  },
  name: {
    // color: color.whiteColor,
    fontWeight: '600',
    fontSize: 18,
  },
  btnGray: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1D1D1',
    borderRadius: 6,
    borderColor: '#D1D1D1',
    ...shadowStyle,
  },
  settingIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  disabledInput: {
    // backgroundColor: color.darkShadowColor,
  },
  submitButton: {
    marginBottom: 30,
  },
});
