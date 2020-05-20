import React, { useContext } from "react";
import {
  Text, StyleSheet, View,
} from "react-native";
import {
  Input, Select, SelectItem, Divider,
} from "@ui-kitten/components";
import { color } from "../../config";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { pad } from "../../utils";

const prePaymentTime = [];
for (let i = 1; i < 13; i += 1) {
  prePaymentTime.push(`Hết tháng ${i}`);
}

const preDepositTime = prePaymentTime.map((item, index) => `${pad(index + 1)} tháng`);

const depositType = ["Cọc giữ tới hết hạn hợp đồng", "Cọc trừ dần tính từ tháng thứ"];

const paymentType = ["Chuyển khoản", "Tiền mặt"];

const CheckoutInfoForm = () => {
  const { state: RoomGoInState, changeStateFormStep } = useContext(RoomGoInContext);
  const stateCheckout = RoomGoInState.dataForm[RoomGoInState.step];

  return (
    <>
      <View style={styles.mainWrap}>
        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Giá phòng và phí</Text>
          <View style={[styles.formWrap]}>

            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Giá phòng</Text>
              <Text style={styles.rowValue}>3.000.000</Text>
            </View>
            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Dịch vụ</Text>
              <Text style={styles.rowValue}>332.3232</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.secTitle]}>Tiền cọc</Text>
          <View style={[styles.formWrap]}>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Loại cọc"
                value={depositType[stateCheckout.depositTypeIndex.row] || "Chọn loại cọc"}
                selectedIndex={stateCheckout.depositTypeIndex}
                onSelect={(nextIndex) => changeStateFormStep("depositTypeIndex", nextIndex)}
              >
                {depositType ? (depositType.map((option, index) => <SelectItem key={index} title={option} />))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Trả trước"
                value={preDepositTime[stateCheckout.preDepositTimeIndex.row] || "Thời gian trả trước"}
                selectedIndex={stateCheckout.preDepositTimeIndex}
                onSelect={(nextIndex) => changeStateFormStep("preDepositTimeIndex", nextIndex)}
              >
                {preDepositTime ? (preDepositTime.map((option, index) => <SelectItem key={index} title={option} />))
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
                value={stateCheckout.totalDeposit}
                onChangeText={(nextValue) => changeStateFormStep("totalDeposit", nextValue)}
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
                value={prePaymentTime[stateCheckout.prePaymentTimeIndex.row] || "Trả trước tới"}
                selectedIndex={stateCheckout.prePaymentTimeIndex}
                onSelect={(nextIndex) => changeStateFormStep("prePaymentTimeIndex", nextIndex)}
              >
                {prePaymentTime ? (prePaymentTime.map((option, index) => <SelectItem key={index} title={option} />))
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
                value={stateCheckout.totalDeposit}
                onChangeText={(nextValue) => changeStateFormStep("totalDeposit", nextValue)}
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
              <Text style={[styles.rowValue, styles.fontBold, styles.row]}>332.3232</Text>
            </View>
            <View style={[styles.formRow, styles.rowInfo]}>
              <Text style={styles.rowLabel}>Tiền trả trước</Text>
              <Text style={styles.rowValue}>332.3232</Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.formWrap}>

            <View style={[styles.formRow, styles.rowInfo, { marginBottom: 30 }]}>
              <Text style={styles.rowValue}>Tổng thu</Text>
              <Text style={[styles.dangerValue, styles.rowValue]}>332.3232</Text>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                label="Thực nhận của khách"
                placeholder="0"
                value={stateCheckout.actuallyReceived}
                onChangeText={(nextValue) => changeStateFormStep("actuallyReceived", nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Select
                label="Hình thức thanh toán"
                value={paymentType[stateCheckout.paymentTypeIndex.row] || "Hình thức thanh toán"}
                selectedIndex={stateCheckout.paymentTypeIndex}
                onSelect={(nextIndex) => changeStateFormStep("paymentTypeIndex", nextIndex)}
              >
                {paymentType ? (paymentType.map((option, index) => <SelectItem key={index} title={option} />))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.fullWidth]}>
              <Input
                label="Ghi chú thanh toán"
                placeholder="0"
                value={stateCheckout.paymentNote}
                onChangeText={(nextValue) => changeStateFormStep("paymentNote", nextValue)}
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
    marginBottom: 30,
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
  leftInput: { borderRightWidth: 1, borderRightColor: color.darkColor, paddingRight: 10 },
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
