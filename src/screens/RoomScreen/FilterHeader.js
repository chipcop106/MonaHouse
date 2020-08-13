import React, {
    useContext,
    useEffect,
    useState,
    memo,
    useReducer,
} from "react";
import { View, StyleSheet, 
    
    TouchableOpacity } from "react-native";
import { Icon, Input } from "@ui-kitten/components";
import CustomSelect from "~/components/common/CustomSelect";
import { color, settings } from "~/config";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as RoomContext } from "~/context/RoomContext";
import ModalizeSelect from "~/components/common/ModalizeSelect";
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
const roomSortList = ['Đến hạn thanh toán', 'Phòng trống', 'Chưa thu tiền', 'Chưa ghi điện nước']
const FilterHeader = ({
    advanceFilter,
    onValueChange,
    initialState,
    loading
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [filterShow, setFilterShow] = useState(false);
    const {
        selectedSortIndex,
        selectedMotelIndex,
        searchValue,
    } = state;
    const { state: motelState } = useContext(MotelContext);

    const _getSelectedIndex = (key) =>{

        return index => {
            console.log(key, index);
            dispatch({ type: "STATE_CHANGE", payload: { key, value: index } });
        }
    }
    useEffect(() => {
        onValueChange(state);
    }, [selectedMotelIndex, selectedSortIndex]);
    return (
        <View style={styles.filterWrap}>
            <View style={styles.filterSelect}>
                <View
                    style={[
                        styles.filter,
                        styles.firstFilter,
                        {position: "relative"}
                    ]}
                >
                
                    <View style={[StyleSheet.absoluteFill]}>
                        <ModalizeSelect 
                            disabled={loading}
                            onChange={_getSelectedIndex("selectedMotelIndex")}
                            pickerData={["Tất cả",...motelState.listMotels.map(item => item.MotelName)]}
                            selectedValue={"Tất cả"}
                            leftIcon="home"
                            disabled={loading}
                        />
                    </View>
                </View>
                <View
                    style={[
                        styles.filter,
                        styles.secondFilter,
                        {position: "relative"}
                    ]}
                >
                
                    <View style={[StyleSheet.absoluteFill]}>
                        <ModalizeSelect 
                            disabled={loading}
                            onChange={_getSelectedIndex("selectedSortIndex")}
                            pickerData={roomSortList}
                            selectedValue={roomSortList[selectedSortIndex || 0]}
                            leftIcon="funnel"
                            disabled={loading}
                        />
                    </View>
                    
                </View>
                {advanceFilter && (
                    <TouchableOpacity
                        onPress={() => setFilterShow(!filterShow)}
                        style={styles.buttonFilter}
                    >
                        <Icon
                            name="options"
                            fill={filterShow ? color.primary : color.whiteColor}
                            style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {filterShow && (
                <View style={styles.filterSearch}>
                    <Input
                        editable={loading}
                        status="transparent"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChangeText={_getSelectedIndex("searchValue")}
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

export default memo(FilterHeader);

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
        minHeight: 40,
        paddingRight: 30
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
