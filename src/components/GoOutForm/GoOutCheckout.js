import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
    StyleSheet, View, Alert,
} from "react-native";
import {
    Input, Select, SelectItem, Text, Divider
} from "@ui-kitten/components";
import Moment from 'moment'
import { color } from "../../config";
import { Context as RoomGoOutContext } from "../../context/RoomGoOutContext";
import { ReadyGoOut } from "~/api/RenterAPI";
import { currencyFormat } from '~/utils';
import Loading from '~/components/common/Loading'
import { Context as AuthContext } from "~/context/AuthContext";
const paymentMethod = ['Tiền mặt', 'Chuyển khoản'];

const GoOutCheckout = () => {
    const { state, changeStateFormStep, loadDataBill } = useContext(RoomGoOutContext);
    const { signOut } = useContext(AuthContext);
    const stateGoOutInfo = state.dataForm[state.step];
    const { billInfo  } = stateGoOutInfo;
    const firstRoomState = state.dataForm[0];
    const [loading, setloading] = useState(false);

    const loaddata = async () => {
        try {
            setloading(true);
            const res = await ReadyGoOut({ roomid: firstRoomState.roomID, renterid:  firstRoomState.renterID});
            console.log('ReadyGoOut RES', res.Data);
            // stateGoOutInfo:
            // moneyLastMonth: '',
            // depositMoney: '',
            // depositType: '',
            // checkoutDeposit: "",
            // actuallyReceived: "",
            // paymentTypeIndex: new IndexPath(0),
            res.Code === 1 && await loadDataBill(res.Data);
            res.Code === 2 && signOut();
            res.Code === 0 && Alert.alert('Lỗi !', `${JSON.stringify(res)}`);
            setloading(false);
        } catch (err) {
            setloading(false);
            console.log('ReadyGoOut loaddata err', err);
        }
    }
    useEffect(() => {
        console.log('RoomGoOutContext', state);
        loaddata();
    }, [])
    const calcBuget = () => {
        try {
            
        } catch (error) {
            
        }
       return 0;
    }
    const renderPriceValue = (price, count) => {
        
        try {
            return currencyFormat( parseInt(price) *  parseInt(count) );
        } catch (error) {
            return 0
        }
    }
    return (
        <>{loading 
            ? <View style={{padding: 15, alignItems: "center"}}><Loading /></View> 
            : <View style={styles.mainWrap}>
            <View style={styles.section}>
                <Text category="s1" status="primary" style={{marginBottom:20}}>Tiền điện / nước tới ngày: {`${ Moment(firstRoomState.dateGoOut).format('DD/MM') }`}</Text>
                <View style={[styles.formWrap]}>
                    <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>{billInfo?.electricDiff} kW X {`${ currencyFormat(firstRoomState.roomInfo?.electrictPrice) }`}</Text>
                        <Text status="basic" style={[styles.rowValue]}>{ `${ currencyFormat(billInfo?.electricDiffPrice) }` }</Text>
                    </View>
                    <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>{billInfo?.waterDiff} khối X {`${ currencyFormat(firstRoomState.roomInfo?.waterPrice) }`}</Text>
                        <Text status="basic" style={[styles.rowValue]}>{ `${ currencyFormat(billInfo?.waterDiffPrice) }` }</Text>
                    </View>
                    <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>Tiền thuê:</Text>
                        <Text status="basic" style={[styles.rowValue]}>{ `${currencyFormat(billInfo?.priceRoomBase)}` }</Text>
                    </View>
                    <View style={[styles.formRow, styles.rowInfo]}>
        <Text style={styles.rowLabel}>Tiền thuê ({ billInfo?.dateDiff } ngày)</Text>
                        <Text status="basic" style={[styles.rowValue]}>{ `${ currencyFormat(billInfo?.priceRoomByDate) }` }</Text>
                    </View>
                    <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>Tiền cọc:</Text>
                        <Text status="basic" style={[styles.rowValue]}>3.000.000</Text>
                    </View>
                    {/* <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>Loại cọc:</Text>
                        <Text status="basic" style={[styles.rowValue]}>Cọc giữ hạn tới hết hợp đồng</Text>
                    </View> */}
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
        </View>}
            
        </>
    );
};

const styles = StyleSheet.create({
    sup: {
        fontSize: 12,
        display: "flex"
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
