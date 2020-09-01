import React, { useReducer, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button, Icon } from '@ui-kitten/components';
import UserInfo from '~/components/UserInfo';
import IncludeElectrictWater from '~/components/IncludeElectrictWater';
import { color, sizes } from '~/config';
import gbStyle from '~/GlobalStyleSheet';
import { getRoomById, updateWaterElectric } from '~/api/MotelAPI';
import Moment from 'moment';
const initialState = {
  electrictNumber: '',
  electrictImage: null,
  waterNumber: '',
  waterImage: null,
  oldElectrict: '',
  oldWater: '',
};

const reducer = (prevstate, action) => {
  switch (action.type) {
    case 'STATE_CHANGE': {
      return {
        ...prevstate,
        ...action.payload.newState,
      };
    }
    default:
      return prevstate;
  }
};
const renderZero = (num) => {
  if (num > 9) return `${num}`;
  return `0${num}`;
};
const ElectrictCollectScreen = ({ route }) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const roomId = route.params?.roomId ?? null;
  // const { renter, room, electric, water } = state;
  const [loading, setLoading] = useState(true);

  const onChangeValue = (newState) => {
    dispatch({ type: 'STATE_CHANGE', payload: { newState } });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getRoomById({ roomid: roomId });
        console.log('getRoomById RES', res.Data);
        dispatch({
          type: 'STATE_CHANGE',
          payload: { newState: res.Data },
        });
      } catch (err) {}
    })();
  }, []);
  useEffect(() => {
    console.log('state change', state);
  }, [state]);
  const _pressUpdate = async () => {
    setLoading(true);
    const { waterNumber, electrictNumber, waterImage, electrictImage } = state;

    const nowDate = new Date();

    try {
      const res = await updateWaterElectric({
        date: `${renderZero(nowDate.getDate())}/${renderZero(
          nowDate.getMonth() + 1
        )}/${nowDate.getFullYear()}`,
        data: JSON.stringify([
          {
            RoomID: roomId,
            WaterNumber: waterNumber || 0,
            WaterIMG: waterImage?.ID || 0,
            ElectricNumber: electrictNumber || 0,
            ElectricIMG: electrictImage?.ID || 0,
          },
        ]),
      });

      if (res.Code === 1) {
        Alert.alert('Thành công!!', 'Số điện nước đã được cập nhật');
        navigation.pop();
      } else {
        throw res;
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Oop!!', JSON.stringify(error));
    }
    setLoading(false);
    // electrictNumber, waterNumber
  };
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.mainWrap}>
            <UserInfo
              name={
                loading
                  ? 'Đang tải...'
                  : state.renter?.renter?.FullName ?? 'Chưa rõ'
              }
              phone={
                loading
                  ? 'Đang tải...'
                  : state.renter?.renter?.Phone ?? 'Chưa có sđt'
              }
              avatar={state.renter?.renter?.LinkIMG ?? null}
              styleContainer={{ marginBottom: 30 }}
            />
            <View style={styles.section}>
              <Text
                status="primary"
                category="h5"
                style={{ marginBottom: 5 }}
                disabled={loading}>
                {state.room && state.room.NameRoom
                  ? state.room.NameRoom
                  : loading && 'Đang tải...'}
              </Text>
              <Text style={gbStyle.mBottom15}>
                Điện nước tháng {Moment().format('MM')}
              </Text>
              <View style={styles.formWrap}>
                <View style={[styles.formRow, styles.halfCol]}>
                  <Input
                    textStyle={styles.textInput}
                    label="Số điện cũ"
                    placeholder={'0'}
                    value={String(state.electric?.number || 0)}
                    textContentType="none"
                    keyboardType="numeric"
                    disabled
                  />
                </View>
                <View style={[styles.formRow, styles.halfCol]}>
                  <Input
                    textStyle={styles.textInput}
                    label="Số nước cũ"
                    placeholder="0"
                    value={String(state.water?.number || 0)}
                    textContentType="none"
                    keyboardType="numeric"
                    disabled
                  />
                </View>
                {!!!state.room && loading && <ActivityIndicator size="large" />}
                {state.room && (
                  <IncludeElectrictWater
                    initialState={initialState}
                    roomData={state.room}
                    handleValueChange={onChangeValue}
                    waterTitle="Nước tháng này"
                    electrictTitle="Điện tháng này"
                    priceDisplay={0}
                  />
                )}
              </View>
            </View>
            <Button
              accessoryLeft={() => (
                <Icon
                  name="sync"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}
              size="large"
              status="success"
              disabled={loading}
              onPress={_pressUpdate}>
              Cập nhật điện nước
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  mainWrap: {
    paddingHorizontal: 15,
  },
  section: {
    paddingTop: 15,
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

  formWrap: {
    marginHorizontal: '-1%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formRow: {
    marginBottom: 20,
    flexGrow: 1,
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  halfCol: {
    flexBasis: '48%',
  },
  fullWidth: {
    flexBasis: '98%',
  },
  mb15: {
    marginBottom: 15,
  },
});

export default ElectrictCollectScreen;
