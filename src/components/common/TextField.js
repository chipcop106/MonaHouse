import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Icon } from "@ui-kitten/components";
import { color } from "~/config";
const TextField = (props) => {
    return (
        <View>
            <Input
                {...props}
                disabled={props.disabled}
                style={props.disabled ? styles.disabledInput : props.input}
                textStyle={props.disabled ? styles.textStyle : props.textStyle}
                accessoryRight={() =>
                    props.disabled && (
                        <>
                            <Icon
                                name="lock"
                                fill={color.primary}
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </>
                    )
                }
            />
        </View>
    );
};

export default TextField;

const styles = StyleSheet.create({
    input: {
        width: "100%",
    },
    disabledInput: {
        width: "100%",
    },
    textStyle: {
        color: color.darkColor,
    },
});
