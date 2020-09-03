import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Datepicker, Text } from '@ui-kitten/components';
import IncludeElectrictWater from '../IncludeElectrictWater';
import { color, settings } from '~/config';
import { Context as RoomGoOutContext } from '../../context/RoomGoOutContext';

const GoOutInfo = () => {
  const { state, changeStateFormStep } = useContext(RoomGoOutContext);
  const stateGoOutInfo = state.dataForm[state.step];
  useEffect(() => {
    console.log(state);
  }, []);
  const _handleValueChange = (stateValue) => {
    console.log('IncludeElectrictWater:', stateValue);
    changeStateFormStep('roomInfo', stateValue);
  };
  return (
    <>
      <View style={styles.mainWrap}>
        <View style={styles.section}>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                placeholder="dd/mm/yyyy"
                value={`Từ ${stateGoOutInfo.constract}`}
                label="Hợp đồng"
                accessoryLeft={() => (
                  <View style={styles.leftInput}>
                    <Text>12 tháng</Text>
                  </View>
                )}
                disabled
                textStyle={{ color: color.redColor }}
                onChangeText={(nextValue) =>
                  changeStateFormStep('constract', nextValue)
                }
                dataService={settings.formatDateService}
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Datepicker
                label="Ngày dọn vào"
                placeholder="dd/mm/yyyy"
                date={
                  !!stateGoOutInfo && stateGoOutInfo.dateGoIn
                    ? stateGoOutInfo.dateGoIn
                    : new Date()
                }
                status="basic"
                min={settings.minRangeDatePicker}
                max={settings.maxRangeDatePicker}
                dataService={settings.formatDateService}
                onSelect={(nextDate) =>
                  changeStateFormStep('dateGoIn', nextDate)
                }
                disabled={true}
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Datepicker
                label="Ngày dọn ra"
                date={stateGoOutInfo.dateGoOut}
                min={stateGoOutInfo.dateGoIn}
                max={settings.maxRangeDatePicker}
                status="basic"
                dataService={settings.formatDateService}
                onSelect={(nextDate) =>
                  changeStateFormStep('dateGoOut', nextDate)
                }
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Text style={styles.lb}>
                Số điện cũ: {`${stateGoOutInfo.roomInfo.oldElectrictNumber}`}
              </Text>
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Text style={styles.lb}>
                Số nước cũ: {`${stateGoOutInfo.roomInfo.oldWaterNumber}`}
              </Text>
            </View>
            <IncludeElectrictWater
              index={
                state.roomInfo?.room.TypeEW
                  ? parseInt(state.roomInfo?.room.TypeEW) - 1
                  : 0
              }
              waterTitle="Số nước mới"
              electrictTitle="Số Điện mới"
              priceDisplay={false}
              oldNumber={true}
              initialState={stateGoOutInfo.roomInfo}
              handleValueChange={_handleValueChange}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    paddingHorizontal: 15,
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
  leftInput: {
    borderRightWidth: 1,
    borderRightColor: color.darkColor,
    paddingRight: 10,
  },
  lb: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default GoOutInfo;
