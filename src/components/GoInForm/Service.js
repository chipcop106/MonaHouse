import React, { useState, useMemo } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Input, Icon } from "@ui-kitten/components";
import { color } from "../../config";
import { currencyFormat as cf } from "~/utils";

const Service = ({
  initialState: { name, price },
  onDelete,
  onChangeValue,
  onBlur,
}) => {
  const [nameState, setNameState] = useState(name);
  const [priceState, setPriceState] = useState(price);

  return (
    <View style={styles.svContainer}>
      <View style={[styles.svName]}>
        <Input
          status="primary"
          textStyle={styles.textInput}
          placeholder="Internet/phí giữ xe/tiền nước bình"
          value={nameState}
          onChangeText={(nextValue) => {
            setNameState(nextValue);
            !!onChangeValue &&
              onChangeValue({ name: nextValue, price: priceState });
          }}
          onBlur={() =>
            onBlur && onBlur({ name: nameState, price: priceState })
          }
          textContentType="none"
          keyboardType="default"
        />
      </View>
      <View style={[styles.svPrice]}>
        <Input
          textStyle={styles.textInput}
          placeholder="Số tiền"
          value={cf(priceState)}
          onChangeText={(nextValue) => {
            setPriceState(nextValue.replace(/[^0-9\-]/g, ""));
            !!onChangeValue &&
              onChangeValue({
                name: nameState,
                price: nextValue.replace(/[^0-9\-]/g, ""),
              });
          }}
          onBlur={() =>
            onBlur && onBlur({ name: nameState, price: priceState })
          }
          textContentType="none"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.svDelete} onPress={onDelete}>
        <Icon
          name="minus-circle-outline"
          fill={color.redColor}
          style={styles.deleteButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  svContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    marginBottom: 10,
  },
  svName: {
    marginHorizontal: "2%",
    width: "46%",
    flexShrink: 0,
  },
  svPrice: {
    marginHorizontal: "2%",
    width: "46%",
    flexShrink: 0,
    paddingRight: 40,
  },
  svDelete: {
    position: "absolute",
    right: "0%",
    top: 0,
    padding: 5,
  },
  deleteButton: {
    width: 30,
    height: 30,
  },
});

export default Service;
