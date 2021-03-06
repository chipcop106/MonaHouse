import React, { useContext, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Input, Select, SelectItem, Divider } from "@ui-kitten/components";
import { color } from "../../config";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { pad } from "../../utils";
import { currencyFormat as cf } from "~/utils";
import { getPaymentMethod as getPaymentAPI } from "~/api/CollectMoneyAPI";

const prePaymentTime = [];
for (let i = 1; i < 13; i += 1) {
  prePaymentTime.push(`Hết tháng ${i}`);
}

const preDepositTime = prePaymentTime.map(
  (item, index) => `${pad(index + 1)} tháng`
);

const depositType = ["Cọc giữ tới hết hạn hợp đồng"];

// const paymentType = ["Chuyển khoản", "Tiền mặt"];

const CheckoutInfoForm = () => {
  const { state: RoomGoInState, changeStateFormStep } = useContext(
    RoomGoInContext
  );
  const stateCheckout = RoomGoInState.dataForm[RoomGoInState.step];
  const roomInfo = RoomGoInState.dataForm[0];
  const { paymentType } = stateCheckout;

  const _onSelectPreDeposit = (nextIndex) => {
    changeStateFormStep("preDepositTimeIndex", nextIndex);
    console.log({ nextIndex });
    changeStateFormStep(
      "totalDeposit",
      `${roomInfo.roomPrice * parseInt(nextIndex)}`
    );
  };

  const _onSelectPrePay = (nextIndex) => {
    changeStateFormStep("prePaymentTimeIndex", nextIndex);
    changeStateFormStep(
      "totalPrepay",
      `${roomInfo.roomPrice * parseInt(nextIndex)}`
    );
  };

  const getPaymentMethod = async () => {
    try {
      const res = await getPaymentAPI();
      console.log(res);
      res.Code === 1
        ? changeStateFormStep("paymentType", res.Data)
        : alert("Lấy dữ liệu không thành công");
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  useEffect(() => {
    changeStateFormStep(
      "totalDeposit",
      `${roomInfo.roomPrice * parseInt(stateCheckout.preDepositTimeIndex)}`
    );
    changeStateFormStep(
      "totalPrepay",
      `${roomInfo.roomPrice * parseInt(stateCheckout.prePaymentTimeIndex)}`
    );
    getPaymentMethod();
    console.log({ roomInfo, stateCheckout });
  }, []);

  return (
    <>
      <View style={styles.mainWrap}>
        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Giá phòng và phí</Text>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Giá phòng</Text>
              <Text style={styles.rowValue}>{cf(roomInfo.roomPrice)}</Text>
            </View>
            {!!RoomGoInState.dataForm[0].services &&
              RoomGoInState.dataForm[0].services.length > 0 && (
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Dịch vụ</Text>
                  <Text style={styles.rowValue}>
                    {cf(
                      RoomGoInState.dataForm[0].services.reduce((prev, cur) => {
                        return (
                          prev +
                          parseInt(cur.value.price.replace(/[^0-9\-]/g, ""))
                        );
                      }, 0)
                    )}
                  </Text>
                </View>
              )}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Tiền cọc</Text>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Loại cọc"
                value={
                  depositType[stateCheckout.depositTypeIndex.row] ||
                  "Chọn loại cọc"
                }
                selectedIndex={stateCheckout.depositTypeIndex}
                onSelect={(nextIndex) =>
                  changeStateFormStep("depositTypeIndex", nextIndex)
                }
              >
                {depositType
                  ? depositType.map((option, index) => (
                      <SelectItem key={index} title={option} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Trả trước"
                value={
                  preDepositTime[stateCheckout.preDepositTimeIndex.row] ||
                  "Thời gian trả trước"
                }
                selectedIndex={stateCheckout.preDepositTimeIndex}
                onSelect={_onSelectPreDeposit}
              >
                {preDepositTime
                  ? preDepositTime.map((option, index) => (
                      <SelectItem key={index} title={option} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                textStyle={styles.dangerValue}
                disabled
                accessoryLeft={() => (
                  <View style={styles.leftInput}>
                    <Text>
                      {`${pad(stateCheckout.preDepositTimeIndex)} tháng`}
                    </Text>
                  </View>
                )}
                label="Tổng tiền cọc"
                placeholder=""
                value={cf(stateCheckout.totalDeposit)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Trả trước</Text>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Trả trước tới"
                value={
                  prePaymentTime[stateCheckout.prePaymentTimeIndex.row] ||
                  "Trả trước tới"
                }
                selectedIndex={stateCheckout.prePaymentTimeIndex}
                onSelect={_onSelectPrePay}
              >
                {prePaymentTime
                  ? prePaymentTime.map((option, index) => (
                      <SelectItem key={index} title={option} />
                    ))
                  : null}
              </Select>
            </View>

            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                textStyle={styles.dangerValue}
                disabled
                accessoryLeft={() => (
                  <View style={styles.leftInput}>
                    <Text>
                      {`${pad(stateCheckout.prePaymentTimeIndex)} tháng`}
                    </Text>
                  </View>
                )}
                label="Tổng tiền"
                placeholder=""
                value={cf(stateCheckout.totalPrepay)}
                onChangeText={(nextValue) =>
                  changeStateFormStep(
                    "totalPrepay",
                    nextValue.replace(/[^0-9\-]/g, "")
                  )
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Thanh toán</Text>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Tiền cọc</Text>
              <Text style={[styles.rowValue, styles.fontBold, styles.row]}>
                {cf(stateCheckout.totalDeposit) || "0"}
              </Text>
            </View>
            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Tiền trả trước</Text>
              <Text style={styles.rowValue}>
                {" "}
                {cf(stateCheckout.totalPrepay) || "0"}
              </Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.formWrap}>
            <View
              style={[styles.formRow, styles.rowInfo, { marginBottom: 30 }]}
            >
              <Text style={styles.rowValue}>Tổng thu</Text>
              <Text style={[styles.dangerValue, styles.rowValue]}>
                {cf(
                  parseInt(stateCheckout.totalPrepay) +
                    parseInt(stateCheckout.totalDeposit)
                )}
              </Text>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                label="Thực nhận của khách"
                placeholder="0"
                value={cf(stateCheckout.actuallyReceived)}
                onChangeText={(nextValue) =>
                  changeStateFormStep(
                    "actuallyReceived",
                    nextValue.replace(/[^0-9\-]/g, "")
                  )
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Hình thức thanh toán"
                value={
                  paymentType[stateCheckout.paymentTypeIndex.row]?.text ??
                  "Hình thức thanh toán"
                }
                selectedIndex={stateCheckout.paymentTypeIndex}
                onSelect={(nextIndex) =>
                  changeStateFormStep("paymentTypeIndex", nextIndex)
                }
              >
                {paymentType
                  ? paymentType.map((option, index) => (
                      <SelectItem key={option.id} title={option.text} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                label="Ghi chú thanh toán"
                placeholder="Ghi chú"
                value={stateCheckout.paymentNote}
                onChangeText={(nextValue) =>
                  changeStateFormStep("paymentNote", nextValue)
                }
                textContentType="none"
                keyboardType="default"
              />
            </View>
          </View>
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
    marginBottom: 15,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  formWrap: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  formRow: {
    marginBottom: 15,
    flexGrow: 1,
    marginHorizontal: "1%",
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
  divider: {
    marginBottom: 15,
  },
  rowLabel: {
    color: color.labelColor,
  },
  rowValue: {
    fontWeight: "600",
  },
});

export default CheckoutInfoForm;
