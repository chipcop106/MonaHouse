import React, { useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  Input,
  Datepicker,
  Select,
  SelectItem,
  IndexPath,
  Icon,
} from '@ui-kitten/components';
import Service from './Service';
import IncludeElectricWater from '~/components/IncludeElectrictWater';
import { sizes, color, settings } from '../../config';
import { create_UUID as randomId } from '../../utils';
import { Context as RoomGoInContext } from '../../context/RoomGoInContext';
import { currencyFormat as cf } from '~/utils';

const timeType = ['Ngày', 'Tháng', 'Năm'];

const electricType = [
  'Theo số điện nước',
  'Bao điện nước',
  'Bao điện, nước tính theo số',
  'Bao nước, điện tính theo số',
];

const RoomInfoForm = () => {
  const {
    state: RoomGoInState,
    changeStateFormStep,
    onChangeService,
  } = useContext(RoomGoInContext);
  const stateRoomInfo = RoomGoInState.dataForm[RoomGoInState.step];
  const _onPressAddService = () => {
    changeStateFormStep('services', [
      ...stateRoomInfo.services,
      {
        id: randomId(),
        value: {
          name: '',
          price: '',
        },
      },
    ]);
  };
  const _handleValueChangeIncludeElectricWater = (value) => {
    console.log('_handleValueChangeIncludeElectricWater', value);
    changeStateFormStep('roomInfo', value);
  };

  return (
    <>
      <View style={styles.mainWrap}>
        <Text style={styles.secTitle}>Thông tin phòng / kiot</Text>
        <View style={styles.section}>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.halfCol]}>
              <Input
                returnKeyType={"done"}
                textStyle={styles.textInput}
                label="Giá thuê / tháng"
                placeholder="0"
                value={cf(stateRoomInfo.roomPrice)}
                onChangeText={(nextValue) =>
                  changeStateFormStep('roomPrice', nextValue.replace(/\./g, ''))
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Datepicker
                label="Ngày dọn vào"
                date={stateRoomInfo.dateGoIn}
                min={stateRoomInfo.dateGoIn}
                onSelect={(nextDate) =>
                  changeStateFormStep('dateGoIn', nextDate)
                }
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Select
                label="Thuê theo"
                value={timeType[stateRoomInfo.timeTypeIndex.row]}
                selectedIndex={stateRoomInfo.timeTypeIndex}
                onSelect={(index) =>
                  changeStateFormStep('timeTypeIndex', index)
                }>
                {timeType
                  ? timeType.map((option) => (
                      <SelectItem key={(option) => option} title={option} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Input
                returnKeyType={"done"}
                textStyle={styles.textInput}
                label="Thời gian thuê"
                placeholder="0"
                value={stateRoomInfo.timeRent}
                onChangeText={(nextValue) =>
                  changeStateFormStep('timeRent', nextValue)
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Cách tính điện nước"
                value={electricType[stateRoomInfo.electricIndex.row]}
                selectedIndex={stateRoomInfo.electricIndex}
                onSelect={(index) =>
                  changeStateFormStep('electricIndex', index)
                }>
                {electricType
                  ? electricType.map((option) => (
                      <SelectItem key={(option) => option} title={option} />
                    ))
                  : null}
              </Select>
            </View>
            <IncludeElectricWater
              initialState={stateRoomInfo.roomInfo}
              handleValueChange={_handleValueChangeIncludeElectricWater}
              index={stateRoomInfo.electricIndex?.row ?? new IndexPath(0).row}
            />
          </View>
        </View>
        <View style={styles.serviceTitle}>
          <Text style={{ ...styles.secTitle, marginBottom: 0 }}>
            Dịch vụ hằng tháng
          </Text>
          <TouchableOpacity
            onPress={_onPressAddService}
            style={styles.addServiceBtn}>
            <Icon
              name="plus-circle-outline"
              fill={color.primary}
              style={sizes.iconButtonSize}
            />
            <Text style={styles.addServiceBtnText}>Thêm dịch vụ</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, styles.serviceWrap]}>
          {!!stateRoomInfo.services && stateRoomInfo.services.length > 0 ? (
            stateRoomInfo.services.map((service) => (
              <Service
                key={`${service.id}`}
                initialState={{
                  name: service.value?.name ?? '',
                  price: service.value?.price ?? '',
                }}
                onDelete={() =>
                  changeStateFormStep(
                    'services',
                    stateRoomInfo.services.filter(
                      (serviceItem) => serviceItem.id !== service.id
                    )
                  )
                }
                onChangeValue={(nextState) =>
                  onChangeService({
                    id: service.id,
                    value: nextState,
                  })
                }
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Không có dịch vụ thêm</Text>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    padding: 15,
  },
  section: {
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  formWrap: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formRow: {
    marginBottom: 15,
    flexGrow: 1,
    marginHorizontal: '1%',
  },
  halfCol: {
    flexBasis: '48%',
  },
  fullWidth: {
    flexBasis: '98%',
  },
  serviceWrap: {
    paddingBottom: 0,
    marginBottom: 15,
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
  emptyText: {
    marginBottom: 15,
    color: color.redColor,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RoomInfoForm;
