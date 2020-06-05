import React, {
    useContext,
    useEffect,
    useState,
    memo,
    useReducer,
} from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Input } from "@ui-kitten/components";
import CustomSelect from "~/components/common/CustomSelect";
import { color, settings } from "~/config";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as RoomContext } from "~/context/RoomContext";
// const initialState = {
//     selectedMonthIndex: new IndexPath(0),
//     selectedMotelIndex: new IndexPath(0),
//     searchValue: "",
// }

const reducer = (prevstate, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE": {
            return {
                ...prevstate,
                [payload.key]: payload.value,
            };
        }
        default:
            return prevstate;
    }
};

const FilterHeader = ({
    advanceFilter,
    onValueChange,
    yearFilter,
    houseFilter = true,
    initialState,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [filterShow, setFilterShow] = useState(false);
    const {
        selectedMonthIndex,
        selectedMotelIndex,
        selectedYearIndex,
        searchValue,
    } = state;
    const { state: motelState } = useContext(MotelContext);

    const _onChange = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };
    useEffect(() => {
        onValueChange(state);
    }, [selectedMotelIndex, selectedMonthIndex, selectedYearIndex]);

    return (
        <View style={styles.filterWrap}>
            <View style={styles.filterSelect}>
                {houseFilter && (
                    <View
                        style={[
                            styles.filter,
                            styles.firstFilter,
                            yearFilter && styles.fullWidth,
                        ]}
                    >
                        <CustomSelect
                            selectOptions={[
                                { MotelName: "Tất cả" },
                                ...motelState.listMotels,
                            ].map((motel) => motel.MotelName)}
                            getSelectedIndex={(index) =>
                                _onChange("selectedMotelIndex", index)
                            }
                            selectedIndex={selectedMotelIndex}
                            icon="home"
                        />
                    </View>
                )}

                <View
                    style={[
                        styles.filter,
                        styles.secondFilter,
                        yearFilter && { marginLeft: 0, marginRight: 5 },
                    ]}
                >
                    <CustomSelect
                        selectOptions={settings.monthLists}
                        getSelectedIndex={(index) => {
                            _onChange("selectedMonthIndex", index);
                        }}
                        selectedIndex={selectedMonthIndex}
                        icon="calendar"
                    />
                </View>
                {yearFilter && (
                    <View style={[styles.filter, styles.secondFilter]}>
                        <CustomSelect
                            selectOptions={settings.yearLists}
                            getSelectedIndex={(index) => {
                                _onChange("selectedYearIndex", index);
                            }}
                            selectedIndex={selectedYearIndex}
                            icon="calendar"
                        />
                    </View>
                )}
                {advanceFilter && (
                    <TouchableOpacity
                        onPress={() => setFilterShow(!filterShow)}
                        style={styles.buttonFilter}
                    >
                        <Icon
                            name="funnel"
                            fill={filterShow ? color.primary : color.whiteColor}
                            style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {filterShow && (
                <View style={styles.filterSearch}>
                    <Input
                        status="transparent"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChangeText={(value) => {
                            _onChange("searchValue", value);
                        }}
                        onEndEditing={() => onValueChange(state)}
                        onSubmitEditing={() => onValueChange(state)}
                        accessoryLeft={() => (
                            <Icon
                                name="search"
                                fill={color.whiteColor}
                                style={styles.searchIcon}
                            />
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default FilterHeader;

const styles = StyleSheet.create({
    filterWrap: {
        padding: 10,
        paddingBottom: 0,
        backgroundColor: color.darkColor,
    },

    filterSelect: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    filter: {
        flexGrow: 1,
        marginBottom: 10,
    },
    fullWidth: {
        width: "100%",
    },
    firstFilter: {
        marginRight: 5,
    },

    secondFilter: {
        marginLeft: 5,
    },

    filterSearch: {
        flexGrow: 1,
        marginBottom: 10,
    },

    searchIcon: {
        width: 20,
        height: 20,
    },
    buttonFilter: {
        backgroundColor: "rgba(65,63,98,1)",
        marginLeft: 10,
        justifyContent: "center",
        paddingHorizontal: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
});
