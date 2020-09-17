import React, {
  useReducer,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Input, Icon, Button } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '~/components/common/Loading';
import ServiceList from './settingComp/ServiceList';
import { Context as AuthContext } from '~/context/AuthContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { settings, color, sizes, shadowStyle } from '~/config';
import { getMotels, updateMotel, getMotelById } from '~/api/MotelAPI';

const reducer = (prevState, { type, value }) => {
  switch (type) {
    case 'SET_STATE':
      return {
        ...prevState,
        ...value,
      };
    default:
      return prevState;
  }
};
const initialState = {
  isLogout: false,
  waterPrice: '',
  electrictPrice: '',
  roomPrice: '',
  address: '',
  motelName: '',
  description: '',
  owner: '',
  ownerPhone: '',
  preWaterPrice: '',
  preElectrictPrice: '',

  isAlertVisible: false,
};

const SettingHouseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ID: motelid, MotelName, Address, Description } = route.params?.data;
  const { signOut } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setloading] = useState(false);
  const [isRefesh, setrefesh] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { maxWidth: 240, color: '#fff' }
    });
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${state.motelName || MotelName}`,
    });
  }, [state.motelName]);
  useEffect(() => {
    (async () => {
      setloading(true);
      await loadData();
      setloading(false);
    })();
    return () => {};
  }, []);
  const updateState = (value) => {
    dispatch({ type: 'SET_STATE', value });
  };
  const _onSubmit = async () => {
    try {
      console.log(state);
      const addonRender = () => {
        let rs = [];
        try {
          //[{ ID: 0, Name: "", Price: "" }]
          rs = state.addons.map(item => {
           if(item.name.trim().length > 0){
             return { ID: 0, Name: item.name, Price: item.price || 0 }
           }
          });
        } catch (e) {
          console.log('addonRender', e);
        }
        return rs;
      }
      const params = {
        motelid: motelid,
        motelname: state.motelName,
        address: state.address,
        description: state.description,
        motelIMG: '',
        addons: JSON.stringify(addonRender())
      };
      console.log('_onSubmit params', params);
      // const res = await updateMotel(params);

      // Alert.alert('Thông báo', 'Cập nhật thành công !!', [
      //   {
      //     text: 'Trở về',
      //     onPress: () => {
      //       navigation.pop();
      //     },
      //   },
      // ]);
    } catch (error) {}
  };

  const loadData = async () => {
    try {
      const res = await  getMotelById({motelid});
      if (res.Code === 2) {
        Alert.alert('Thông báo', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!');
      } else if (res.Code === 1 && !!res.Data) {
        const { Data }  =  res;
        updateState({
          address: Data?.Address ?? '',
          description: Data?.Description ?? '',
          motelName: Data?.MotelName ?? ''
        });
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(res));
      } else {
        Alert.alert('Oops!!', JSON.stringify(res));
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Oops!!', JSON.stringify(error));
    }
  };
  const _onRefresh = async () => {
    setrefesh(true);
    await loadData();
    setrefesh(false);
  };

  const LogoutRender = () => {
    signOut();
    return <></>;
  };
  const _onChangeServices = (services) => {
    console.log(services);
    updateState({
      addons: services
    })
  }
  return (
    <View style={styles.container}>
      {!!state.isLogout && <LogoutRender />}
      {!!isLoading && (
        <View style={{ flex: 1, alignItems: 'center', padding: 15 }}>
          <Loading />
        </View>
      )}
      {!!!isLoading && (
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 15 }}
          refreshControl={
            <RefreshControl onRefresh={_onRefresh} refreshing={isRefesh} />
          }>
          <>
          {/*<View style={styles.secWrap}>*/}
          {/*  <View style={styles.formGroup}>*/}
          {/*    <Text>*/}
          {/*      có 2 loại chính chủ/thuê lại, nếu là "thuê lại" có thêm field:*/}
          {/*      Tên chủ nhà, sdt chủ nhà, giá thuê gốc, giá điện /kw, giá nước*/}
          {/*      /m3*/}
          {/*      /!* owner: "",*/}
          {/*      ownerPhone: "",*/}
          {/*      preWaterPrice: "",*/}
          {/*      preElectrictPrice: "" *!/*/}
          {/*    </Text>*/}
          {/*  </View>*/}
          {/*  <View style={styles.formGroup}>*/}
          {/*    <Input*/}
          {/*      label={(props) => (*/}
          {/*        <Text {...props} style={[...props.style, styles.lbInput]}>*/}
          {/*          Tên chủ nhà:*/}
          {/*        </Text>*/}
          {/*      )}*/}
          {/*      placeholder="0"*/}
          {/*      style={styles.inputControl}*/}
          {/*      textStyle={styles.inputText}*/}
          {/*      value={state.owner}*/}
          {/*      onChangeText={(value) => updateState({ owner: value })}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={styles.formGroup}>*/}
          {/*    <Input*/}
          {/*      label={(props) => (*/}
          {/*        <Text {...props} style={[...props.style, styles.lbInput]}>*/}
          {/*          Số Phone chủ nhà:*/}
          {/*        </Text>*/}
          {/*      )}*/}
          {/*      placeholder="0"*/}
          {/*      style={styles.inputControl}*/}
          {/*      textStyle={styles.inputText}*/}
          {/*      value={state.ownerPhone}*/}
          {/*      onChangeText={(value) => updateState({ ownerPhone: value })}*/}
          {/*      keyboardType={'number-pad'}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={styles.formGroup}>*/}
          {/*    <Input*/}
          {/*      label={(props) => (*/}
          {/*        <Text {...props} style={[...props.style, styles.lbInput]}>*/}
          {/*          Giá điện thuê lại:*/}
          {/*        </Text>*/}
          {/*      )}*/}
          {/*      placeholder="0"*/}
          {/*      style={styles.inputControl}*/}
          {/*      textStyle={styles.inputText}*/}
          {/*      value={state.preElectrictPrice}*/}
          {/*      onChangeText={(value) =>*/}
          {/*        updateState({ preElectrictPrice: value })*/}
          {/*      }*/}
          {/*      keyboardType={'number-pad'}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={styles.formGroup}>*/}
          {/*    <Input*/}
          {/*      label={(props) => (*/}
          {/*        <Text {...props} style={[...props.style, styles.lbInput]}>*/}
          {/*          Giá nước thuê lại:*/}
          {/*        </Text>*/}
          {/*      )}*/}
          {/*      placeholder="0"*/}
          {/*      style={styles.inputControl}*/}
          {/*      textStyle={styles.inputText}*/}
          {/*      value={state.preWaterPrice}*/}
          {/*      onChangeText={(value) => updateState({ preWaterPrice: value })}*/}
          {/*      keyboardType={'number-pad'}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={[styles.formGroup, { paddingBottom: 15 }]} />*/}
          {/*</View>*/}
          </>
          <View style={styles.secWrap}>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={"done"}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Tên nhà trọ:
                  </Text>
                )}
                placeholder="0"
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.motelName}
                onChangeText={(value) => updateState({ motelName: value })}
              />
            </View>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={"done"}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Địa chỉ nhà:
                  </Text>
                )}
                placeholder="0"
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.address}
                onChangeText={(value) => updateState({ address: value })}
              />
            </View>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={"done"}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Mô tả:
                  </Text>
                )}
                placeholder="0"
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.description}
                // keyboardType={'number-pad'}
                onChangeText={(value) => updateState({ description: value })}
              />
            </View>
            {/*<View style={styles.formGroup}>*/}
            {/*  <Input*/}
            {/*    label={(props) => (*/}
            {/*      <Text {...props} style={[...props.style, styles.lbInput]}>*/}
            {/*        Giá phòng mặc định*/}
            {/*      </Text>*/}
            {/*    )}*/}
            {/*    placeholder="0"*/}
            {/*    style={styles.inputControl}*/}
            {/*    textStyle={styles.inputText}*/}
            {/*    value={state.roomPrice}*/}
            {/*    keyboardType={'number-pad'}*/}
            {/*    onChangeText={(value) => updateState({ roomPrice: value })}*/}
            {/*  />*/}
            {/*</View>*/}
            {/*<View style={styles.formGroup}>*/}
            {/*  <Input*/}
            {/*    label={(props) => (*/}
            {/*      <Text {...props} style={[...props.style, styles.lbInput]}>*/}
            {/*        Giá nước / m3*/}
            {/*      </Text>*/}
            {/*    )}*/}
            {/*    placeholder="0"*/}
            {/*    style={styles.inputControl}*/}
            {/*    textStyle={styles.inputText}*/}
            {/*    value={state.waterPrice}*/}
            {/*    keyboardType={'number-pad'}*/}
            {/*    onChangeText={(value) => updateState({ waterPrice: value })}*/}
            {/*  />*/}
            {/*</View>*/}
            {/*<View style={[styles.formGroup, {}]}>*/}
            {/*  <Input*/}
            {/*    label={(props) => (*/}
            {/*      <Text {...props} style={[...props.style, styles.lbInput]}>*/}
            {/*        Giá điện / kW*/}
            {/*      </Text>*/}
            {/*    )}*/}
            {/*    placeholder="0"*/}
            {/*    style={styles.inputControl}*/}
            {/*    textStyle={styles.inputText}*/}
            {/*    value={state.electrictPrice}*/}
            {/*    keyboardType={'number-pad'}*/}
            {/*    onChangeText={(value) => updateState({ electrictPrice: value })}*/}
            {/*  />*/}
            {/*</View>*/}

          </View>
          <View style={styles.submitActions} />
          <ServiceList onChange={_onChangeServices} />
        </KeyboardAwareScrollView>
      )}
      {!!!isLoading && (
        <View style={[{ paddingVertical: 15 }]}>
          <Button
            onPress={_onSubmit}
            accessoryLeft={() => (
              <Icon
                name="sync"
                fill={color.whiteColor}
                style={sizes.iconButtonSize}
              />
            )}
            style={styles.submitButton}
            textStyle={{ fontSize: 18 }}>
            Cập nhật
          </Button>
        </View>
      )}

    </View>
  );
};

export default SettingHouseDetailScreen;

const styles = StyleSheet.create({
  emtyTxt: {
    fontSize: 24,
    color: 'gray',
    textAlign: 'center',
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: color.bgmain,
  },
  secWrap: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 30,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 6,
    ...shadowStyle,
  },
  inputControl: {
    // backgroundColor: "transparent",
    // borderColor: "transparent",
    // borderWidth: 0,
    // borderRadius: 0,
    // borderBottomColor: color.lightWeight,
  },
  inputText: {
    color: '#000',
    marginLeft: 0,
  },
  formGroup: {
    padding: 15,
    paddingBottom: 0,
  },
  submitActions: {
    marginHorizontal: 15,
  },
  submitButton: {
    height: 48,
  },
  lbInput: {
    color: '#000',
    fontWeight: 'normal',
    fontSize: 14,
  },
});
