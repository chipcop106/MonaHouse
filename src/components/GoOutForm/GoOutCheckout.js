import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import {
  Input,
  Select,
  SelectItem,
  Text,
  Divider,
} from "@ui-kitten/components";
import Moment from "moment";
import { color } from "~/config";
import { Context as RoomGoOutContext } from "~/context/RoomGoOutContext";
import { Context as AuthContext } from "~/context/AuthContext";
import { currencyFormat } from "~/utils";
import Loading from "~/components/common/Loading";
import { ReadyGoOut } from "~/api/RenterAPI";
const paymentMethod = ["Tiền mặt", "Chuyển khoản"];

const GoOutCheckout = () => {
  const { state, changeStateFormStep, loadDataBill } = useContext(
    RoomGoOutContext
  );
  const { signOut } = useContext(AuthContext);
  const stateGoOutInfo = state.dataForm[state.step];
  const { billInfo } = stateGoOutInfo;
  const firstRoomState = state.dataForm[0];
  const [loading, setLoading] = useState(false);
  console.log(state);
  const loadBillInfo = async () => {
    setLoading(true);
    try {
      const res = await ReadyGoOut({
        roomid: firstRoomState.roomID,
        renterid: firstRoomState.renterID,
      });
      res.Code === 1 && (await loadDataBill(res.Data));
      res.Code === 2 && signOut();
      res.Code === 0 && Alert.alert("Lỗi code 0 !", `${JSON.stringify(res)}`);
    } catch (e) {
      console.log(e?.message ?? "Lỗi call api load bill info");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("RoomGoOutContext", state);
    loadBillInfo();
  }, []);

  return (
    <>
      {loading ? (
        <View style={{ padding: 15, alignItems: "center" }}>
          <Loading />
        </View>
      ) : (
        <View style={styles.mainWrap}>
          <View style={styles.section}>
            <Text category="s1" status="primary" style={{ marginBottom: 20 }}>
              Tiền điện / nước tới ngày:{" "}
              {`${Moment(firstRoomState.dateGoOut).format("DD/MM")}`}
            </Text>
            <View style={[styles.formWrap]}>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>
                  {billInfo?.electricDiff ?? 0} kW{" "}
                  <Text style={{ fontWeight: "bold" }}>X</Text>{" "}
                  {`${currencyFormat(
                    firstRoomState.roomInfo?.electrictPrice ?? 0
                  )}`}
                </Text>
                <Text
                  status="basic"
                  style={[styles.rowValue]}
                >{`${currencyFormat(billInfo?.electricDiffPrice ?? 0)}`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>
                  {billInfo?.waterDiff} Khối{" "}
                  <Text style={{ fontWeight: "bold" }}>X</Text>{" "}
                  {`${currencyFormat(firstRoomState.roomInfo?.waterPrice)}`}
                </Text>
                <Text
                  status="basic"
                  style={[styles.rowValue]}
                >{`${currencyFormat(billInfo?.waterDiffPrice)}`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Tiền thuê:</Text>
                <Text
                  status="basic"
                  style={[styles.rowValue]}
                >{`${currencyFormat(billInfo?.priceRoomBase ?? 0)}`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>
                  Tiền thuê ({billInfo?.dateDiff ?? 0} ngày)
                </Text>
                <Text status="basic" style={[styles.rowValue]}>{`${
                  currencyFormat(billInfo?.priceRoomByDate) ?? 0
                }`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Tiền dịch vụ:</Text>
                <Text
                  status="basic"
                  style={[styles.rowValue]}
                >{`${currencyFormat(billInfo?.priceAddon ?? 0)}`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Chi phí phát sinh khác:</Text>
                <Text
                  status="basic"
                  style={[styles.rowValue]}
                >{`${currencyFormat(billInfo?.incurredFee ?? 0)}`}</Text>
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Trừ tiền đã cọc:</Text>
                <Text status="danger" style={[styles.rowValue]}>
                  -{currencyFormat(billInfo?.deposit)}
                </Text>
              </View>
              {/* <View style={[styles.formRow, styles.rowInfo]}>
                        <Text style={styles.rowLabel}>Loại cọc:</Text>
                        <Text status="basic" style={[styles.rowValue]}>Cọc giữ hạn tới hết hợp đồng</Text>
                    </View> */}
              <Divider style={styles.divider} />
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Tổng thu:</Text>
                <Text
                  status="basic"
                  style={[styles.rowValue, { fontWeight: "600" }]}
                >
                  {currencyFormat(billInfo?.totalCollect ?? 0)}
                </Text>
              </View>
              {/*<View style={[styles.formRow, styles.rowInfo]}>*/}
              {/*  <Text style={styles.rowLabel}>Trả cọc:</Text>*/}
              {/*  <Input*/}
              {/*    style={[styles.rowValue, styles.formControl]}*/}
              {/*    placeholder="0"*/}
              {/*    keyboardType="numeric"*/}
              {/*    value={currencyFormat(stateGoOutInfo.checkoutDeposit)}*/}
              {/*    textStyle={{ color: color.redColor, textAlign: "right" }}*/}
              {/*    onChangeText={(nextValue) =>*/}
              {/*      changeStateFormStep("checkoutDeposit", nextValue)*/}
              {/*    }*/}
              {/*  />*/}
              {/*</View>*/}
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Thực nhận:</Text>
                <Input
                  style={[styles.rowValue, styles.formControl]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={currencyFormat(stateGoOutInfo.actuallyReceived)}
                  textStyle={{ color: color.redColor, textAlign: "right" }}
                  onChangeText={(nextValue) =>
                    changeStateFormStep(
                      "actuallyReceived",
                      nextValue.replace(/[^0-9\-]/g, "")
                    )
                  }
                />
              </View>
              <View style={[styles.formRow, styles.rowInfo]}>
                <Text style={styles.rowLabel}>Hình thức:</Text>
                <Select
                  style={[styles.rowValue, styles.formControl]}
                  value={paymentMethod[stateGoOutInfo.paymentTypeIndex.row]}
                  selectedIndex={stateGoOutInfo.paymentTypeIndex}
                  onSelect={(index) =>
                    changeStateFormStep("paymentTypeIndex", index)
                  }
                >
                  {paymentMethod
                    ? paymentMethod.map((option) => (
                        <SelectItem key={(option) => option} title={option} />
                      ))
                    : null}
                </Select>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sup: {
    fontSize: 12,
    display: "flex",
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
  leftInput: {
    borderRightWidth: 1,
    borderRightColor: color.darkColor,
    paddingRight: 10,
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
  divider: {
    marginBottom: 15,
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

export default GoOutCheckout;
