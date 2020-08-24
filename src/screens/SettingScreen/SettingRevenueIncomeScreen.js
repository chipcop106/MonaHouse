import React, { useReducer, useEffect, useContext, memo } from "react";
import {
  StyleSheet,
  View,
  processColor,
  Dimensions,
} from "react-native";
import { Text, Icon } from "@ui-kitten/components";
import { color, sizes, shadowStyle, yearOptions, settings } from "~/config";
import ModalizeSelect from "~/components/common/ModalizeSelect";
import { Context as MotelContext } from "~context/MotelContext";
import { BarChart } from "react-native-charts-wrapper";
import { FlatList } from "react-native-gesture-handler";
import { getRevenueByMotelID } from "~api/ReportAPI";
import Loading from "~components/common/Loading";
import { currencyFormat } from "~/utils";

console.log(yearOptions);

const { height } = Dimensions.get("window");

const greenBlue = "rgba(72, 70, 109, 0.3)";

const calculatorDiffPercentage = (cur, prev) =>
  cur === 0 && prev === 0
    ? 0
    : prev === 0
    ? 100
    : (((cur - prev) * 100) / prev).toFixed(2);

const xAxisConfig = {
  valueFormatter: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Oct",
    "Sep",
    "Nov",
    "Dec",
  ],
  position: "BOTTOM",
  textSize: 10,
  granularityEnabled: true,
  granularity: 1,
  labelCount: 12,
  axisMaximum: 12,
  axisMinimum: -1,
  drawGridLines: false,
  drawAxisLine: true,
  avoidFirstLastClipping: true,
};

const yAxisConfig = {
  left: {
    drawGridLines: false,
    enabled: true,
    axisMinimum: 0,
    valueFormatter: "largeValue",
  },
  right: {
    enabled: false,
  },
};

const pad = (n) => (n >= 10 ? n : "0" + n);

const initialState = {
  motelLists: [],
  isLoading: true,
  chartData: [
    {
      month: 1,
      year: 2020,
      revenue: 200000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 2,
      year: 2020,
      revenue: 250000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 3,
      year: 2020,
      revenue: 660000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 4,
      year: 2020,
      revenue: 130000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 5,
      year: 2020,
      revenue: 0,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 6,
      year: 2020,
      revenue: 0,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 7,
      year: 2020,
      revenue: 250000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 8,
      year: 2020,
      revenue: 470000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 9,
      year: 2020,
      revenue: 870000000,
      newContract: 9,
      expiredContract: 7,
    },
    {
      month: 10,
      year: 2020,
      revenue: 1130000000,
      rented: 9,
      expiredContract: 7,
    },
    {
      month: 11,
      year: 2020,
      revenue: 100000000,
      rented: 9,
      expiredContract: 7,
    },
    {
      month: 12,
      year: 2020,
      revenue: 220000000,
      rented: 5,
      expiredContract: 11,
    },
  ],
  activeMotel: 0,
  activeYear: 5,
  selectedMonth: new Date().getMonth(),
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

    case "SELECTED_MONTH": {
      return {
        ...prevState,
        selectedMonth: payload,
      };
    }

    case "SET_YEAR": {
      return {
        ...prevState,
        activeYear: payload,
      };
    }

    case "SET_LOADING": {
      return {
        ...prevState,
        isLoading: payload,
      };
    }
    case "SET_CHARTDATA": {
      return {
        ...prevState,
        chartData: payload,
      };
    }
    default:
      return prevState;
  }
};

const RenderListRevenue = memo(({ isLoading, data }) => {
  return (
    <>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          keyExtractor={(item, index) => `${item?.RoomID}-${index}`}
          data={data}
          extraData={data}
          renderItem={({ item, index, seperators }) => (
            <View style={styles.roomWrap}>
              <View
                style={{ paddingRight: 30, flexGrow: 1, flexDirection: "row" }}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.roomName}
                >
                  {`${pad(item?.month)} / ${item?.year}` ?? "/"}
                </Text>
              </View>

              <Text
                style={{
                  ...styles.roomStatus,
                  fontWeight: "500",
                }}
              >
                {currencyFormat(item?.revenue ?? 0)}
              </Text>
            </View>
          )}
        />
      )}
    </>
  );
});

const SettingRevenueIncomeScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: motelState } = useContext(MotelContext);
  const _onMotelChange = (index, selected) => {
    dispatch({ type: "SET_MOTEL", payload: index });
  };
  const _onYearChange = (index, selected) => {
    dispatch({ type: "SET_YEAR", payload: index });
  };

  const setLoading = (value) => {
    dispatch({ type: "SET_LOADING", payload: value });
  };

  const _handleSelectChart = (event) => {
    const entry = event.nativeEvent;
    if (entry === null || entry.data === undefined) {
      dispatch({ type: "SELECTED_MONTH", payload: new Date().getMonth() });
    } else {
      dispatch({ type: "SELECTED_MONTH", payload: entry.x });
    }
  };

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const res = await getRevenueByMotelID({
        MotelID:
          state?.activeMotel === 0
            ? 0
            : parseInt(motelState.listMotels[state?.activeMotel - 1].ID),
        RoomID: 0,
        Month: 0,
        Year: parseInt(yearOptions[state?.activeYear]) ?? 0,
      });
      //res.Code === 1 && dispatch({ type: "SET_CHARTDATA", payload: res.Data });
      //Fake data
    } catch (e) {
      console.log(e?.message ?? "Lỗi gọi API, check lại params");
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
  }, [motelState.listMotels]);

  useEffect(() => {
    fetchRevenueData();
  }, [state.activeMotel, state.activeYear]);

  return (
    <>
      <View style={styles.filterWrap}>
        <View style={[styles.col, { flexGrow: 1, marginRight: 10 }]}>
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
        <View style={styles.col}>
          <ModalizeSelect
            onChange={_onYearChange}
            pickerData={yearOptions ?? []}
            selectedValue={yearOptions[state?.activeYear ?? 5]}
            leftIcon="calendar"
            disabled={state?.isLoading}
          />
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 10,
            marginVertical: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: color.darkColor,
              fontSize: 18,
            }}
          >
            Tổng doanh thu:
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              color: color.redColor,
              fontWeight: "bold",
            }}
          >
            {state?.chartData?.length
              ? currencyFormat(
                  state.chartData.reduce(
                    (prev, cur) => prev + cur?.revenue ?? 0,
                    0
                  )
                )
              : 0}{" "}
            VNĐ
          </Text>
        </View>
        <View style={styles.chartWrap}>
          {state.isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loading />
            </View>
          ) : (
            <BarChart
              style={styles.chart}
              data={{
                dataSets: [
                  {
                    values: state.chartData.map((data, index) => ({
                      y: data?.revenue ?? 0,
                      x: index,
                      marker: `${settings.monthLists[index]}: ${currencyFormat(
                        data?.revenue ?? 0
                      )}`,
                    })),
                    label: "Tỉ lệ lấp đầy",
                    config: {
                      barWidth: 0.5,
                      drawValues: false,
                      lineWidth: 2,
                      drawCircles: true,
                      circleColor: processColor(greenBlue),
                      drawCircleHole: false,
                      highlightAlpha: 90,
                      barShadowColor: processColor("lightgrey"),
                      circleRadius: 4,
                      highlightColor: processColor("transparent"),
                      color: processColor(greenBlue),
                      valueTextSize: 16,
                      valueFormatter: "#.##",
                    },
                  },
                ],
              }}
              animation={{
                durationX: 0,
                durationY: 1500,
                easingY: "EaseInOutQuart",
              }}
              xAxis={xAxisConfig}
              legend={{
                enabled: false,
              }}
              marker={{
                enabled: true,
                markerColor: processColor(color.darkColor),
                textColor: processColor("white"),
              }}
              highlights={[
                {
                  y: state?.chartData[state.selectedMonth]?.revenue ?? 0,
                  x: state.selectedMonth,
                },
              ]}
              yAxis={yAxisConfig}
              drawGridBackground={false}
              drawBorders={false}
              touchEnabled={true}
              dragEnabled={false}
              scaleEnabled={false}
              scaleXEnabled={false}
              scaleYEnabled={false}
              pinchZoom={false}
              doubleTapToZoomEnabled={false}
              dragDecelerationEnabled={true}
              dragDecelerationFrictionCoef={0.99}
              keepPositionOnRotation={false}
              autoScaleMinMaxEnabled={true}
              viewPortOffsets={{
                top: 0,
                bottom: 20,
                left: 40,
                right: 20,
              }}
              onSelect={_handleSelectChart}
            />
          )}
        </View>
        <View style={{ ...styles.container }}>
          <View style={styles.wrapCard}>
            <View style={styles.summaryBox}>
              <View style={styles.box}>
                <Text style={styles.label}>HĐ mới</Text>
                <Text style={styles.value}>
                  {state?.chartData[state?.selectedMonth ?? 0]?.newContract ??
                    0}
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.label}>HĐ hết hạn</Text>
                <Text style={styles.value}>
                  {state?.chartData[state?.selectedMonth ?? 0]
                    ?.expiredContract ?? 0}
                </Text>
              </View>
              <View style={{ ...styles.box, borderRightWidth: 0 }}>
                <Text style={styles.label}>Tháng trước</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {state.selectedMonth !== 0 &&
                  calculatorDiffPercentage(
                    parseInt(
                      state?.chartData[state?.selectedMonth ?? 0]?.revenue ?? 0
                    ),
                    parseInt(
                      state?.chartData[state?.selectedMonth - 1 ?? 0]
                        ?.revenue ?? 0
                    )
                  ) >= 0 ? (
                    <Icon
                      name="trending-up-outline"
                      fill={color.greenColor}
                      style={{ ...sizes.iconButtonSize, marginRight: 5 }}
                    />
                  ) : (
                    <Icon
                      name="trending-down-outline"
                      fill={color.redColor}
                      style={{ ...sizes.iconButtonSize, marginRight: 5 }}
                    />
                  )}

                  <Text style={{ ...styles.value }}>
                    {state.selectedMonth !== 0
                      ? calculatorDiffPercentage(
                          parseInt(
                            state?.chartData[state?.selectedMonth ?? 0]
                              ?.revenue ?? 0
                          ),
                          parseInt(
                            state?.chartData[state?.selectedMonth - 1 ?? 0]
                              ?.revenue ?? 0
                          )
                        )
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Doanh thu theo tháng</Text>
          </View>
          <View style={{ ...styles.wrapCard, flexGrow: 1, marginBottom: 0 }}>
            <RenderListRevenue
              isLoading={state.isLoading}
              data={state?.chartData ?? []}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.whiteColor,
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
    flexDirection: "row",
  },
  chart: {
    flex: 1,
    position: "relative",
  },
  chartWrap: {
    width: "100%",
    height: height / 5,
    // aspectRatio: 1,
    paddingHorizontal: 5,
    position: "relative",
    marginTop: 10,
  },
  summaryBox: {
    flexDirection: "row",
  },
  box: {
    borderRightWidth: 1,
    borderRightColor: "#e1e1e1",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
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
    marginBottom: 10,
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
  roomName: {
    fontSize: 16,
    letterSpacing: 1,
  },
  roomStatus: {
    fontSize: 16,
    color: color.redColor,
  },
});

export default SettingRevenueIncomeScreen;
