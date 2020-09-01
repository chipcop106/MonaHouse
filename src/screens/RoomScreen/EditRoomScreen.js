import React, { useContext, useReducer } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input } from '@ui-kitten/components';
import { color, sizes } from '~/config';
import { create_UUID as randomId, currencyFormat as cf } from '~/utils';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
import Service from '~/components/GoInForm/Service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useHeaderHeight } from '@react-navigation/stack';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'ROOM_CHANGE':
      return {
        ...state,
        room: {
          ...state.room,
          [payload.key]: payload.value,
        },
      };
      break;
    case 'SERVICE_CHANGE':
      return {
        ...state,
        service: payload,
      };
      break;
    case 'DELETE_SERVICE': {
      return {
        ...state,
        service: [...state.service].filter(
          (serviceItem) => serviceItem.keyID !== payload.keyID
        ),
      };
      break;
    }
    case 'ADD_SERVICE': {
      return {
        ...state,
        service: [
          ...state.service,
          {
            ID: 0,
            keyID: randomId(),
            RoomID: payload.roomID,
            RenterInfoID: payload.renterID,
            AddOnName: '',
            Price: '',
          },
        ],
      };
      break;
    }

    default:
      return state;
      break;
  }
};

const EditRoomScreen = ({ navigation, route }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...route.params.roomInfo,
    service: route.params.roomInfo?.addons.map((sv) => ({
      ...sv,
      keyID: randomId(),
    })),
  });
  const { signOut } = useContext(AuthContext);
  const { state: motelState } = useContext(MotelContext);
  const { updateRoom } = useContext(RoomContext);
  const { listMotels } = motelState;
  const { room, renter, service } = state;

  const headerHeight = useHeaderHeight();
  navigation.setOptions({
    headerTitle: room.NameRoom ?? 'Chưa có dữ liệu phòng',
  });

  const refreshRoomInfo = () => {
    route.params.onGoBack();
  };

  const updateRoomState = (key, value) => {
    dispatch({ type: 'ROOM_CHANGE', payload: { key, value } });
  };

  const updateServiceState = (value) => {
    dispatch({ type: 'SERVICE_CHANGE', payload: value });
  };

  const addService = () => {
    dispatch({
      type: 'ADD_SERVICE',
      payload: {
        roomID: room.ID,
        renterID: renter.renter?.ID ?? 0,
      },
    });
  };

  const deleteService = (keyID) => {
    dispatch({
      type: 'DELETE_SERVICE',
      payload: { keyID },
    });
  };

  const updateService = (id, { name, price }) => {
    const newServices = [...service].map((service) => {
      return service.keyID === id
        ? {
            ...service,
            AddOnName: name,
            Price: price,
          }
        : service;
    });
    updateServiceState(newServices);
  };

  const updateRoomInfo = async () => {
    try {
      const {
        PriceElectric,
        ID,
        PriceRoom,
        PriceWater,
        Description,
        NameRoom,
      } = room;
      await updateRoom(
        {
          roomid: ID,
          roomname: NameRoom,
          priceroom: PriceRoom,
          electrictprice: PriceElectric,
          waterprice: PriceWater,
          description: Description,
          addons: service,
        },
        { navigation, signOut, refreshRoomInfo }
      );
    } catch (error) {
      Alert.alert(JSON.stringify(error.message));
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ padding: 15 }}
        extraScrollHeight={headerHeight}
        viewIsInsideTabBar={true}
        keyboardOpeningTime={150}>
        <View style={styles.section}>
          <View style={styles.formGroup}>
            <Input
              label="Tên phòng"
              placeholder="Phòng 01"
              value={room.NameRoom}
              style={styles.input}
              textStyle={styles.textInput}
              onChangeText={(newValue) => updateRoomState('NameRoom', newValue)}
            />
          </View>
          <View style={[styles.formGroup, styles.half]}>
            <Input
              label="Giá phòng / tháng"
              placeholder="3.000.000"
              value={cf(room.PriceRoom)}
              onChangeText={(newValue) =>
                updateRoomState('PriceRoom', newValue.replace(/[^0-9\-]/g, ''))
              }
              style={styles.input}
              textStyle={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.col]}>
              <Input
                label="Giá điện / kW"
                placeholder="3.500"
                value={cf(room.PriceElectric)}
                onChangeText={(newValue) =>
                  updateRoomState(
                    'PriceElectric',
                    newValue.replace(/[^0-9\-]/g, '')
                  )
                }
                style={styles.input}
                textStyle={styles.textInput}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, styles.col]}>
              <Input
                label="Giá nước / m3"
                placeholder="5.000"
                value={cf(room.PriceWater)}
                onChangeText={(newValue) =>
                  updateRoomState('PriceWater', newValue)
                }
                style={styles.input}
                textStyle={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ ...styles.formGroup, marginBottom: 0 }}>
            <Input
              label="Mô tả phòng"
              placeholder="VD: Phòng có điều hòa"
              value={room.Description}
              onChangeText={(newValue) =>
                updateRoomState('Description', newValue)
              }
              style={styles.input}
              textStyle={styles.textInput}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>
        <View style={styles.serviceTitle}>
          <Text style={{ ...styles.secTitle, marginBottom: 0 }}>
            Dịch vụ phòng
          </Text>
          <TouchableOpacity onPress={addService} style={styles.addServiceBtn}>
            <Icon
              name="plus-circle-outline"
              fill={color.primary}
              style={sizes.iconButtonSize}
            />
            <Text style={styles.addServiceBtnText}>Thêm dịch vụ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={[styles.serviceWrap]}>
            {!!service && !!service.length > 0 ? (
              service.map((sv) => (
                <Service
                  key={`${sv.keyID}`}
                  initialState={{
                    name: sv?.AddOnName ?? '',
                    price: sv?.Price ?? '',
                  }}
                  onDelete={() => deleteService(sv.keyID)}
                  onChangeValue={(nextState) =>
                    updateService(sv.keyID, nextState)
                  }
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Không có dịch vụ thêm</Text>
            )}
          </View>
        </View>
        <Button onPress={updateRoomInfo} status="danger" size="large">
          Cập nhật thông tin phòng
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  section: {
    padding: 15,
    marginBottom: 30,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginHorizontal: -10,
  },
  col: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  secTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: color.darkColor,
  },
  serviceTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addServiceBtnText: {
    marginLeft: 5,
    color: color.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  serviceWrap: {
    paddingBottom: 0,
    marginHorizontal: -10,
    paddingHorizontal: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: color.redColor,
    fontWeight: '600',
  },
});
