import React, { useContext, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    Text,
    StyleSheet,
    View,
    processColor, TouchableOpacity
} from 'react-native';
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Picker } from '@react-native-community/picker';
import {
    Icon,
    styled,
} from "@ui-kitten/components";

import {color} from '~/config'

const ModalizeSelect =  (props) => {
    const { pickerData, selectedValue, onChange, onClose,
        leftIcon, disabled
    } = props;
    const [selected, setSelected] = useState(selectedValue || pickerData[0]);
    const modalPickerRef = useRef();
  
    const _onValueSelectChange = (itemValue, itemIndex) =>{
        if(selected !== itemValue){
            setSelected(itemValue);
            // if(!!onChange){
            //     return onChange(itemIndex, itemValue)
            // }
        }
        
    }
    const _onPress = () => {
        modalPickerRef.current?.open();
    }
    const _onClosed = () => {
        !!onChange && onChange(pickerData.indexOf(selected), selected);  
    }
    return <View>
        <TouchableOpacity
            onPress={_onPress}
            disabled={disabled}
            
        >
            <View style={[styles.selectTouch, {  }, disabled && {backgroundColor: "#f8f8f8"}]}>
                <Icon
                    name={leftIcon}
                    fill={color.whiteColor}
                    style={[styles.iconStyle, { position: "absolute", top: -10}]}
                />
                <Text style={[styles.selectedtxt,{flexGrow: 1, paddingRight: 15, backgroundColor: "transparent"}]} numberOfLines={1}>{selected}</Text>
                <Icon
                    name={'chevron-down-outline'}
                    fill={"#919cb3"}
                    style={[{width: 25, height: 25, paddingHorizontal: 0, position: "absolute", right: -5, top: -13, backgroundColor: "transparent"}]}
                />
            </View>
        </TouchableOpacity>
        <Portal>
            <Modalize
                ref={modalPickerRef}
                closeOnOverlayTap={true}
                adjustToContentHeight={true}
                onClose={_onClosed}
            >
                <Picker
                    selectedValue={selected}
                    style={{}}
                    onValueChange={_onValueSelectChange}
                >
                    {!!pickerData && pickerData.map((item, index) => <Picker.Item key={`${item}-${index}`} label={item} value={item} />)}
                </Picker>
            </Modalize>
        </Portal>
    </View>
}

export default ModalizeSelect;
const styles = StyleSheet.create({
    selectTouch: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        minHeight: 40,
        padding: 10,
        paddingVertical: 5,
        borderRadius: 4,
        backgroundColor: "#413e61",
        position: "relative"
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    selectedtxt: {
        color: "#919cb3",
        fontWeight: "600",
        paddingHorizontal: 25,
        fontSize: 14,
    }
})