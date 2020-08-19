import React, { useReducer, useEffect, useState, useContext, memo } from "react";
import {
    StyleSheet,
    View,
    processColor,
    ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import { Text, Input, Button, Icon } from "@ui-kitten/components";
import { color, sizes, shadowStyle, yearOptions } from "~/config";
import gbStyle from "~/GlobalStyleSheet";
import ModalizeSelect from '~/components/common/ModalizeSelect';
import { Context as MotelContext } from '~context/MotelContext';
import { LineChart } from 'react-native-charts-wrapper';
import { randomDataChart } from '~/utils';
import { FlatList } from "react-native-gesture-handler";
import { getRoomsByMotelId } from '~api/MotelAPI';
import Loading from '~components/common/Loading'
import dayjs from 'dayjs';
import Svg, { Path } from 'react-native-svg';

let nowDayjs = dayjs();
const { width, height } = Dimensions.get('window');
const initialState = {
    motelLists: [],
    isLoading: true,
    chartData: [
        {
            y: 47,
            x: 0,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 47%"
        },
        {
            y: 34,
            x: 1,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 34%"
        },
        {
            y: 47,
            x: 2,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 47%"
        },
        {
            y: 74,
            x: 3,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 74%"
        },
        {
            y: 24,
            x: 4,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 24%"
        },
        {
            y: 65,
            x: 5,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 65%"
        },
        {
            y: 45,
            x: 6,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 45%"
        },
        {
            y: 55,
            x: 7,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 55%"
        },
        {
            y: 100,
            x: 8,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 100%"
        },
        {
            y: 56,
            x: 9,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 56%"
        },
        {
            y: 35,
            x: 10,
            total: 16,
            rented: 9,
            empty: 7,
            marker: "Tỉ lệ 76%"
        },
        {
            y: 33,
            x: 11,
            total: 16,
            rented: 5,
            empty: 11,
            marker: "Tỉ lệ 33%"
        }
    ],
    activeTab: 1,
    activeMotel: 0,
    selectedMonth: nowDayjs.get('month'),
    thisMonthRoom: [],
    lastMonthRoom: [],
    nextThreeMonthRoom: []
};

const greenBlue = "rgba(72, 70, 109, 0.5)";
const petrel = "rgba(72, 70, 109, .05)";


const xAxisConfig = {
    valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Sep', 'Nov', 'Dec'],
    position: 'BOTTOM',
    textSize: 10,
    granularityEnabled: true,
    granularity: 1,
    labelCount: 12,
    axisMaximum: 11,
    axisMinimum: 0,
    drawGridLines: false,
    drawAxisLine: false,
    avoidFirstLastClipping: true
}

const yAxisConfig = {
    left: {
        drawGridLines: false,
        enabled: false,
        axisMinimum: 0,
        axisMaximum: 100
    },
    right: {
        enabled: false
    }
}

const reducer = (prevState, { type, payload }) => {
    switch (type) {
        case "UPDATE_MOTEL": {
            return {
                ...prevState,
                motelLists: payload,
                isLoading: true
            }
        }
        case "SET_MOTEL": {
            return {
                ...prevState,
                activeMotel: payload
            }
        }
        case "SET_ROOM": {
            return {
                ...prevState,
                [payload.key]: payload.value
            }
        }
        case "SELECTED_MONTH": {
            return {
                ...prevState,
                selectedMonth: payload
            }
        }
        case "SET_LOADING": {
            return {
                ...prevState,
                isLoading: payload
            }
        }
        case "SET_ACTIVE_TAB": {
            return {
                ...prevState,
                activeTab: payload
            }
        }
        case "SET_HOUSE": {
            return {
                ...prevState,
                selectedHouse: payload
            }
        }
        default:
            return prevState;
    }
};


const RenderListRoom = memo(({ isLoading, data }) => {
    return (
        <>
            {
                isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Loading /></View> : <FlatList
                    style={{ flex: 1 }}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => `${item?.RoomID}-${index}`}
                    data={data}
                    extraData={data}
                    renderItem={({ item, index, seperators }) => (
                        <View style={styles.roomWrap}>
                            <View style={{ paddingRight: 30, flexGrow: 1, flexDirection: 'row' }}>
                                <Icon
                                    style={sizes.iconButtonSize}
                                    fill={color.darkColor}
                                    name='layout-outline'

                                />
                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    style={styles.roomName}>{item?.RoomName ?? ''}</Text>
                            </View>

                            <Text style={{ ...styles.roomStatus, color: item?.StatusRoomID === 1 ? 'red' : 'green' }}>{item?.StatusRoomID === 1 ? 'Trống' : 'Đang thuê'}</Text>
                        </View>
                    )}
                />
            }

        </>
    )
});

const SettingFilledIndicatorScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { state: motelState } = useContext(MotelContext);
    const _onMotelChange = (index, selected) => {
        dispatch({ type: 'SET_MOTEL', payload: index });
    }
    const setRoomData = (key, value) => {
        dispatch({ type: "SET_ROOM", payload: { key, value } });
    }

    const setLoading = (value) => {
        dispatch({ type: "SET_LOADING", payload: value })
    }

    const setActiveTab = (value) => {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: value });
    }

    const getPrevOrNextRoomByMonth = async (number) => {
        const newDateJS = number < 0 ? nowDayjs.subtract(Math.abs(number), 'month') : nowDayjs.add(number, 'month');
        setLoading(true);
        try {
            const params = {
                motelid: motelState.listMotels[state.activeMotel].ID,
                month: newDateJS.get('month') + 1,
                qsearch: '',
                sortby: 1,
                status: 0,
                year: newDateJS.get('year')
            };
            const res = await getRoomsByMotelId(params);
            setLoading(false);
            return res.Data;
        } catch (error) {
            console.log(error?.message ?? 'Lỗi call api, xem lại api hoặc params !');
        }
        setLoading(false);
        return [];
    }

    const _handleSelectChart = (event) => {
        const entry = event.nativeEvent;
        console.log(entry);
        if (entry === null || entry.data === undefined) {
            dispatch({ type: "SELECTED_MONTH", payload: nowDayjs.get('month') })
        } else {
            dispatch({ type: "SELECTED_MONTH", payload: entry.x })
        }
    }


    const fetchRoomByMotelID = async () => {
        const [last, now, nextThreeMonth] = await Promise.all([
            getPrevOrNextRoomByMonth(-1),
            getPrevOrNextRoomByMonth(0),
            getPrevOrNextRoomByMonth(3)
        ]);
        setRoomData('thisMonthRoom', now);
        setRoomData('lastMonthRoom', last);
        setRoomData('nextThreeMonthRoom', nextThreeMonth);
    }

    useEffect(() => {
        setLoading(true);
        !!motelState.listMotels
            && motelState.listMotels.length > 0
            && dispatch({ type: "UPDATE_MOTEL", payload: motelState.listMotels.map(item => item.MotelName) });
    }, [motelState.listMotels]);

    useEffect(() => {
        fetchRoomByMotelID();
    }, [state.activeMotel])

    return (
        <>

            <View style={styles.filterWrap}>
                <ModalizeSelect
                    onChange={_onMotelChange}
                    pickerData={state?.motelLists ?? []}
                    selectedValue={state?.motelLists[state?.activeMotel ?? 0] ?? 'Chọn nhà trọ'}
                    leftIcon="home"
                    disabled={state?.isLoading}
                />
            </View>
            <View style={styles.container}>
                <View style={styles.chartWrap}>
                   
                    <LineChart
                        style={styles.chart}
                        data={{
                            dataSets: [
                                {
                                    values: state.chartData,
                                    label: "Tỉ lệ lấp đầy",
                                    config: {
                                        mode: "CUBIC_BEZIER",
                                        drawValues: false,
                                        lineWidth: 2,
                                        drawCircles: true,
                                        circleColor: processColor(greenBlue),
                                        drawCircleHole: false,
                                        circleRadius: 4,
                                        highlightColor: processColor("transparent"),
                                        color: processColor(petrel),
                                        drawFilled: true,
                                        fillGradient: {
                                            colors: [processColor(petrel), processColor(greenBlue)],
                                            positions: [0, 0.5],
                                            angle: 90,
                                            orientation: "TOP_BOTTOM"
                                        },
                                        fillAlpha: 1000,
                                        valueTextSize: 10
                                    }
                                }
                            ]
                        }}
                        animation={{
                            durationX: 0,
                            durationY: 1500,
                            easingY: "EaseInOutQuart"
                        }}
                        xAxis={xAxisConfig}
                        legend={{
                            enabled: false
                        }}
                        marker={{
                            enabled: true,
                            markerColor: processColor(color.darkColor),
                            textColor: processColor('white')
                        }}
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
                            top: 20,
                            bottom: 20,
                            left: 10,
                            right: 10
                        }}
                        highlights={[state.chartData[state.selectedMonth]]}
                        onSelect={_handleSelectChart}
                    />
                </View>
                <View style={{ ...styles.container }}>
                    <View style={styles.wrapCard}>
                        <View style={styles.summaryBox}>
                            <View style={styles.box}>
                                <Text style={styles.label}>Số phòng</Text>
                                <Text style={styles.value}>{state?.chartData[state?.selectedMonth]?.total ?? 0}</Text>
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.label}>Đang thuê</Text>
                                <Text style={styles.value}>{state?.chartData[state?.selectedMonth]?.rented ?? 0}</Text>
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.label}>Còn trống</Text>
                                <Text style={styles.value}>{state?.chartData[state?.selectedMonth]?.empty ?? 0}</Text>
                            </View>
                            <View style={{ ...styles.box, borderRightWidth: 0 }}>
                                <Text style={styles.label}>Tỉ lệ</Text>
                                <Text style={styles.value}>{state?.chartData[state?.selectedMonth]?.y ?? 0}%</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.title}>Tình trạng phòng</Text>
                    <View style={{ ...styles.wrapCard, flexGrow: 1, marginBottom: 0 }}>
                        <View style={styles.tabContainer}>
                            <View style={styles.tabLinkWrap}>
                                <TouchableOpacity
                                    onPress={() => setActiveTab(0)}
                                    style={[styles.tabLink, state.activeTab === 0 && styles.tabActive]}>
                                    <Text style={styles.link}>Tháng trước</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveTab(1)}
                                    style={[styles.tabLink, state.activeTab === 1 && styles.tabActive]}>
                                    <Text style={styles.link}>Tháng này</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveTab(2)}
                                    style={[styles.tabLink, state.activeTab === 2 && styles.tabActive]}>
                                    <Text style={styles.link}>3 tháng sau</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tabContentWrap}>
                                {
                                    state.activeTab === 0 && <RenderListRoom isLoading={state.isLoading} data={state?.lastMonthRoom ?? []} />
                                }
                                {
                                    state.activeTab === 1 && <RenderListRoom isLoading={state.isLoading} data={state?.thisMonthRoom ?? []} />
                                }
                                {
                                    state.activeTab === 2 && <RenderListRoom isLoading={state.isLoading} data={state?.nextThreeMonthRoom ?? []} />
                                }
                            </View>
                        </View>
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
        backgroundColor: '#fff',
        ...shadowStyle
    },
    filterWrap: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: color.darkColor,
    },
    chart: {
        flex: 1,
        position: 'relative'
    },
    chartWrap: {
        width: '100%',
        height: height / 5,
        // aspectRatio: 1,
        paddingHorizontal: 5,
        position: 'relative',
        marginTop: 10,
    },
    summaryBox: {
        flexDirection: 'row'
    },
    box: {
        borderRightWidth: 1,
        borderRightColor: '#e1e1e1',
        flex: 1,
        alignItems: 'center'
    },
    label: {
        marginBottom: 5,
        color: color.labelColor
    },
    value: {
        color: color.darkColor,
        fontSize: 20,
        fontWeight: '600'
    },
    title: {
        fontSize: 16,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
        color: '#3C3C43',
        textTransform: "uppercase",
        opacity: 0.6
    },
    tabLinkWrap: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    tabLink: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {
        borderBottomColor: color.primary,
        borderBottomWidth: 2
    },
    link: {
        fontWeight: '600'
    },
    tabContainer: {
        flex: 1
    },
    tabContentWrap: {
        flexGrow: 1,
    },
    roomWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1
    },
    roomName: {
        marginLeft: 10
    },
});

export default SettingFilledIndicatorScreen;
