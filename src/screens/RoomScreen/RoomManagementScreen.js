/* eslint-disable react-native/no-color-literals */
import React, {
  useState,
  createRef,
  useContext,
  useEffect,
  useMemo,
  useLayoutEffect,
  createContext,
  memo,
} from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { Icon, Input, List, IndexPath, Text } from "@ui-kitten/components";

import RoomCard from "~/components/RoomCard";
import { settings, color, sizes } from "~/config";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import LinearGradient from "react-native-linear-gradient";

import AddFeeModal from "~/components/AddFeeModal";
import FilterHeader from "./FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import Loading from "~/components/common/Loading";
import ModalizeAddMotel from "~/components/ModalizeAddMotel";

import { create_UUID } from "~/utils";

const RoomManagementScreen = () => {
  const { signOut } = useContext(AuthContext);
  const { state: roomState, getListRooms, updateState } = useContext(
    RoomContext
  );
  const { state: motelState } = useContext(MotelContext);
  const { listRooms, filterStateDefault, isLoading } = roomState;
  const { listMotels, listSortOptions } = motelState;
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  //local screen state
  const [loading, setLoading] = useState(false);
  const [refreshing, setrefreshing] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [modelFeeData, setmodelFeeData] = useState("");

  useLayoutEffect(() => {
    console.log("roomState.isReload", roomState.isReload);
    if (roomState.isReload) {
      loadData(filterValue);
      updateState("isReload", false);
    }
    return () => {};
  }, [roomState.isReload]);
  const _pressAddNewRoom = () => {
    if (Array.isArray(listMotels) && listMotels.length > 0) {
      navigation.navigate("AddNewRoom", {
        onGoBack: () => {
          console.log("loadData(filterValue)");
          loadData(filterValue);
        },
      });
    } else {
      Alert.alert("Thông báo", "Bạn chưa có nhà trọ", [
        {
          text: "Trở lại",
          onPress: () => {},
        },
        {
          text: "Tạo nhà Trọ",
          onPress: () => {
            // navigation.navigate('AddNewMotelMutiple', {});
            // alert('chức năng trong quá trình phát triển')
            bsAddMotel.current?.open();
          },
        },
      ]);
    }
  };
  const loadData = async (filterList, refreshing = false) => {
    console.log("filterList", filterList);
    console.log("is refreshing", refreshing);
    !refreshing && updateState("isLoading", true);
    const {
      selectedMonthIndex,
      selectedMotelIndex,
      selectedYearIndex,
      selectedSortIndex,
    } = filterList || {
      selectedMonthIndex: 0,
      selectedMotelIndex: 0,
      selectedYearIndex: 0,
      searchValue: "",
    };

    try {
      // console.log(listMotels);

      await getListRooms(
        {
          motelid: listMotels[selectedMotelIndex - 1]?.ID || 0,
          month: selectedMonthIndex + 1,
          sortby: listSortOptions[selectedSortIndex]?.id || 0,
          year: settings.yearLists[selectedYearIndex],
        },
        signOut
      );
    } catch (error) {
      console.log(error);
    }
    !refreshing && updateState("isLoading", false);
  };
  const _onValueChange = (filterFormvalue) => {
    console.log("_onValueChange", filterFormvalue);
    setFilterValue(filterFormvalue);
    loadData(filterFormvalue);
  };

  const _onRefresh = async () => {
    setrefreshing(true);
    try {
      await loadData(filterValue, true);
    } catch (error) {}
    setrefreshing(false);
  };

  const bsFee = createRef();
  const bsAddMotel = createRef();
  const _onPressaddFee = (roomdata) => {
    const { HouseID, RoomName, RoomID, RenterID } = roomdata;

    bsFee.current?.open();
    setTimeout(() => {
      setmodelFeeData({ RoomName, RoomID });
    }, 10);
  };

  const _onModalizeFeeOpen = () => {};
  const _onModalizeAddMotelClose = () => {
    console.log("_onModalizeAddMotelClose");
    loadData();
  };
  return (
    <>
      <View style={styles.container}>
        <FilterHeader
          onValueChange={_onValueChange}
          initialState={filterStateDefault}
          advanceFilter={true}
          loading={isLoading}
        />
        {!!isLoading && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              paddingTop: 30,
              justifyContent: "center",
            }}
          >
            <Loading />
          </View>
        )}
        {!!!isLoading && (
          <View style={styles.contentContainer}>
            <List
              refreshControl={
                <RefreshControl
                  onRefresh={_onRefresh}
                  refreshing={refreshing}
                />
              }
              keyExtractor={(room, index) => `${room.RoomID}-${index}`}
              style={styles.listContainer}
              contentContainerStyle={styles.contentCard}
              data={listRooms}
              renderItem={(room) => (
                <RoomCard
                  roomInfo={room}
                  onPressaddFee={() => _onPressaddFee(room.item)}
                />
              )}
            />
            <TouchableOpacity
              onPress={_pressAddNewRoom}
              style={styles.addAction}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                useAngle={true}
                angle={45}
                angleCenter={{ x: 0.5, y: 0.25 }}
                colors={color.gradients.success}
                style={{
                  borderRadius: 50,
                }}
              >
                <View style={styles.btnAdd}>
                  <Icon
                    name="plus"
                    fill={color.whiteColor}
                    style={styles.btnAddIcon}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <Portal>
              <Modalize
                ref={bsFee}
                closeOnOverlayTap={false}
                adjustToContentHeight={true}
                onOpen={_onModalizeFeeOpen}
              >
                <View style={styles.bottomSheetContent}>
                  <AddFeeModal data={modelFeeData} />
                </View>
              </Modalize>
              <ModalizeAddMotel
                modalTopOffset={0}
                onClose={_onModalizeAddMotelClose}
                ref={bsAddMotel}
              />
            </Portal>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
    backgroundColor: color.bgmain,
  },

  contentCard: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  listContainer: {
    flex: 1,
  },

  bottomSheetContent: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    paddingBottom: 60,
  },
  addAction: {
    shadowColor: "#000",
    position: "absolute",
    right: 15,
    bottom: 15,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.27,
    elevation: 7,
    borderRadius: 60 / 2,
  },
  btnAdd: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  btnAddIcon: {
    width: 30,
    height: 30,
  },
});

export default memo(RoomManagementScreen);
