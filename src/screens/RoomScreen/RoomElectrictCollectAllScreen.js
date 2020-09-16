import React, {
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';

import {
  StyleSheet,
  View,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { List, Button, Icon, IndexPath } from '@ui-kitten/components';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useHeaderHeight } from '@react-navigation/stack';
import { color, settings, sizes } from '~/config';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
import ElectrictCard from '~/components/ElectrictCard';
import NavLink from '~/components/common/NavLink';
import Loading from '~/components/common/Loading';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import ModalizeSelect from '~/components/common/ModalizeSelect'
const initialState = {
  isLoading: true,
  refreshing: false,
  filterState: {
    selectedMonthIndex: 0,
    selectedMotelIndex: 0,
    selectedYearIndex: 0,
    searchValue: '',
  },
};

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case 'STATE_CHANGE':
      return {
        ...prevState,
        [payload.key]: payload.value,
      };
    default:
      return prevState;
  }
};

const RoomElectricCollectAllScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { signOut } = useContext(AuthContext);
  const { state: roomState, getListElectrict, updateElectrict, updateState: updateRoomState } = useContext(
    RoomContext
  );
  const { listElectrictRooms } = roomState;
  const { state: motelState } = useContext(MotelContext);
  const { listMotels } = motelState;
  const [loading, setLoading] = useState(false);
  const [spinner, setSpiner] = useState(false);
  const headerHeight = useHeaderHeight();
  const [pickerData, setPickerData] = useState([]);


  useEffect(()=>{
    //load motel data
    console.log('RoomElectricAllScreen motelState', motelState);
    !!motelState?.listMotels
    && motelState?.listMotels.length > 0
    && setPickerData(motelState.listMotels.map(item => item.MotelName));
  },[motelState]);
  useEffect(()=>{
    //load init data
    onFilterChange(state.filterState);
  },[])
  const updateState = (key, value) => {
    dispatch({ type: 'STATE_CHANGE', payload: { key, value } });
  };
  const onFilterChange = async (filterIndex) => {
    console.log('filterIndex', filterIndex);
    !!!filterIndex ? updateState('isLoading', true) : setLoading(true);

    try {
      await getListElectrict(
        {
          motelid: listMotels[filterIndex - 1]?.ID ?? 0,
          // month: selectedMonthIndex + 1,
          // year: settings.yearLists[selectedYearIndex],
          // qsearch: `${searchValue || ''}`,
        },
        signOut
      );
      setLoading(false);
      updateState('isLoading', false);
    } catch (error) {
      setLoading(false);
      updateState('isLoading', false);
      console.log(error);
    }
    !!!filterIndex ? updateState('isLoading', false) : setLoading(false);
  };
  const _onRefresh = () => {
    onFilterChange(state.filterState);
  };

  // const onFilterChange = async (filter) => {
  //     updateState("filterState", filter);
  // };

  const onChangeRoomInfo = (state, index) => {
    console.log('onChangeRoomInfo', index, state);
    const newArray = [...listElectrictRooms];
    newArray[index] = {
      ...listElectrictRooms[index],
      electricNumber: state?.electrictNumber ?? '0',
      electricImg: state?.electrictImage?.ID ?? '0',
      waterNumber: state?.waterNumber ?? '0',
      waterImg: state?.waterImage?.ID ?? '0',
    }
    updateRoomState('listElectrictRooms', newArray)

  };

  const _onValueChange = (filterFormvalue) => {
    updateState('filterState', filterFormvalue);
    onFilterChange(filterFormvalue);
  };

  const _onPressSubmit = () => {
    Alert.alert(
      'Cảnh báo',
      `Bạn có chắc chắn muốn ghi điện tất cả phòng trong tháng đã chọn ??`,
      [
        {
          text: 'Hủy thao tác',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Tôi chắc chắn',
          onPress: () => {
            doActionUpdateElectric()
          },
        },
      ],
      { cancelable: false }
    );
  };
  const doActionUpdateElectric = async () => {
    setSpiner(true);
    try {
      console.log(roomState.listElectrictRooms);
      const res = await updateElectrict({
        date: moment().format('DD/MM/YYYY'),
        data: JSON.stringify(
          roomState.listElectrictRooms.map(item => {
              return {
                RoomID: item.RoomID,
                WaterNumber: parseInt(item.waterNumber) || 0,
                WaterIMG: item.waterImg?.ID ?? 0,
                ElectricNumber: parseInt(item.electricNumber) || 0,
                ElectricIMG: item.electricImg?.ID ?? 0
              }
          })
        )
      });
      // [{"RoomID":2384,"WaterNumber":1000,"WaterIMG":2704,"ElectricNumber":1200,"ElectricIMG":2704}]
      setSpiner(false);
      await  new Promise( a => setTimeout( a, 300 ) );
      switch (res.Code) {
        case 0:
          Alert.alert('Lỗi', JSON.stringify(res));
          break;
        case 1:
          Alert.alert('Thông báo !!', 'Cập nhật điện nước thành công !', [
            {
              text: 'Ok',
              onPress: () => {
                onFilterChange(state.filterState);
              },
            },
          ]);
          break;
        case 2:
          signOut();
          break;
        default:
          break
      }

    } catch (e) {
      setSpiner(false);
      console.log( '_onPressUpdateElectric error', e);
    }
  }
  const _renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <ElectrictCard
        roomInfo={item}
        handleValueChange={(state) => onChangeRoomInfo(state, index)}
      />
    );
  };
  const _renderListHeader = () => (
    <View style={styles.linkCustom}>
      <NavLink
        title="Lịch sử ghi điện nước"
        icon={{
          name: 'file-text-outline',
          color: color.primary,
        }}
        routeName="ElectrictHistory"
        borderBottom={false}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      {/*<FilterHeader*/}
      {/*  onValueChange={_onValueChange}*/}
      {/*  initialState={state.filterState}*/}
      {/*  advanceFilter={false}*/}
      {/*  yearFilter={true}*/}
      {/*/>*/}
      <View style={styles.filterWrap}>
        <ModalizeSelect
          onChange={_onValueChange}
          pickerData={['Tất cả',...pickerData]}
          selectedValue={'Chọn nhà trọ...'}
          leftIcon="home"
          disabled={loading}
        />
      </View>

      {!!state.isLoading && (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 30,
            justifyContent: 'center',
          }}>
          <Loading />
        </View>
      )}
      {!!!state.isLoading && (
        <>
          <KeyboardAwareFlatList
            // extraScrollHeight={120}
            extraHeight={headerHeight + 140}
            // viewIsInsideTabBar={true}
            keyboardShouldPersistTaps="never"
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
            refreshControl={
              <RefreshControl onRefresh={_onRefresh} refreshing={loading} />
            }
            data={listElectrictRooms}
            ListHeaderComponent={_renderListHeader}
            keyExtractor={(room, index) => `${room.RoomID}-${index}`}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={null}
          />
          <Button
            style={{ borderRadius: 0 }}
            onPress={_onPressSubmit}
            accessoryLeft={() => (
              <Icon
                name="credit-card-outline"
                fill={color.whiteColor}
                style={sizes.iconButtonSize}
              />
            )}
            size="large"
            status="danger">
            Ghi điện tất cả phòng
          </Button>
        </>
      )}
      <Spinner
        visible={spinner}
        textContent={'Vui lòng chờ giây lát...'}
        textStyle={{ color: '#fff' }} />
    </View>
  );
};

export default RoomElectricCollectAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgmain,
  },

  contentContainer: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#f0f0f0',
  },
  linkCustom: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    paddingLeft: 10,
    borderRadius: 4,
  },
  filterWrap: {
    padding: 10,
    backgroundColor: color.darkColor,
  },
});
