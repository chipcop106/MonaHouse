/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Button, Text, Icon } from "@ui-kitten/components";
import { color, sizes, shadowStyle } from "~/config";
import { useNavigation } from "@react-navigation/native";

const renderItemHeader = (headerprops, roomInfo, navigation) => {
  const { item } = roomInfo;

  return (
    <View {...headerprops} style={styles.headerWrap}>
      <TouchableOpacity
        onPress={() => navigation.navigate("MoneyCollectDetail")}
      >
        <Text style={styles.roomName} ellipsizeMode="tail" numberOfLines={1}>
          {item.RoomName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MoneyCard = ({ roomInfo }) => {
  const navigation = useNavigation();
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
                    3.000.000
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Điện tháng này:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    3.000.000
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Nước tháng này:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    3.000.000
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Phí dịch vụ:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    3.000.000
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={styles.rowLabel}>Tiền dư:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, { fontWeight: "600" }]}
                  >
                    3.000.000
                  </Text>
                </View>
                <View style={[styles.formRow, styles.rowInfo]}>
                  <Text style={{ fontWeight: "600" }}>Tổng thu:</Text>
                  <Text
                    status="basic"
                    style={[styles.rowValue, styles.dangerValue]}
                  >
                    3.000.000
                  </Text>
                </View>
              </View>
            </View>
            <Button
              onPress={() => navigation.navigate("MoneyCollectDetail")}
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

export default memo(MoneyCard);
