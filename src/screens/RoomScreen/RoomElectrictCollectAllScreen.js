import React, {
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  StyleSheet,
  View,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import { List, Button, Icon, IndexPath } from "@ui-kitten/components";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useHeaderHeight } from "@react-navigation/stack";
import { color, settings, sizes } from "~/config";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import FilterHeader from "~/components/FilterHeader";
import ElectrictCard from "~/components/ElectrictCard";
import NavLink from "~/components/common/NavLink";
import Loading from "~/components/common/Loading";

const initialState = {
  isLoading: true,
  refreshing: false,
  filterState: {
    selectedMonthIndex: 0,
    selectedMotelIndex: 0,
    selectedYearIndex: 0,
    searchValue: "",
  },
};

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case "STATE_CHANGE":
      return {
        ...prevState,
        [payload.key]: payload.value,
      };
    default:
      return prevState;
  }
};

const RoomElectrictCollectAllScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { signOut } = useContext(AuthContext);
  const { state: roomState, getListElectrict, updateElectrict } = useContext(
    RoomContext
  );
  const { listElectrictRooms } = roomState;
  const { state: modelState } = useContext(MotelContext);
  const { listMotels } = modelState;
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const updateState = (key, value) => {
    dispatch({ type: "STATE_CHANGE", payload: { key, value } });
  };

  const onFilterChange = async (filter) => {
    !!!filter ? updateState("isLoading", true) : setLoading(true);
    const {
      selectedMonthIndex,
      selectedMotelIndex,
      selectedYearIndex,
      searchValue,
    } = filter || {
      selectedMonthIndex: 0,
      selectedMotelIndex: 0,
      selectedYearIndex: 0,
      searchValue: "",
    };
    try {
      //console.log(listMotels);
      await getListElectrict(
        {
          motelid: listMotels[selectedMotelIndex - 1]?.ID ?? 0,
          month: selectedMonthIndex + 1,
          year: settings.yearLists[selectedYearIndex],
          qsearch: `${searchValue}`,
        },
        signOut
      );
      setLoading(false);
      updateState("isLoading", false);
    } catch (error) {
      setLoading(false);
      updateState("isLoading", false);
      console.log(error);
    }
    !!!filter ? updateState("isLoading", false) : setLoading(false);
  };
  const _onRefresh = () => {
    onFilterChange(state.filterState);
  };

  // const onFilterChange = async (filter) => {
  //     updateState("filterState", filter);
  // };

  const onChangeRoomInfo = (state, index) => {
    console.log("onChangeRoomInfo", index, state);
  };

  const _onValueChange = (filterFormvalue) => {
    onFilterChange(filterFormvalue);
  };
  const _onPressSubmit = () => {
    Alert.alert(
      "Cảnh báo",
      `Bạn có chắc chắn muốn ghi điện tất cả phòng trong tháng đã chọn ??`,
      [
        {
          text: "Hủy thao tác",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Tôi chắc chắn",
          onPress: () => updateElectrict(),
        },
      ],
      { cancelable: false }
    );
  };
  const _renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <ElectrictCard
        roomInfo={item}
        handleValueChange={(state) => onChangeRoomInfo(state, index)}
      />
    );
  };
  const _renderListHeader = () => (
    <View style={styles.linkCustom}>
      <NavLink
        title="Lịch sử ghi điện nước"
        icon={{
          name: "file-text-outline",
          color: color.primary,
        }}
        routeName="ElectrictHistory"
        borderBottom={false}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      <FilterHeader
        onValueChange={_onValueChange}
        initialState={state.filterState}
        advanceFilter={false}
        yearFilter={true}
      />
      {!!state.isLoading && (
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            paddingTop: 30,
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      )}
      {!!!state.isLoading && (
        <>
          <KeyboardAwareFlatList
            // extraScrollHeight={120}
            extraHeight={headerHeight + 140}
            // viewIsInsideTabBar={true}
            keyboardShouldPersistTaps="never"
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 30,
            }}
            refreshControl={
              <RefreshControl onRefresh={_onRefresh} refreshing={loading} />
            }
            data={listElectrictRooms}
            ListHeaderComponent={_renderListHeader}
            keyExtractor={(room, index) => `${room.RoomID} - ${index}`}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={ null }
          />
          <Button
            style={{ borderRadius: 0 }}
            onPress={_onPressSubmit}
            accessoryLeft={() => (
              <Icon
                name="credit-card-outline"
                fill={color.whiteColor}
                style={sizes.iconButtonSize}
              />
            )}
            size="large"
            status="danger"
          >
            Ghi điện tất cả phòng
          </Button>
        </>
      )}
    </View>
  );
};

export default RoomElectrictCollectAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgmain,
  },

  contentContainer: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: "#f0f0f0",
  },
  linkCustom: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    paddingLeft: 10,
    borderRadius: 4,
  },
});
