import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Datepicker, Text, IndexPath } from "@ui-kitten/components";
import IncludeElectrictWater from "../IncludeElectrictWater";
import { sizes, color, settings } from "../../config";
import { Context as RoomGoOutContext } from "../../context/RoomGoOutContext";

const GoOutInfo = () => {
    const { state, changeStateFormStep } = useContext(RoomGoOutContext);
    const stateGoOutInfo = state.dataForm[state.step];
    return (
        <>
            <View style={styles.mainWrap}>
                <View style={styles.section}>
                    <View style={[styles.formWrap]}>
                        <View style={[styles.formRow, styles.fullWidth]}>
                            <Input
                                placeholder="dd/mm/yyyy"
                                value={stateGoOutInfo.constract}
                                label="Hợp đồng"
                                accessoryLeft={() => (
                                    <View style={styles.leftInput}>
                                        <Text>12 tháng</Text>
                                    </View>
                                )}
                                disabled
                                dataService={settings.formatDateService}
                                textStyle={{ color: color.redColor }}
                                onChangeText={(nextValue) =>
                                    changeStateFormStep("constract", nextValue)
                                }
                            />
                        </View>
                        <View style={[styles.formRow, styles.halfCol]}>
                            <Datepicker
                                label="Ngày dọn vào"
                                placeholder="dd/mm/yyyy"
                                date={
                                    !!stateGoOutInfo && stateGoOutInfo.dateGoIn
                                        ? stateGoOutInfo.dateGoIn
                                        : new Date()
                                }
                                status="basic"
                                min={settings.minRangeDatePicker}
                                max={settings.maxRangeDatePicker}
                                dataService={settings.formatDateService}
                                onSelect={(nextDate) =>
                                    changeStateFormStep("dateGoIn", nextDate)
                                }
                            />
                        </View>
                        <View style={[styles.formRow, styles.halfCol]}>
                            <Datepicker
                                label="Ngày dọn ra"
                                date={
                                    !!stateGoOutInfo && stateGoOutInfo.dateGoOut
                                        ? stateGoOutInfo.dateGoOut
                                        : new Date()
                                }
                                min={stateGoOutInfo.dateGoIn}
                                max={settings.maxRangeDatePicker}
                                status="basic"
                                dataService={settings.formatDateService}
                                onSelect={(nextDate) =>
                                    changeStateFormStep("dateGoOut", nextDate)
                                }
                            />
                        </View>
                        <IncludeElectrictWater
                            index={
                                state.roomInfo?.room.TypeEW
                                    ? parseInt(state.roomInfo?.room.TypeEW) - 1
                                    : new IndexPath(3).row
                            }
                            waterTitle="Nước tháng này"
                            electrictTitle="Điện tháng này"
                            priceDisplay={false}
                            initialState={stateGoOutInfo.roomInfo}
                            handleValueChange={(stateValue) =>
                                changeStateFormStep("roomInfo", stateValue)
                            }
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        paddingHorizontal: 15,
    },
    section: {
        paddingTop: 15,
        paddingHorizontal: 10,
        marginBottom: 30,
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
        paddingHorizontal: 10,
        marginHorizontal: -10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    formRow: {
        marginBottom: 15,
        flexGrow: 1,
        marginHorizontal: "1%",
    },
    halfCol: {
        flexBasis: "48%",
    },
    fullWidth: {
        flexBasis: "98%",
    },
    leftInput: {
        borderRightWidth: 1,
        borderRightColor: color.darkColor,
        paddingRight: 10,
    },
});

export default GoOutInfo;
