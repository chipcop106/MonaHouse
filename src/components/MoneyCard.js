/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Button, Text, Icon, Input } from '@ui-kitten/components'
import { color, sizes, shadowStyle } from "~/config";
import { useNavigation } from "@react-navigation/native";
import { currencyFormat, renderNumberByArray } from '~/utils'

const renderItemHeader = (headerprops, roomInfo, navigation) => {
  const { item } = roomInfo;
  return (
    <View {...headerprops} style={styles.headerWrap}>
      <TouchableOpacity
        onPress={() => navigation.navigate("MoneyCollectDetail", { roomId:  item.roomId})}
      >
        <Text style={styles.roomName} ellipsizeMode="tail" numberOfLines={1}>
          {item.roomName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MoneyCard = ({ roomInfo, handleValueChange }) => {
  const navigation = useNavigation();
  const { item } = roomInfo;

  const total = item.priceRoom
    + item.electricPrice * item.electricUsed
    + item.waterPrice * item.waterUsed
    + renderNumberByArray(item.Services, 'servicePrice')
    + renderNumberByArray(item.FeeIncurred, 'feePrice');

  const [inputTotal, setInputTotal] = useState();
  useEffect(() => {
    setInputTotal(currencyFormat(total + item.totalDebt*-1));
    handleValueChange(`${ total + item.totalDebt*-1 }`);
  },[]);
  const _onPressService = () => {
    console.log(item.Services);
  }
  const  _onPressFee = () => {
    console.log(item.FeeIncurred);
  }
  const _onChangeTextTotal = text => {
    setInputTotal(text.replace(/[^0-9\-]/g, ""))
  }
  const _onEndEditingTotal = ({ nativeEvent: { text } }) => {
    handleValueChange(text.replace(/[^0-9\-]/g, ""));
  }
  return (
    <View style={styles.item}>
      <Card
        appearance="filled"
        status="basic"
        disabled
        header={(headerProps) =>
          renderItemHeader(headerProps, roomInfo, navigation)
        }
      >
        <View style={styles.cardBody}>
          <View style={styles.mainWrap}>
            <View style={styles.section}>
              <View style={[styles.formWrap]}>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Tiền phòng:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    { currencyFormat(item.priceRoom) }
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Điện tháng này: { `${ item.electricUsed } ký` }</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    { currencyFormat(`${ item.electricPrice * item.electricUsed }`) }
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Nước tháng này: { `${ item.waterUsed } m3` }</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    { currencyFormat(`${ item.waterPrice * item.waterUsed }`) }
                  </Text>
                </View>
                <TouchableOpacity style={[styles.formRow, styles.rowInfo]} onPress={_onPressService}>
                  <Text style={styles.rowLabel}>Phí dịch vụ:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    { `${ currencyFormat(renderNumberByArray(item.Services, 'servicePrice')) }` }
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formRow, styles.rowInfo]} onPress={_onPressFee}>
                  <Text style={styles.rowLabel}>Phụ thu:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    { `${ currencyFormat(renderNumberByArray(item.FeeIncurred, 'feePrice')) }` }
                  </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={{ fontWeight: "600" }}>Tổng thu:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, styles.dangerValue]}
                  >
                    { currencyFormat( total ) }
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={{ fontWeight: "600" }}>Tháng rồi { item.totalDebt < 0 ? `thiếu` :  item.totalDebt === 0 ? `đủ` : `dư`}:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, item.totalDebt < 0 ? styles.dangerValue : styles.successValue]}
                  >
                    { currencyFormat( Math.abs(item.totalDebt) ) }
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={{ fontWeight: "600" }}>Thực nhận:</Text>
                  <Input
                    returnKeyType={"done"}
                    style={[styles.rowValue, styles.dangerValue]}
                    textAlign={'right'}
                    placeholder="000.000.000"
                    textContentType="none"
                    keyboardType="numeric"
                    value={`${ currencyFormat(inputTotal) }`}
                    onChangeText={_onChangeTextTotal}
                    onEndEditing={_onEndEditingTotal}
                  />
                </View>
              </View>
            </View>
            <Button
              onPress={() => navigation.navigate("MoneyCollectDetail", {roomId: item.roomId})}
              accessoryLeft={() => (
                <Icon
                  name="credit-card-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}
              size="large"
              status="success"
            >
              Chỉ thu phòng này
            </Button>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 6,
    ...shadowStyle,
  },
  headerWrap: {
    backgroundColor: color.primary,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: "relative",
  },
  roomName: {
    fontSize: 20,
    fontWeight: "700",
    color: color.whiteColor,
    paddingRight: 45,
  },
  section: {
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  formWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  formRow: {
    marginBottom: 20,
    flexGrow: 1,
    alignItems: "center",
  },

  rowInfo: {
    flexDirection: "row",
    marginHorizontal: 0,
    justifyContent: "space-between",
    width: "100%",
  },
  dangerValue: {
    color: color.redColor,
    fontWeight: "600",
  },
  successValue: {
    color: color.success,
    fontWeight: "600",
  },
  divider: {
    marginBottom: 15,
    height: 1,
    width: '100%',
    backgroundColor: "#e1e1e1e1"
  },
  rowLabel: {
    color: color.labelColor,
  },
  rowValue: {
    fontWeight: "600",
    flexGrow: 1,
    textAlign: "right",
    paddingLeft: 30,
  },
  formControl: {
    width: "60%",
    flexGrow: 0,
  },
});

export default MoneyCard;
