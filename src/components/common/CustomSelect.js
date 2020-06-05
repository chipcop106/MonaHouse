import React, { useState } from "react";
import {
    Icon,
    Select,
    SelectItem,
    Text,
    IndexPath,
    styled,
} from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

import { color } from "../../config";

const CustomSelect = ({
    icon,
    selectOptions,
    getSelectedIndex,
    selectedIndex,
}) => {
    return (
        <View style={styles.selectGroup}>
            <View style={styles.selectWrap}>
                <Select
                    accessoryLeft={() => (
                        <Icon
                            name={icon}
                            fill={color.whiteColor}
                            style={styles.iconStyle}
                        />
                    )}
                    size="medium"
                    status="transparent"
                    label=""
                    value={selectOptions[selectedIndex - 1]}
                    selectedIndex={selectedIndex}
                    onSelect={getSelectedIndex}
                >
                    {selectOptions &&
                        selectOptions.map((option) => (
                            <SelectItem
                                key={(option) => option}
                                title={(evaProps) => (
                                    <Text {...evaProps}>{option}</Text>
                                )}
                            />
                        ))}
                </Select>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    selectGroup: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    selectStyle: {
        borderRadius: 0,
    },
    iconWrap: {
        flexShrink: 0,
        borderRightColor: "#fff",
        borderRightWidth: 0.5,
        paddingRight: 10,
        marginRight: 10,
    },
    selectWrap: {
        flexGrow: 1,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
});

export default CustomSelect;
