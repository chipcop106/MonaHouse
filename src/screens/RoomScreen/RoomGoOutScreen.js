import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Text, Layout, Button, Icon } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StepIndicator from 'react-native-step-indicator';

import GoOutInfo from '../../components/GoOutForm/GoOutInfo';
import GoOutCheckout from '../../components/GoOutForm/GoOutCheckout';

import { Context as RoomGoOutContext } from '../../context/RoomGoOutContext';
import { Context as RoomContext } from '../../context/RoomContext';
import { sizes, color } from '~/config';
import UserInfo from '~/components/UserInfo';
import { getRoomById } from '~/api/MotelAPI';
import Loading from '~/components/common/Loading';
import Spinner from 'react-native-loading-spinner-overlay';
import { Context as AuthContext } from '~/context/AuthContext';

const titleHeader = ['Thông tin phòng, ki ốt', 'Thông tin thanh toán'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: color.primary,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: color.primary,
  stepStrokeUnFinishedColor: color.disabledTextColor,
  separatorFinishedColor: color.primary,
  separatorUnFinishedColor: color.disabledTextColor,
  stepIndicatorFinishedColor: color.primary,
  stepIndicatorUnFinishedColor: '#fff',
  stepIndicatorCurrentColor: '#fff',
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: color.primary,
  stepIndicatorLabelFinishedColor: '#fff',
  stepIndicatorLabelUnFinishedColor: color.disabledTextColor,
  labelColor: '#999',
  labelSize: 13,
  currentStepLabelColor: color.primary,
};

const RenderForm = () => {
  const { state: RoomGoOutState, changeStateFormStep } = useContext(
    RoomGoOutContext
  );
  const { step, dataForm } = RoomGoOutState;

  return (
    <>
      {step === 0 && (
        <GoOutInfo
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 1 && (
        <GoOutCheckout
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
    </>
  );
};

const RoomGoOutScreen = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const { signOut } = useContext(AuthContext);
  const {
    state: RoomGoOutState,
    changeStepForm,
    clearState,
    loadDataForm,
    moveOut,
  } = useContext(RoomGoOutContext);
  const { updateState: updateState_Room } = useContext(RoomContext);
  const route = useRoute();
  const [userInfo, setUserInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const loadData = async () => {
    try {
      const res = await getRoomById({ roomid: route.params.roomId });
      setUserInfo({
        ...res.Data.renter.renter,
      });
      await loadDataForm(res.Data);
    } catch (err) {
      console.log('RoomGoOutScreen loadData err', err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
    });
  }, [navigation, RoomGoOutState]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const sendFormData = async () => {
    setSpinner(true);
    const res = await moveOut(RoomGoOutState);
    setSpinner(false);
    await new Promise((a) => setTimeout(a, 200));
    if (res.Code === 1) {
      clearState();
      navigation.pop();
      updateState_Room('isReload', true);
    } else if (res.Code === 0) {
      console.log(res);
      Alert.alert('Oops!!', JSON.stringify(res));
    } else if (res.Code === 2) {
      console.log(res);
      signOut();
      Alert.alert('Oops!!', 'Phiên đăng nhập của bạn đã hết');
    } else {
      console.log(res);
      Alert.alert('Oops!!', JSON.stringify(res));
    }
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.log('_onRefresh error', error);
    }
    setRefreshing(false);
  };

  const _onPressGotoPreview = () => {
    try {
      const { dataForm } = RoomGoOutState;
      const { roomInfo } = dataForm[0];
      // const waterDiff = parseInt(roomInfo.waterNumber) - parseInt(roomInfo.oldWaterNumber);
      // const electricDiff =  parseInt(roomInfo.electrictNumber) - parseInt(roomInfo.oldElectrictNumber);
      // electricDiff < 0 && Alert.alert('Oops !!', 'Số điện mới phải lớn hơn hoặc bằng số cũ');
      // waterDiff < 0 && Alert.alert('Oops !!', 'Số nước mới phải lớn hơn hoặc bằng số cũ');
      // if(waterDiff >= 0  && electricDiff >= 0) {
      // }
      changeStepForm(1, {
        ...RoomGoOutState.dataForm,
        roomId: route.params.roomId,
      });
    } catch (e) {
      console.log('_onPressGotoPreview error:', e);
    }
  };

  return (
    <Layout style={styles.container} level="3">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView />

      {loading ? (
        <View style={{ padding: 15, alignItems: 'center' }}>
          <Loading />
        </View>
      ) : (
        <>
          <View style={{paddingBottom: 5}}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={RoomGoOutState.step}
              labels={titleHeader}
              stepCount={titleHeader.length}
            />
          </View>
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl onRefresh={_onRefresh} refreshing={refreshing} />
            }
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 15 }}
            extraScrollHeight={headerHeight}
            // viewIsInsideTabBar={true}
            keyboardOpeningTime={150}
          >
            <View style={{ padding: 15, paddingBottom: 0 }}>
              <UserInfo
                avatar={userInfo.Avatar}
                name={userInfo.FullName}
                phone={userInfo.Phone}
              />
            </View>
            <RenderForm />
            <View style={styles.mainWrap}>
              <View style={styles.btnGroup}>
                <Button
                  style={[styles.btnFt, { borderBottomRightRadius: 0, borderTopRightRadius: 0 }]}
                  onPress={()=>{
                    RoomGoOutState.step === 0 ? navigation.pop() : changeStepForm(-1)
                  }}
                  accessoryLeft={() => <Icon
                    name="arrow-left"
                    fill={color.whiteColor}
                    style={sizes.iconButtonSize}
                  />}
                >
                  Trở lại
                </Button>
                {RoomGoOutState.step < 1 ? (
                  <Button
                    style={[styles.btnFt, { borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }]}
                    onPress={_onPressGotoPreview}
                    accessoryRight={
                      RoomGoOutState.isLoading
                        ? null
                        : () => (
                          <Icon
                            name="arrow-right"
                            fill={color.whiteColor}
                            style={sizes.iconButtonSize}
                          />
                        )
                    }
                    size="large"
                    status="danger">
                    {RoomGoOutState.isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      `Xem phí dọn ra`
                    )}
                  </Button>
                ) : (
                  <Button
                    style={[styles.btnFt, { borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }]}
                    onPress={sendFormData}
                    accessoryLeft={() => (
                      <Icon
                        name="save"
                        fill={color.whiteColor}
                        style={sizes.iconButtonSize}
                      />
                    )}
                    size="large"
                    status="success">
                    Tiến hành dọn ra
                  </Button>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </>
      )}

      <Spinner
        visible={spinner}
        textContent={'Vui lòng chờ giây lát...'}
        textStyle={{ color: '#fff' }}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: color.primary,
    marginLeft: 5,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 30,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  btnGroup: {
    flexDirection: 'row',
  },
  btnFt: {
    flexGrow: 1,
    // borderRadius: 0,
  },
});

export default RoomGoOutScreen;
