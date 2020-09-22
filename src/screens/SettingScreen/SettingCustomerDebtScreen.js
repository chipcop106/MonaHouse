import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { Text, Input, Icon, Avatar } from "@ui-kitten/components";
import { color, shadowStyle, sizes } from "~/config";
import ModalizeSelect from "~/components/common/ModalizeSelect";
import { Context as MotelContext } from "~context/MotelContext";
import { currencyFormat, nonAccentVietnamese } from "~/utils";
import Loading from "~/components/common/Loading";
import { Context as CustomerContext } from "~context/CustomerContext";
import { useNavigation } from "@react-navigation/native";

const SearchBox = ({ defaultValue = "" }) => {
  const [state, setState] = useState(defaultValue);
  const { setQuerySearch } = useContext(CustomerContext);
  return (
    <Input
      returnKeyType={"done"}
      value={state}
      accessoryRight={() => (
        <TouchableOpacity onPress={() => setQuerySearch(state)}>
          <Icon
            name="search-outline"
            fill={color.blackColor}
            style={sizes.iconButtonSize}
          />
        </TouchableOpacity>
      )}
      size="large"
      onChangeText={(text) => {
        setState(text);
      }}
      onEndEditing={() => setQuerySearch(state)}
      // onChange={() => setQuerySearch(state)}
      // onSubmitEditing={_onSubmitSearch}
      placeholder="Tìm tên khách hàng"
    />
  );
};

const RenderCardCustomer = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push("RoomDetailStack", {
          screen: "RoomDetail",
          params: {
            roomId: item.MotelRoomID,
          },
        })
      }
    >
      <View style={styles.userCard}>
        <View style={styles.topCard}>
          <View style={styles.topLeft}>
            <Avatar
              style={styles.avatar}
              shape="round"
              size="medium"
              source={
                item?.Avatar
                  ? { uri: item.Avatar }
                  : require("~/../assets/user.png")
              }
            />
            <View style={styles.info}>
              <Text style={styles.userName}>{item.FullName}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexGrow: 1 }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.PhoneNumber}`)}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="phone-outline"
                        style={{ width: 15, height: 15, marginRight: 5 }}
                        fill={color.labelColor}
                      />
                      <Text style={{ ...styles.phoneNumber }}>
                        {item.PhoneNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: 150,
                  }}
                >
                  <Text style={{ color: color.labelColor }}>Tiền nợ:</Text>
                  <Text
                    style={{
                      ...styles.value,
                      color: color.redColor,
                    }}
                  >
                    {currencyFormat(item.Debt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomCard}>
          <View style={styles.bottomInfo}>
            <Icon
              fill={color.labelColor}
              name="home"
              style={sizes.iconButtonSize}
            />
            <Text style={styles.value} ellipsizeMode="tail" numberOfLines={1}>
              {item.MotelName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SettingCustomerDebtScreen = () => {
  const {
    state,
    getUserDebtByMotelId,
    setSelectedMotel,
    setFilterData,
    setMotelLists,
  } = useContext(CustomerContext);
  console.log({ state });
  const { state: motelState } = useContext(MotelContext);
  const [isLoading, setIsLoading] = useState(true);

  const getListCustomer = async () => {
    setIsLoading(true);
    await getUserDebtByMotelId(
      state.activeMotel === 0
        ? 0
        : motelState.listMotels[state.activeMotel - 1].ID
    );
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    !!motelState.listMotels &&
      motelState.listMotels.length > 0 &&
      setMotelLists([
        "Tất cả trọ",
        ...motelState.listMotels.map((item) => item.MotelName),
      ]);
    setIsLoading(false);
  }, [motelState.listMotels]);

  useEffect(() => {
    setFilterData(
      state.customers?.length &&
        [...state.customers].filter(
          (item) =>
            nonAccentVietnamese(item.FullName)
              .toUpperCase()
              .indexOf(state?.queryString.toLocaleUpperCase()) > -1
        )
    );
  }, [state.customers, state.queryString]);

  useEffect(() => {
    getListCustomer();
  }, [state.activeMotel]);

  return (
    <>
      <View style={styles.filterWrap}>
        <ModalizeSelect
          onChange={(index, selected) => setSelectedMotel(index)}
          pickerData={state?.motelLists ?? []}
          selectedValue={
            state?.motelLists[state?.activeMotel ?? 0] ?? "Chọn nhà trọ"
          }
          leftIcon="home"
          disabled={isLoading}
        />
      </View>
      <View style={{ backgroundColor: color.bgmain }}>
        <View style={styles.wrapCard}>
          <SearchBox />
        </View>
      </View>
      {isLoading ? (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Loading />
        </View>
      ) : (
        <FlatList
          style={styles.container}
          keyExtractor={(item, index) => `${item.ID}-${index}`}
          data={state.filterCustomers}
          extraData={state.filterCustomers}
          renderItem={({ item, index }) => (
            <RenderCardCustomer
              item={{
                ...item,
                CustomerID: item.ID,
                Avatar: item.LinkIMGThumbnail,
                FullName: item.FullName,
                Debt: item.Money,
                Status: item.StatusRen,
                MotelName: motelState.listMotels.find(
                  (motel) => motel.ID === item.MotelID
                ).MotelName,
                PhoneNumber: item.Phone,
              }}
            />
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,
  },
  wrapCard: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    ...shadowStyle,
    marginBottom: 15,
  },
  filterWrap: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: color.darkColor,
  },
  userCard: {
    padding: 15,
    backgroundColor: color.whiteColor,
    marginBottom: 15,
    ...shadowStyle,
  },
  topCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: color.lightWeight,
    paddingBottom: 15,
  },
  bottomCard: {
    flexDirection: "row",
    paddingTop: 15,
    alignItems: "center",
  },
  topLeft: {
    flexGrow: 1,
    flexDirection: "row",
  },
  topRight: {
    flexShrink: 0,
  },
  avatar: {
    marginRight: 15,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  phoneNumber: {},
  bottomInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  value: {
    marginLeft: 5,
  },
  info: {
    flexGrow: 1,
  },
});

export default SettingCustomerDebtScreen;
