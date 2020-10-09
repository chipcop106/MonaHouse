import React, { useLayoutEffect, useContext, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl, StatusBar, SafeAreaView,
  ScrollView, Dimensions, Keyboard
} from 'react-native'
import { Layout, Button, Icon } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { useHeaderHeight } from '@react-navigation/stack';
import { sizes, color, settings } from '~/config';
import StepIndicator from 'react-native-step-indicator';

import RoomInfoForm from '../../components/GoInForm/RoomInfoForm';
import RenterInfoForm from '../../components/GoInForm/RenterInfoForm';
import CheckoutInfoForm from '../../components/GoInForm/CheckoutInfoForm';

import { Context as RoomGoInContext } from '../../context/RoomGoInContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as RoomContext } from '~/context/RoomContext';
import Loading from '~/components/common/Loading';
import { currencyFormat } from '~/utils';
import { KeyboardAccessoryNavigation, KeyboardAwareTabBarComponent } from 'react-native-keyboard-accessory'

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
  currentStepLabelColor: color.primary
}
const titleHeader = [
  'Thông tin phòng',
  'Thông tin người thuê',
  'Thanh toán',
];

const RenderForm = (props) => {
  const {
    state: RoomGoinState,
    changeStateFormStep,
    stepStateChange,
  } = useContext(RoomGoInContext);
  const { step, dataForm } = RoomGoinState;
  console.log('RenderForm step:', step);
  console.log('RenderForm State:', RoomGoinState);
  // if(step === 1){
  //   changeStateFormStep("cityLists", settings.cityLists);
  //   changeStateFormStep("relationLists", settings.relationLists);
  // }

  return (
    <>
      {step === 0 && (
        <RoomInfoForm
          kbStatus={props.kbStatus}
          onFocusInput={props.onFocusInput}
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 1 && (
        <RenterInfoForm
          kbStatus={props.kbStatus}
          onFocusInput={props.onFocusInput}
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 2 && (
        <CheckoutInfoForm
          kbStatus={props.kbStatus}
          onFocusInput={props.onFocusInput}
          onChangeState={stepStateChange}
          initialState={dataForm[step]}
        />
      )}
    </>
  );
};

const RoomGoInScreen = ({ navigation, route }) => {
  const { signOut } = useContext(AuthContext);
  const {
    state: RoomGoinState,
    changeStepForm,
    changeStateFormStep,
    resetState,
    addPeopleToRoom,
    stepStateChange,
    loadRoomInfo,
  } = useContext(RoomGoInContext);
  const { step, dataForm } = RoomGoinState;
  const { updateState: updateState_Room } = useContext(RoomContext);

  useEffect(() => {
    console.log('RoomGoinState', RoomGoinState);
    (async () => {
      await loadRoomInfo(route.params?.roomId);
    })();
    return () => {
      resetState();
    };
  }, []);
  useLayoutEffect(() => {
    !RoomGoinState.isLoading &&
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => null,
      gesturesEnabled: false,
      // headerTitle: titleHeader[RoomGoinState.step],
    });
  }, [RoomGoinState]);
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState(false);
  const [kbStatus, setKbStatus] =  useState({
    index: 0,
    nextFocusDisabled: false,
    previousFocusDisabled: false,
  });
  const onPress_headerLeft = () => {
    step === 0 ? navigation.pop() : changeStepForm(-1);
  };


  const sendFormData = async () => {
    const room = dataForm[0];
    const renter = dataForm[1];
    const checkout = dataForm[2];
    const { actuallyReceived, totalDeposit, totalPrepay } = checkout;
    const serviceArr = [...room.services].map((service) => {
      return {
        Name: service.AddonName,
        Price: service.AddonPrice,
      };
    });
    const pageNum = parseInt(actuallyReceived || 0);
    if (route.params?.isDeposit) {
      // dat coc
    } else {
      if (pageNum < parseInt(totalDeposit) + parseInt(0)) {
        return Alert.alert(
          `Số thực nhận không được nhỏ hơn tiền cọc ${
            currencyFormat(parseInt(totalDeposit)) + parseInt(0)
          }`
        );
      }
    }

    const imageArr = [
      {
        Name: 'dong-ho-nuoc',
        DataIMG: !!room.roomInfo?.waterImage
          ? !!room.roomInfo?.waterImage?.ID
            ? [
                {
                  ID: room.roomInfo?.waterImage.ID,
                  URL: room.roomInfo?.waterImage?.UrlIMG,
                },
              ]
            : [
                {
                  ID: 0,
                  URL: room.roomInfo?.waterImage,
                },
              ]
          : [],
      },
      {
        Name: 'dong-ho-dien',
        DataIMG: !!room.roomInfo?.electrictImage
          ? !!room.roomInfo?.electrictImage?.ID
            ? [
                {
                  ID: room.roomInfo?.electrictImage.ID,
                  URL: room.roomInfo?.electrictImage.UrlIMG,
                },
              ]
            : [
                {
                  ID: 0,
                  URL: room.roomInfo?.electrictImage,
                },
              ]
          : [],
      },
      {
        Name: 'giay-to',
        DataIMG: (() => {
          let rs = [];
          try {
            Array.isArray(renter?.licenseImages) &&
              renter?.licenseImages.length > 0 &&
              renter?.licenseImages.map((it) =>
                rs.push({ ID: it.ID, URL: it.UrlIMG })
              );
          } catch (error) {
            console.log('giay-to DataIMG error', error);
          }

          return rs;
        })(),
      },
    ];
    console.log('imageArr', imageArr);
    try {
      let datein = moment(room.dateGoIn).format('DD/MM/yyyy');
      datein === 'Invalid date' && (datein = moment().format('DD/MM/yyyy'));
      const contractInfo = (() => {
        const keymaps = ['days', 'months', 'years'];
        const keymaps_Vi = ['ngày', 'tháng', 'năm'];
        try {
          return {
            note: `${room.timeRent} ${
              keymaps_Vi[room.timeTypeIndex?.row ?? 0]
            }`,
            date: moment(room.dateGoIn)
              .add(
                parseInt(room.timeRent),
                keymaps[room.timeTypeIndex?.row ?? 0]
              )
              .format('DD/MM/YYYY'),
          };
        } catch (e) {
          console.log('contractInfo error', e);
          return {
            note: `${1} ${keymaps_Vi[room.timeTypeIndex?.row ?? 2]}`,
            date: moment().add(1, 'years').format('DD/MM/YYYY'),
          };
        }
      })();
      console.log(dataForm, route.params.isDeposit);
      await addPeopleToRoom(
        {
          roomid: parseInt(route.params?.roomId || 0),
          fullname: renter.fullName || '',
          phone: renter.phoneNumber || '',
          job: renter.job || '',
          cityid: parseInt(renter.cityLists[renter.provinceIndex.row].ID),
          objimg: JSON.stringify(imageArr), // imageArr
          datein: datein,
          // month: parseInt(room.timeRent),
          note: renter.note,
          totalprice: parseInt(checkout.actuallyReceived) || 0,
          notepaid: checkout.paymentNote,
          monthpaid: parseInt(checkout.prePaymentTimeIndex.row),
          priceroom: parseInt(room.roomPrice) || 0,
          electric: parseInt(room.roomInfo?.electrictNumber || 0),
          electricprice: parseInt(room.roomInfo?.electrictPrice || 0),
          water: parseInt(room.roomInfo?.waterNumber || 0),
          waterprice: parseInt(room.roomInfo?.waterPrice || 0),
          monthdeposit: parseInt(checkout.preDepositTimeIndex.row) + 1,
          addonservice:
            serviceArr.length > 0
              ? JSON.stringify(
                  serviceArr.map((item) => {
                    return { ID: 0, ...item };
                  })
                ) || ''
              : '',
          email: renter.email || '',
          quantity: parseInt(renter.numberPeople) || 1,
          relationship: parseInt(
            renter.relationLists[renter.relationshipIndex.row].id
          ),
          DateOutContract: contractInfo?.date ?? '',
          contractNote: contractInfo?.note ?? '',
          typeew: 1,
          isCollect: checkout?.isCollect ?? true,
        },
        {
          navigation,
          signOut,
          resetState,
        }
      );
      updateState_Room('isReload', true);
    } catch (error) {
      console.log('sendFormData error', error);
      alert(JSON.stringify(error.message));
    }

    // navigation.pop();
    // resetState();
  };

  const changeNextStep = () => {
    const { dataForm, step } = RoomGoinState;
    const dataStep = dataForm[step];

    switch (step) {
      case 0:
        console.log(dataStep);
        const { roomPrice } = dataStep;
        if (parseInt(roomPrice) <= 0) return Alert.alert('Chưa có tiền thuê');
        break;
      case 1:
        console.log(dataStep);
        const { fullName, phoneNumber } = dataStep;
        if (fullName.trim().length <= 0)
          return Alert.alert('Họ và tên không được chừa trống');
        if (phoneNumber.trim().length <= 0)
          return Alert.alert('Số điện thoại không được chừa trống');
        break;
    }
    changeStepForm(1);
    setKbStatus({
      ...kbStatus,
      index: 0,
    });
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    // await loadRoomInfo(route.params?.roomId);
    setRefreshing(false);
  };
  const refScrollView = React.useRef();
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);
  const _keyboardDidShow = (e) => {
      console.log('keyboard h:', e.startCoordinates.height);
      console.log('scrollView  h:', Dimensions.get('window').height - e.startCoordinates.height - headerHeight)
  };

  const _keyboardDidHide = () => {};
  const _onDoneKeyboard = () => {}
  const _onNextKeyboard = () => {
    const { nextFocusDisabled, index } = kbStatus;
    if (nextFocusDisabled) {
      return;
    }
    switch (step) {
      case 0:
        setKbStatus({
          nextFocusDisabled: index === 1,
          previousFocusDisabled: index === 0,
          index: index + 1,
        });
        return;
      case 1:
        setKbStatus({
          nextFocusDisabled: index === 5,
          previousFocusDisabled: index === 0,
          index: index + 1,
        });
        return;
      case 2:
        return;
      default:
        return
    }

  }
  const _onPreviousKeyboard = () => {
    const { previousFocusDisabled, index } = kbStatus;
    if (previousFocusDisabled) {
      return;
    }
    switch (step) {
      case 0:
        setKbStatus({
          nextFocusDisabled: index === 1,
          previousFocusDisabled: index === 0,
          index: index - 1,
        });
        return;
      case 1:
        setKbStatus({
          nextFocusDisabled: index === 5,
          previousFocusDisabled: index === 0,
          index: index - 1,
        });
        return;
      case 2:
        return;
      default:
        return
    }
  }

 const _handleFocusInput = ( index ) => {
    console.log('current step', step);
    console.log('child index:', index);
    switch (step) {
      case 0:
        setKbStatus({
          nextFocusDisabled: index === 1,
          previousFocusDisabled: index === 0,
          index: index,
        })
        return;
      case 1:
        setKbStatus({
          nextFocusDisabled: index === 5,
          previousFocusDisabled: index === 0,
          index: index,
        })
        return;
      case 2:
        return;
      default:
        return
    }
 }
  return (
    <Layout style={styles.container} level="3">
      <StatusBar barStyle='dark-content' />
      <SafeAreaView />
      {!!RoomGoinState.isLoading ? (
        <View
          style={{
            alignItems: 'center',
            padding: 15,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Loading />
        </View>
      ) : (
        <>
          <View style={{paddingBottom: 5}}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={step}
              labels={titleHeader}
              stepCount={titleHeader.length}
            />
          </View>
          <KeyboardAwareScrollView
            ref={refScrollView}
            refreshControl={
              <RefreshControl onRefresh={_onRefresh} refreshing={refreshing} />
            }
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 15 }}
            extraScrollHeight={ 90 }>
            <RenderForm  onFocusInput={_handleFocusInput} kbStatus={kbStatus} />
            <View style={styles.mainWrap}>
              <View style={styles.btnGroup}>
                <Button
                  style={[styles.btnFt, { borderBottomRightRadius: 0, borderTopRightRadius: 0 }]}
                  onPress={onPress_headerLeft}
                  accessoryLeft={() => <Icon
                    name="arrow-left"
                    fill={color.whiteColor}
                    style={sizes.iconButtonSize}
                  />}
                >
                  Trở lại
                </Button>
                {RoomGoinState.step < 2 ? (
                  <Button
                    style={[styles.btnFt, { borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }]}
                    onPress={changeNextStep}
                    accessoryRight={() => (
                      <Icon
                        name="arrow-right"
                        fill={color.whiteColor}
                        style={sizes.iconButtonSize}
                      />
                    )}
                    size="large"
                    status="danger">
                    {RoomGoinState.step === 0
                      ? 'Cấu hình người thuê'
                      : 'Thông tin thanh toán'}
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
                    Lưu thông tin phòng
                  </Button>
                )}
              </View>
            </View>

          </KeyboardAwareScrollView>

        </>
      )}
      <KeyboardAccessoryNavigation
        nextDisabled={kbStatus.nextFocusDisabled}
        previousDisabled={kbStatus.previousFocusDisabled}
        onDone={_onDoneKeyboard}
        onNext={_onNextKeyboard}
        onPrevious={_onPreviousKeyboard}
        avoidKeyboard={false}
        androidAdjustResize={true} children={null}/>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    paddingHorizontal: 15,
    paddingBottom: 15,
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
  btnGroup: {
    flexDirection: 'row',
  },
  btnFt: {
    flexGrow: 1,
    // borderRadius: 0,
  },
});

export default RoomGoInScreen;
