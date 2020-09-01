import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import { Text, Avatar, Icon } from "@ui-kitten/components";
import { color } from "~/config";
import gbStyle from "~/GlobalStyleSheet";

const UserInfo = ({
  avatar,
  name,
  phone,
  balance,
  styleContainer,
  styleCard,
}) => {
  return (
    <View style={[styles.userSection, styleContainer && styleContainer]}>
      <View style={[styles.section, styleCard && styleCard]}>
        <View style={styles.userWrap}>
          <View style={styles.userInfo}>
            <Avatar
              style={styles.avatar}
              shape="round"
              size="medium"
              source={
                avatar ? { uri: avatar } : require("~/../assets/user.png")
              }
            />
            <View style={gbStyle.mLeft10}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.phoneNumber}>
                {balance
                  ? `Số dư: ${balance}`
                  : phone && phone !== ""
                  ? phone
                  : "Chưa nhập SĐT"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              phone && phone !== "" && Linking.openURL(`tel:${phone}`)
            }
          >
            <Icon
              name="phone-outline"
              fill={color.primary}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  userWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  userSection: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  userPhone: {
    color: color.labelColor,
  },
});

export default memo(UserInfo);
