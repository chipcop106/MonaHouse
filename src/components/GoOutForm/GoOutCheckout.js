import React, { useContext } from "react";
import {
    StyleSheet, View,
} from "react-native";
import {
    Input, Select, SelectItem, Icon, Text, Divider
} from "@ui-kitten/components";
import IncludeElectrictWater from "../GoInForm/IncludeElectrictWater";
import { sizes, color, settings } from "../../config";
import { create_UUID as randomId } from "../../utils";
import { Context as RoomGoOutContext } from "../../context/RoomGoOutContext";

const paymentMethod = ['Tiền mặt', 'Chuyển khoản'];

const GoOutCheckout = () => {
    const { state, changeStateFormStep } = useContext(RoomGoOutContext);
    const stateGoOutInfo = state.dataForm[state.step];
    const firstRoomState = state.dataForm[0];
    return (
        <>
            <View style={styles.mainWrap}>
                <View style={styles.section}>
                    <Text category="s1" status="primary" style={{marginBottom:20}}>Tiền điện / nước tới ngày: 19/05</Text>
                    <View style={[styles.formWrap]}>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>{firstRoomState.roomInfo.electrictNumber} kW X {firstRoomState.roomInfo.electrictPrice}</Text>
                            <Text status="basic" style={[styles.rowValue]}>3.000.000</Text>
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>{firstRoomState.roomInfo.waterNumber} kW X {firstRoomState.roomInfo.waterPrice}</Text>
                            <Text status="basic" style={[styles.rowValue]}>3.000.000</Text>
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Tiền tháng trước:</Text>
                            <Text status="basic" style={[styles.rowValue]}>Dư: 3.000.000</Text>
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Tiền cọc:</Text>
                            <Text status="basic" style={[styles.rowValue]}>3.000.000</Text>
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Loại cọc:</Text>
                            <Text status="basic" style={[styles.rowValue]}>Cọc giữ hạn tới hết hợp đồng</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Tổng thu:</Text>
                            <Text status="basic" style={[styles.rowValue,{fontWeight:'600'}]}>30.000.000</Text>
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Trả cọc:</Text>
                            <Input
                                style={[styles.rowValue,styles.formControl]}
                                placeholder="0"
                                keyboardType="numeric"
                                value={stateGoOutInfo.checkoutDeposit}
                                textStyle={{color:color.redColor, textAlign:'right'}}
                                onChangeText={(nextValue) => changeStateFormStep('checkoutDeposit', nextValue)}
                            />
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Thực nhận:</Text>
                            <Input
                              style={[styles.rowValue,styles.formControl]}
                                placeholder="0"
                                keyboardType="numeric"
                                value={stateGoOutInfo.actuallyReceived}
                                textStyle={{color:color.redColor, textAlign:'right'}}
                                onChangeText={(nextValue) => changeStateFormStep('actuallyReceived', nextValue)}
                            />
                        </View>
                        <View style={[styles.formRow, styles.rowInfo]}>
                            <Text style={styles.rowLabel}>Hình thức:</Text>
                            <Select
                              style={[styles.rowValue,styles.formControl]}
                                value={paymentMethod[stateGoOutInfo.paymentTypeIndex.row]}
                                selectedIndex={stateGoOutInfo.paymentTypeIndex}
                                onSelect={(index) => changeStateFormStep("paymentTypeIndex", index)}
                            >
                                {paymentMethod ? (paymentMethod.map((option) => <SelectItem key={(option) => option} title={option} />))
                                : null}
                            </Select>
                        </View>
            
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
        paddingHorizontal: 15,
        marginBottom: 30,
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
        marginHorizontal: '-1%',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    formRow: {
        marginBottom: 20,
        flexGrow: 1,
        marginHorizontal: "1%",
        alignItems:'center'
    },
    halfCol: {
        flexBasis: "48%",
    },
    fullWidth: {
        flexBasis: "98%",
    },
    leftInput: {
        borderRightWidth: 1, 
        borderRightColor: color.darkColor, 
        paddingRight: 10
    },
    rowInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "98%",
      },
      dangerValue: {
        color: color.redColor,
        fontWeight: "600",
      },
      leftInput: { borderRightWidth: 1, borderRightColor: color.darkColor, paddingRight: 10 },
      divider: {
        marginBottom: 15,
      },
      rowLabel: {
        color: color.labelColor,
      },
      rowValue: {
        fontWeight: "600",
        flexGrow: 1,
        textAlign: 'right',
        paddingLeft: 30
      },
      formControl:{
          width:'60%',
          flexGrow:0,
      }
});

export default GoOutCheckout;
