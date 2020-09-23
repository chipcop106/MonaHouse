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
import {
  getMotels,
  updateMotel,
  getMotelById,
  createMotelOne,
  deleteMotel,
} from '~/api/MotelAPI';
import Spinner from 'react-native-loading-spinner-overlay';

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
  electricPrice: '',
  roomPrice: '',
  address: '',
  motelName: '',
  description: '',
  owner: '',
  ownerPhone: '',
  preWaterPrice: '',
  preElectricPrice: '',
  isAlertVisible: false,
  addons: [],
};

const SettingHouseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getListMotels } = useContext(MotelContext);
  const { isAddMotel } = route.params;
  const { ID: motelid, MotelName, Address, Description } = route.params?.data;
  const { signOut } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setloading] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [spinner, setSpinner] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { maxWidth: 240, color: '#fff' },
      headerRight: () =>
        !isAddMotel ? (
          <Button
            accessoryRight={()=> <Icon
              name="trash-2-outline"
              fill={color.redColor}
              style={{width: 20, height: 20}}
            />}
            status={'danger'}
            appearance={'ghost'}
            onPress={_onPressRemove}>
            <Text style={{fontSize: 16, fontWeight: 'normal'}}>Xoá</Text>
          </Button>
        ) : null,
    });
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${state.motelName || MotelName || 'Thêm nhà'}`,
    });
  }, [state.motelName]);
  useEffect(() => {
    !!!isAddMotel &&
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
  const _onPressRemove = () => {
    Alert.alert(
      'Cảnh báo !',
      'Bạn có chắc chắn xoá nhà này ??',
      [
        {
          text: 'Tôi chắc chắn',
          style: 'destructive',
          onPress: actionRemoveMotel,
        },
        {
          text: 'Hủy thao tác',

          onPress: () => console.log('Cancel Pressed'),
        },
      ],
      { cancelable: false }
    );
  };
  const actionRemoveMotel = async () => {

    try {
      setSpinner(true);
      const res = await deleteMotel({motelid});
      setSpinner(false);
      await new Promise((a) => setTimeout(a, 300));
      if (res.Code === 1) {
        Alert.alert(
          'Thông báo',
          `xoá thành công !!`,
          [
            {
              text: 'Trở về',
              onPress: () => {
                getListMotels();
                navigation.pop();
              },
            },
          ]
        );
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(res));
      } else if (res.Code === 2) {
        signOut();
        Alert.alert(
          'Phiên làm việc của bạn đã hết, vui lòng đăng nhập lại !!',
          ''
        );
      } else {
        Alert.alert('Lỗi', 'Dữ liệu  lỗi vui lòng liên hệ nhà cung cấp');
      }


    } catch (e) {
      console.log('actionRemoveMotel error', e);

    }

  }
  const _onSubmit = async () => {
    if (state.motelName.trim().length === 0) {
      Alert.alert('Tên nhà không được chừa trống');
      return false;
    }
    try {
      console.log(state);
      const addonRender = () => {
        let rs = [];
        try {
          //[{ ID: 0, Name: "", Price: "" }]
          rs = state.addons.map((item) => {
            if (item.name.trim().length > 0) {
              if (!!item.ID) {
                return { ID: item.ID, Name: item.name, Price: item.price || 0 };
              } else {
                return { ID: 0, Name: item.name, Price: item.price || 0 };
              }
            }
          });
        } catch (e) {
          console.log('addonRender', e);
        }
        return rs;
      };
      const params = {
        motelid: motelid,
        motelname: state.motelName,
        address: state.address,
        description: state.description,
        addons: JSON.stringify(addonRender()),
      };
      isAddMotel && delete params.motelid;
      console.log('_onSubmit params', params);
      let res = null;
      setSpinner(true);
      if (!!isAddMotel) {
        // add new
        res = await createMotelOne(params);
      } else {
        // update
        res = await updateMotel(params);
      }
      setSpinner(false);
      await new Promise((a) => setTimeout(a, 300));
      if (!!!res) {
        Alert.alert('Lỗi', 'Dữ liệu  lỗi vui lòng liên hệ nhà cung cấp');
        return false;
      }
      if (res.Code === 1) {
        Alert.alert(
          'Thông báo',
          `${isAddMotel ? `Thêm mới` : `Cập nhật`}  thành công !!`,
          [
            {
              text: 'Trở về',
              onPress: () => {
                getListMotels();
                navigation.pop();
              },
            },
          ]
        );
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(res));
      } else if (res.Code === 2) {
        signOut();
        Alert.alert(
          'Phiên làm việc của bạn đã hết, vui lòng đăng nhập lại !!',
          ''
        );
      } else {
        Alert.alert('Lỗi', 'Dữ liệu  lỗi vui lòng liên hệ nhà cung cấp');
      }
    } catch (error) {
      console.log('_onSubmit', error);
      Alert.alert('Lỗi', JSON.stringify(error));
    }
  };

  const loadData = async () => {
    try {
      const res = await getMotelById({ motelid });
      if (res.Code === 2) {
        Alert.alert(
          'Thông báo',
          'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!'
        );
      } else if (res.Code === 1 && !!res.Data) {
        const { Data } = res;
        updateState({
          address: Data?.Address ?? '',
          description: Data?.Description ?? '',
          motelName: Data?.MotelName ?? '',
          addons: Data?.addons ?? [],
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
    setRefresh(true);
    if (!!isAddMotel) {
      await new Promise((a) => setTimeout(a, 300));
      setRefresh(false);
      return updateState({
        address: '',
        description: '',
        motelName: '',
        addons: [],
      });
    } else {
      await loadData();
    }

    setRefresh(false);
  };

  const LogoutRender = () => {
    signOut();
    return <></>;
  };
  const _onChangeServices = (services) => {
    console.log('_onChangeServices', services);
    updateState({
      addons: services,
    });
  };
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
            <RefreshControl onRefresh={_onRefresh} refreshing={isRefresh} />
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
            {/*      preElectricPrice: "" *!/*/}
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
            {/*      value={state.preElectricPrice}*/}
            {/*      onChangeText={(value) =>*/}
            {/*        updateState({ preElectricPrice: value })*/}
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
                returnKeyType={'done'}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Tên nhà trọ:
                  </Text>
                )}
                placeholder="632 CMT8 P11 Q3,..."
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.motelName}
                onChangeText={(value) => updateState({ motelName: value })}
              />
            </View>
            <View style={styles.formGroup}>
              <Input
                returnKeyType={'done'}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Địa chỉ nhà:
                  </Text>
                )}
                placeholder="632 CMT8 P11 Q3,..."
                style={styles.inputControl}
                textStyle={styles.inputText}
                value={state.address}
                onChangeText={(value) => updateState({ address: value })}
              />
            </View>
            <View style={[styles.formGroup, { marginBottom: 10 }]}>
              <Input
                multiline={true}
                returnKeyType={'done'}
                label={(props) => (
                  <Text {...props} style={[...props.style, styles.lbInput]}>
                    Mô tả:
                  </Text>
                )}
                placeholder="Một căn nhà đẹp, có nhiều phòng ..."
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
            {/*    value={state.electricPrice}*/}
            {/*    keyboardType={'number-pad'}*/}
            {/*    onChangeText={(value) => updateState({ electricPrice: value })}*/}
            {/*  />*/}
            {/*</View>*/}
          </View>
          <View style={styles.submitActions} />
          {isAddMotel && !isRefresh && (
            <ServiceList
              onChange={_onChangeServices}
              serviceList={state.addons}
            />
          )}
          {!isAddMotel && !isRefresh && (
            <ServiceList
              onChange={_onChangeServices}
              serviceList={state.addons}
            />
          )}
        </KeyboardAwareScrollView>
      )}
      {!!!isLoading && (
        <View style={[{ paddingVertical: 15 }]}>
          <Button
            onPress={_onSubmit}
            accessoryLeft={() =>
              !!isAddMotel ? (
                <Icon
                  name="plus"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              ) : (
                <Icon
                  name="sync"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )
            }
            style={styles.submitButton}
            textStyle={{ fontSize: 18 }}>
            {!!isAddMotel ? 'Thêm nhà' : 'Cập nhật'}
          </Button>
        </View>
      )}
      <Spinner visible={spinner} />
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
    paddingVertical: 5,
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
