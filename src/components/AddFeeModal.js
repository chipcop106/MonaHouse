import React, {useState} from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
    Icon, Input, Text, Button
} from "@ui-kitten/components";

const AddFeeModal = () => {
    const [money, setMoney] = useState('');
    const [note, setNote] = useState('');
    return (
        <>
        <View style={styles.formGroup}>
            <Text category="h5" status="primary">Thêm phí phòng 01</Text>
        </View>
       
        <View style={[styles.formGroup]}>
            <Input
                label="Số tiền"
                placeholder="0"
                keyboardType="numeric"
                value={money}
                onChangeText={(nextValue) => setMoney(nextValue)}
            />
        </View>
        <View style={[styles.formGroup]}>
            <Input
                label="Ghi chú"
                placeholder=""
                keyboardType="default"
                value={note}
                onChangeText={(nextValue) => setNote(nextValue)}
                multiline
            />
        </View>
        <Button
        status="success"
        >
            Thêm phí cho phòng này
        </Button>
        </>
    )
}

const styles = StyleSheet.create({
    formGroup:{
        marginBottom: 15
    },
})

export default AddFeeModal;