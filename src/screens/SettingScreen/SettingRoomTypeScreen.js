import React, { useReducer, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  processColor,
  Dimensions,
  ScrollView, Alert,
} from 'react-native'
import { Text } from "@ui-kitten/components";
import { color, shadowStyle } from "~/config";
import ModalizeSelect from "~/components/common/ModalizeSelect";
import { Context as MotelContext } from "~context/MotelContext";
import { Context as AuthContext } from "~context/AuthContext";
import { PieChart } from "react-native-charts-wrapper";
import Loading from "~components/common/Loading";
import { getTypeRoomByMotelID } from "~/api/ReportAPI";

const { width, height } = Dimensions.get("window");
const initialState = {
  motelLists: [],
  isLoading: true,
  chartData: [
    { value: 45, label: "Phòng trọ", rented: 32 },
    { value: 21, label: "Gường KTX", rented: 15 },
    { value: 12, label: "Shop", rented: 5 },
    { value: 16, label: "Kiot", rented: 10 },
  ],
  activeTab: 1,
  activeMotel: 0,
  thisMonthRoom: [],
  lastMonthRoom: [],
  nextThreeMonthRoom: [],
};

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case "UPDATE_MOTEL": {
      return {
        ...prevState,
        motelLists: payload,
        isLoading: true,
      };
    }
    case "SET_MOTEL": {
      return {
        ...prevState,
        activeMotel: payload,
      };
    }
    case "SET_CHART_DATA": {
      return {
        ...prevState,
        chartData: payload,
      };
    }
    case "SET_LOADING": {
      return {
        ...prevState,
        isLoading: payload,
      };
    }
    case "SET_HOUSE": {
      return {
        ...prevState,
        selectedHouse: payload,
      };
    }
    default:
      return prevState;
  }
};

const InfoCard = ({ name, number, rented, loading }) => {
  return (
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      {loading ? (
        <Loading />
      ) : (
        <View style={styles.numWrap}>
          <Text style={styles.rented}>{rented}</Text>
          <Text style={styles.smallNumber}>/</Text>
          <Text style={styles.number}>{number}</Text>
        </View>
      )}
    </View>
  );
};

const SettingRoomTypeScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: motelState } = useContext(MotelContext);
  const { signOut } = useContext(AuthContext);
  const _onMotelChange = (index, selected) => {
    dispatch({ type: "SET_MOTEL", payload: index });
  };

  const setChartData = (value) => {
    dispatch({ type: "SET_CHART_DATA", payload: value });
  };

  const setLoading = (value) => {
    dispatch({ type: "SET_LOADING", payload: value });
  };

  const fetchRoomByMotelID = async () => {
    setLoading(true);
    try {
      const res = await getTypeRoomByMotelID({
        MotelID:
          state.activeMotel === 0
            ? 0
            : motelState.listMotels[state.activeMotel - 1].ID,
      });
      console.log(res);
      if(res.Code === 1) {
        const chartData = res.Data.map(item => {
          return  { value: item.total, label: item.name, rented: item.rented }
        })
        console.log(chartData);
        setChartData(chartData);
      } if(res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(res));
      } if(res.Code === 2) {

      } else {

      }
      // res.Code === 1 && setChartData(res.Data);
      // res.Code === 0 && signOut();
    } catch (e) {
      console.log( 'fetchRoomByMotelID error:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    !!motelState.listMotels &&
      motelState.listMotels.length > 0 &&
      dispatch({
        type: "UPDATE_MOTEL",
        payload: motelState.listMotels.map((item) => item.MotelName),
      });
    setLoading(false);
  }, [motelState.listMotels]);

  useEffect(() => {
    fetchRoomByMotelID();
  }, [state.activeMotel]);

  return (
    <>
      <View style={styles.filterWrap}>
        <ModalizeSelect
          onChange={_onMotelChange}
          pickerData={["Tất cả nhà trọ", ...state?.motelLists] ?? []}
          selectedValue={
            ["Tất cả nhà trọ", ...state?.motelLists][state.activeMotel]
          }
          leftIcon="home"
          disabled={state?.isLoading}
        />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.chartWrap}>
            <PieChart
              style={styles.chart}
              logEnabled={true}
              chartBackgroundColor={processColor(color.darkColor)}
              data={{
                dataSets: [
                  {
                    values: state?.chartData,
                    label: "",
                    config: {
                      colors: [
                        processColor("#c0ff8c"),
                        processColor("#FFF78C"),
                        processColor("#FFD08C"),
                        processColor("#8CEAFF"),
                        processColor("#FF8C9D"),
                      ],
                      valueTextSize: 14,
                      valueTextColor: processColor("green"),
                      sliceSpace: 5,
                      selectionShift: 15,
                      // xValuePosition: "OUTSIDE_SLICE",
                      // yValuePosition: "OUTSIDE_SLICE",
                      valueFormatter: "#'%'",
                      valueLineColor: processColor("green"),
                      valueLinePart1Length: 0.5,
                    },
                  },
                ],
              }}
              animation={{
                durationX: 0,
                durationY: 1500,
                easingY: "EaseInOutQuart",
              }}
              legend={{
                enabled: true,
                textSize: 16,
                textColor: processColor(color.whiteColor),
                form: "CIRCLE",
                horizontalAlignment: "RIGHT",
                verticalAlignment: "CENTER",
                orientation: "VERTICAL",
                wordWrapEnabled: true,
                formToTextSpace: 10,
                yEntrySpace: 10,
                xEntrySpace: 10,
              }}
              highlights={[{ x: 0 }]}
              entryLabelColor={processColor("green")}
              entryLabelTextSize={12}
              drawEntryLabels={true}
              rotationEnabled={false}
              rotationAngle={45}
              usePercentValues={true}
              styledCenterText={{
                text: "Loại",
                color: processColor(color.darkColor),
                size: 20,
              }}
              centerTextRadiusPercent={100}
              holeRadius={40}
              holeColor={processColor("#f0f0f0")}
              transparentCircleRadius={45}
              transparentCircleColor={processColor("#f0f0f088")}
              maxAngle={360}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.title}>Trạng thái đang thuê</Text>
            <View style={styles.inforWrap}>
              <InfoCard
                name="Phòng trọ"
                number={state?.chartData[0]?.value ?? 0}
                rented={state?.chartData[0]?.rented ?? 0}
                loading={state.isLoading}
              />
              <InfoCard
                name="Giường KTX"
                number={state?.chartData[1]?.value ?? 0}
                rented={state?.chartData[1]?.rented ?? 0}
                loading={state.isLoading}
              />
              <InfoCard
                name="Shop"
                number={state?.chartData[2]?.value ?? 0}
                rented={state?.chartData[2]?.rented ?? 0}
                loading={state.isLoading}
              />
              <InfoCard
                name="Kiot"
                number={state?.chartData[3]?.value ?? 0}
                rented={state?.chartData[3]?.rented ?? 0}
                loading={state.isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,
  },
  wrapCard: {
    marginBottom: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    ...shadowStyle,
  },
  filterWrap: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: color.darkColor,
  },
  chart: {
    flex: 1,
    position: "relative",
  },
  chartWrap: {
    width: width,
    height: height / 3,
    // aspectRatio: 1,
    paddingHorizontal: 15,
    position: "relative",
    backgroundColor: color.darkColor,
    marginBottom: 30,
    paddingBottom: 15,
  },
  summaryBox: {
    flexDirection: "row",
  },
  box: {
    borderRightWidth: 1,
    borderRightColor: "#e1e1e1",
    flex: 1,
    alignItems: "center",
  },
  label: {
    marginBottom: 5,
    color: color.labelColor,
  },
  value: {
    color: color.darkColor,
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#3C3C43",
    textTransform: "uppercase",
    opacity: 0.6,
  },
  tabLinkWrap: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tabLink: {
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    borderBottomColor: color.primary,
    borderBottomWidth: 2,
  },
  link: {
    fontWeight: "600",
  },
  tabContainer: {
    flex: 1,
  },
  tabContentWrap: {
    flexGrow: 1,
  },
  roomWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
  },
  inforWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  info: {
    width: width / 2 - 25,
    ...shadowStyle,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: color.whiteColor,
    marginBottom: 15,
    borderRadius: 4,
  },
  name: {
    fontSize: 18,
    color: color.labelColor,
    marginBottom: 5,
  },
  number: {
    fontSize: 20,
    color: color.darkColor,
    fontWeight: "400",
  },
  rented: {
    fontSize: 36,
    color: color.darkColor,
    fontWeight: "700",
  },
  smallNumber: {
    fontSize: 32,
    color: color.darkColor,
    marginHorizontal: 5,
  },
  numWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SettingRoomTypeScreen;
