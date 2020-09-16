import React, { useLayoutEffect, useContext, useEffect, useState } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { Layout, Button, Icon } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { useHeaderHeight } from '@react-navigation/stack';
import { sizes, color, settings } from '~/config'
import RoomInfoForm from '../../components/GoInForm/RoomInfoForm';
import RenterInfoForm from '../../components/GoInForm/RenterInfoForm';
import CheckoutInfoForm from '../../components/GoInForm/CheckoutInfoForm';
import { Context as RoomGoInContext } from '../../context/RoomGoInContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as RoomContext } from '~/context/RoomContext';
import Loading from '~/components/common/Loading';

const titleHeader = [
  'Thông tin phòng, ki ốt',
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
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 1 && (
        <RenterInfoForm
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 2 && (
        <CheckoutInfoForm
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
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState(false);

  const onPress_headerLeft = () => {
    step === 0 ? navigation.pop() : changeStepForm(-1);
  };
  useLayoutEffect(() => {
    !RoomGoinState.isLoading &&
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onPress_headerLeft}>
            <Icon
              name="arrow-back-outline"
              fill={color.primary}
              style={sizes.iconButtonSize}
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ),
        headerTitle: titleHeader[RoomGoinState.step],
      });
  }, [RoomGoinState]);

  const sendFormData = async () => {
    const room = dataForm[0];
    const renter = dataForm[1];
    const checkout = dataForm[2];
    const { actuallyReceived, totalDeposit, totalPrepay } = checkout;
    const serviceArr = [...room.services].map((service) => {
      return {
        Name: service.value.name,
        Price: service.value.price,
      };
    });
    const pageNum = parseInt(actuallyReceived || 0);
    if(route.params?.isDeposit){
      // dat coc choi cho vui

    } else {
      if (pageNum < parseInt(totalDeposit) + parseInt(totalPrepay)) {
        return Alert.alert(
          `Số thực nhận không được nhỏ hơn ${
            parseInt(totalDeposit) + parseInt(totalPrepay)
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
          isCollect: checkout?.isCollect ?? true
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
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await loadRoomInfo(route.params?.roomId);
    setRefreshing(false);
  };
  return (
    <Layout style={styles.container} level="3">
      {!!RoomGoinState.isLoading ? (
        <View style={{ alignItems: 'center', padding: 15 }}>
          <Loading />
        </View>
      ) : (
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              onRefresh={_onRefresh}
              refreshing={refreshing}
            />
          }
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 15 }}
          extraScrollHeight={headerHeight}
          // viewIsInsideTabBar={true}
          keyboardOpeningTime={150}>
          <RenderForm />
          <View style={styles.mainWrap}>
            {RoomGoinState.step < 2 ? (
              <Button
                style={styles.btnFt}
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
                style={styles.btnFt}
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
        </KeyboardAwareScrollView>
      )}
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
  btnFt: {
    // borderRadius: 0,
  },
});

export default RoomGoInScreen;
