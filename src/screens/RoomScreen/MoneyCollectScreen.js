import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import {
    Input,
    Select,
    SelectItem,
    Icon,
    Text,
    Divider,
    IndexPath,
    Button,
} from "@ui-kitten/components";
import { useRoute } from '@react-navigation/native'
import { color, sizes } from "~/config";
import UserInfo from "~/components/UserInfo";
import Loading from '~/components/common/Loading';
import { currencyFormat } from '~/utils';
import { getRoomById } from '~/api/MotelAPI';
import { Context as AuthContext } from '~/context/AuthContext'

const paymentMethod = ["Tiền mặt", "Chuyển khoản"];

const MoneyCollectScreen = () => {
    const { signOut } = useContext(AuthContext);
    const [paymentTypeIndex, setPaymentTypeIndex] = useState(new IndexPath(0));
    const [actuallyReceived, setActuallyReceived] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null);
    const route = useRoute();
    const { roomId,  data} = route.params;

    const loadRoomInfo = async () => {
        try {
            const res = await getRoomById({roomId});
            res.Code === 1 && setRoomInfo(res.Data);
            res.Code === 0 && Alert.alert('Lỗi !!', `${ JSON.stringify(res) }`);
            res.Code === 2 && ( () => {
                Alert.alert('Phiên đăng nhập của bạn đã hết hạng, hoặc tài khoản của bạn được đăng nhập ở nơi khác')
                signOut();
            } )();
        } catch (error) {
            console.log('loadRoomInfo error', error);
        }
    }
    useEffect(() => {
        (async () => {
            try {
                const userData = await AsyncStorage.getItem("userInfo");
                setUserInfo(JSON.parse(userData));
            } catch (err) {
                alert(JSON.stringify(err));
            }
        })();
        loadRoomInfo();
    }, []);

    return (
      <>
          <ScrollView>
              {userInfo ? (
                <UserInfo
                  avatar={userInfo.Avatar}
                  name={userInfo.FullName}
                  phone={userInfo.Phone}
                />
              ) : (
                <View style={{padding: 15, justifyContent: "center", alignItems: "center"}}><Loading /></View>
              )}
              {!!roomInfo
                ? ( <View style={styles.mainWrap}>
                    <View style={styles.section}>
                        <Text
                          category="h6"
                          status="primary"
                          style={{ marginBottom: 20 }}
                        >
                            { roomInfo.room.NameRoom }
                        </Text>
                        <View style={[styles.formWrap]}>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Tiền phòng:</Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                  ]}
                                >
                                    { currencyFormat(roomInfo.room.PriceRoom || 0) }
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Điện tháng này:
                                </Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                  ]}
                                >
                                    { roomInfo.electric.number }
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Nước tháng này:
                                </Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                  ]}
                                >
                                    { roomInfo.water.number }
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Phí dịch vụ:
                                </Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                  ]}
                                >
                                    { !!roomInfo.addons && roomInfo.addons.length > 0
                                      ? (()=>{
                                          let result = 0;
                                          roomInfo.addons.map(item => result + parseInt(item.Price || 0));
                                          return result
                                      })() : 0}
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Tiền dư:</Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                      roomInfo.dept > 0 ? {color: color.redColor} : { color:  color.greenColor}
                                  ]}
                                >
                                    { roomInfo.dept > 0
                                      ? ( `Nợ` )
                                      : ( `Dư` ) } {  currencyFormat(Math.abs(roomInfo.dept)) }
                                </Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={{ fontWeight: "600" }}>
                                    Tổng thu:
                                </Text>
                                <Text
                                  status="basic"
                                  style={[
                                      styles.rowValue,
                                      { fontWeight: "600" },
                                  ]}
                                >
                                    3.000.000
                                </Text>
                            </View>

                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Thực nhận:</Text>
                                <Input
                                  style={[
                                      styles.rowValue,
                                      styles.formControl,
                                  ]}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={actuallyReceived}
                                  textStyle={{
                                      color: color.redColor,
                                      textAlign: "right",
                                  }}
                                  onChangeText={(nextValue) =>
                                    setActuallyReceived(nextValue)
                                  }
                                />
                            </View>

                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Hình thức:</Text>
                                <Select
                                  style={[
                                      styles.rowValue,
                                      styles.formControl,
                                  ]}
                                  value={paymentMethod[paymentTypeIndex.row]}
                                  selectedIndex={paymentTypeIndex}
                                  onSelect={(index) =>
                                    setPaymentTypeIndex(index)
                                  }
                                >
                                    {paymentMethod
                                      ? paymentMethod.map((option) => (
                                        <SelectItem
                                          key={(option) => option}
                                          title={option}
                                        />
                                      ))
                                      : null}
                                </Select>
                            </View>
                        </View>
                    </View>
                    <Button
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
                        Thu tiền phòng này
                    </Button>
                </View> )
                : (
                  <View style={{padding: 15, justifyContent: "center", alignItems: "center"}}>
                      <Loading />
                  </View>
                )
              }

          </ScrollView>
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
        marginHorizontal: "-1%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    formRow: {
        marginBottom: 20,
        flexGrow: 1,
        marginHorizontal: "1%",
        alignItems: "center",
    },
    halfCol: {
        flexBasis: "48%",
    },
    fullWidth: {
        flexBasis: "98%",
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
    leftInput: {
        borderRightWidth: 1,
        borderRightColor: color.darkColor,
        paddingRight: 10,
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
    divider: {
        flexGrow: 1,
        width: "98%",
        marginHorizontal: "1%",
        backgroundColor: color.grayColor,
        marginBottom: 20,
    },
});

export default MoneyCollectScreen;
