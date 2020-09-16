import React, {
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { StyleSheet, View, Alert, RefreshControl } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { Icon, Button, IndexPath } from '@ui-kitten/components';
import { color, sizes, settings } from '~/config';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import MoneyCard from '~/components/MoneyCard';
import NavLink from '~/components/common/NavLink';
import Loading from '~/components/common/Loading';
import ModalizeSelect from '~/components/common/ModalizeSelect';
import moment from 'moment';
import { submitMonthlyPayment } from '~/api/CollectMoneyAPI'

const initialState = {
  isLoading: true,
  refreshing: false,
  filterState: 0,
};

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case 'STATE_CHANGE':
      return {
        ...prevState,
        [payload.key]: payload.value,
      };
      break;
    default:
      return prevState;
      break;
  }
};

const RoomMoneyCollectAllScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { signOut } = useContext(AuthContext);
  const { state: roomState, getListMonthlyBill, submitMonthlyPaymentAction } = useContext(RoomContext);
  const { listMonthlyBill } = roomState;
  const { state: motelState } = useContext(MotelContext);
  const headerHeight = useHeaderHeight();
  const { listMotels } = motelState;
  const [pickerData, setPickerData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect( () => {
    if(listMonthlyBill.length > 0){
      const paymentMeta = listMonthlyBill.map(( { roomId, renterId } ) => {  return { roomId, renterId } });
      setPaymentData(paymentMeta);
    }
  }, [listMonthlyBill]);
  useEffect(() => {
    //load motel data
    console.log('RoomElectricAllScreen motelState', motelState);
    !!motelState?.listMotels &&
      motelState?.listMotels.length > 0 &&
      setPickerData(motelState.listMotels.map((item) => item.MotelName));
  }, [motelState]);
  useEffect(() => {
    //load init data

    loadRoomApi(state, state.filterState);

  }, []);
  const updateState = (key, value) => {
    dispatch({ type: 'STATE_CHANGE', payload: { key, value } });
  };

  const refreshApi = async () => {
    updateState('refreshing', true);
    await loadRoomApi({ loadingControl: false }, state.filterState);
    updateState('refreshing', false);
  };

  const onRefresh = useCallback(() => {
    refreshApi();
  }, [state.refreshing]);

  const loadRoomApi = async ({ loadingControl = true }, filter) => {
    console.log('loadRoomApi', filter);
    loadingControl && updateState('isLoading', true);
    try {
      const rs = await getListMonthlyBill({
        motelid: listMotels[filter - 1]?.ID ?? 0,
        // month: selectedMonthIndex + 1,
        // year: settings.yearLists[selectedYearIndex],
        // qsearch: `${searchValue}`,
      });
      updateState('isLoading', false);
      if (!!rs.error) {
        rs.error.Code === 2 && signOut();
        rs.error.Code === 0 &&
          Alert.alert('Oops!!', JSON.stringify(rs.error.message));
      }
    } catch (error) {
      updateState('isLoading', false);
      console.log(error);
      Alert.alert('Oops!!', JSON.stringify(error.message));
    }
  };

  const onFilterChange = (filter) => {
    if (filter !== state.filterState) {
      updateState('filterState', filter);
      loadRoomApi({ loadingControl: true }, filter);
    }
  };

  const submitAllConfirm = () => {
    Alert.alert(
      `Cảnh báo`,
      `Bạn có chắc chắn muốn thu tiền tất cả phòng trong nhà đã chọn ??`,
      [
        {
          text: 'Hủy thao tác',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Tôi chắc chắn',
          onPress: async () => {
            console.log(paymentData);

            const rs = await submitMonthlyPaymentAction(paymentData);


            if (!!rs.error) {
              rs.error.Code === 2 && signOut();
              rs.error.Code === 0 &&
              Alert.alert('Oops!!', JSON.stringify(rs.error.message));
            } else {
               await loadRoomApi({ loadingControl: true }, state.filterState);
            }

          },
        },
      ],
      { cancelable: false }
    );
  };
  function updateItemByindex(index, item, array) {
    array[index] = item;
    return array;
  }
  const onChangeRoomInfo = (value, index) => {

    setPaymentData(updateItemByindex(index, {
      ...paymentData[index],
      paid: value,
      note: `Thu tiền nhà ngày ${ moment().format('DD/MM/YYYY') }`,
    }, paymentData));
  };

  return (
    <View style={styles.container}>
      {/*<FilterHeader*/}
      {/*  onValueChange={onFilterChange}*/}
      {/*  initialState={state.filterState}*/}
      {/*  advanceFilter={false}*/}
      {/*  yearFilter={true}*/}
      {/*/>*/}
      <View style={styles.filterWrap}>
        <ModalizeSelect
          onChange={onFilterChange}
          pickerData={['Tất cả', ...pickerData]}
          selectedValue={'Chọn nhà trọ...'}
          leftIcon="home"
          disabled={state.isLoading}
        />
      </View>
      {state.isLoading ? (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 30,
            justifyContent: 'center',
          }}>
          <Loading />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <>
            <KeyboardAwareFlatList
              extraHeight={headerHeight + 140}
              refreshControl={
                <RefreshControl
                  refreshing={state.refreshing}
                  onRefresh={onRefresh}
                />
              }
              ListHeaderComponent={() => (
                <View style={styles.linkCustom}>
                  <NavLink
                    title="Lịch sử thu tiền"
                    icon={{
                      name: 'file-text-outline',
                      color: color.primary,
                    }}
                    routeName="MoneyHistory"
                    borderBottom={false}
                  />
                </View>
              )}
              keyExtractor={(room, index) => `${room.RoomID}-${index}`}
              style={styles.listContainer}
              contentContainerStyle={styles.contentCard}
              data={listMonthlyBill}
              initialNumToRender={5}
              removeClippedSubviews={false}
              // extraData={listElectrictRooms}
              renderItem={(room) => (
                <MoneyCard
                  roomInfo={room}
                  handleValueChange={(value) =>
                    onChangeRoomInfo(value, room.index)
                  }
                />
              )}
            />
            <Button
              style={{ borderRadius: 0 }}
              onPress={submitAllConfirm}
              accessoryLeft={() => (
                <Icon
                  name="credit-card-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}
              size="large"
              status="danger">
              Thu tiền tất cả phòng
            </Button>
          </>
        </View>
      )}
    </View>
  );
};

export default RoomMoneyCollectAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
    backgroundColor: color.bgmain,
  },

  contentCard: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  listContainer: {
    flex: 1,
  },

  bottomSheetContent: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    paddingBottom: 60,
  },
  linkCustom: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 15,
    paddingLeft: 10,
    borderRadius: 4,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,.35)',
  },
  filterWrap: {
    padding: 10,
    backgroundColor: color.darkColor,
  },
});
