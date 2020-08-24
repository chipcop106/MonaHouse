import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Text, Layout, Button, Icon } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import GoOutInfo from "../../components/GoOutForm/GoOutInfo";
import GoOutCheckout from "../../components/GoOutForm/GoOutCheckout";
import { Context as RoomGoOutContext } from "../../context/RoomGoOutContext";
import { Context as RoomContext } from "../../context/RoomContext";
import { sizes, color } from "~/config";
import UserInfo from "~/components/UserInfo";
import { getRoomById } from "~/api/MotelAPI";
import Loading from "~/components/common/Loading";
import Spinner from "react-native-loading-spinner-overlay";

const titleHeader = ["Thông tin phòng, ki ốt", "Thông tin thanh toán"];
const RenderForm = () => {
  const { state: RoomGoOutState, changeStateFormStep } = useContext(
    RoomGoOutContext
  );
  const { step, dataForm } = RoomGoOutState;

  return (
    <>
      {step === 0 && (
        <GoOutInfo
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
      {step === 1 && (
        <GoOutCheckout
          onChangeState={changeStateFormStep}
          initialState={dataForm[step]}
        />
      )}
    </>
  );
};

const RoomGoOutScreen = ({ navigation }) => {
  const {
    state: RoomGoOutState,
    changeStepForm,
    clearState,
    loadDataForm,
    moveOut,
  } = useContext(RoomGoOutContext);
  const { updateState: updateState_Room } = useContext(RoomContext);
  const route = useRoute();
  const [userInfo, setUserInfo] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const loadData = async () => {
    try {
      const res = await getRoomById({ roomid: route.params.roomId });
      setUserInfo({
        ...res.Data.renter.renter,
      });
      await loadDataForm(res.Data);
    } catch (err) {
      console.log("RoomGoOutScreen loadData err", err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            RoomGoOutState.step === 0 ? navigation.pop() : changeStepForm(-1)
          }
        >
          <Icon
            name="arrow-back-outline"
            fill={color.primary}
            style={sizes.iconButtonSize}
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ),
      headerTitle: titleHeader[RoomGoOutState.step],
    });
  }, [navigation, RoomGoOutState]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const sendFormData = async () => {
    setSpinner(true);
    await moveOut(RoomGoOutState);
    setSpinner(false);
    clearState();
    navigation.pop();
    updateState_Room("isReload", true);
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.log("_onRefresh error", error);
    }
    setRefreshing(false);
  };
  return (
    <Layout style={styles.container} level="3">
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={_onRefresh} refreshing={refreshing} />
        }
      >
        {!!!loading && !!userInfo && (
          <UserInfo
            avatar={userInfo.Avatar}
            name={userInfo.FullName}
            phone={userInfo.Phone}
          />
        )}
        {loading ? (
          <View style={{ padding: 15, alignItems: "center" }}>
            <Loading />
          </View>
        ) : (
          <>
            <RenderForm />
            <View style={styles.mainWrap}>
              {RoomGoOutState.step < 1 ? (
                <Button
                  onPress={() =>
                    changeStepForm(1, {
                      ...RoomGoOutState.dataForm,
                      roomId: route.params.roomId,
                    })
                  }
                  accessoryRight={
                    RoomGoOutState.isLoading
                      ? null
                      : () => (
                          <Icon
                            name="arrow-right"
                            fill={color.whiteColor}
                            style={sizes.iconButtonSize}
                          />
                        )
                  }
                  size="large"
                  status="danger"
                >
                  {RoomGoOutState.isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    `Xem phí dọn ra`
                  )}
                </Button>
              ) : (
                <Button
                  onPress={sendFormData}
                  accessoryLeft={() => (
                    <Icon
                      name="save"
                      fill={color.whiteColor}
                      style={sizes.iconButtonSize}
                    />
                  )}
                  size="large"
                  status="success"
                >
                  Tiến hành dọn ra
                </Button>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <Spinner
        visible={spinner}
        textContent={"Vui lòng chờ giây lát..."}
        textStyle={{ color: "#fff" }}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: color.primary,
    marginLeft: 5,
    fontSize: 16,
  },
  section: {
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
});

export default RoomGoOutScreen;
